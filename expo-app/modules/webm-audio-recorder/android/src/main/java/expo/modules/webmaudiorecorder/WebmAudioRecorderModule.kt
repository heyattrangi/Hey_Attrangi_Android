package expo.modules.webmaudiorecorder

import android.Manifest
import android.content.pm.PackageManager
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaCodec
import android.media.MediaFormat
import android.media.MediaMuxer
import android.media.MediaRecorder
import android.os.Build
import androidx.core.content.ContextCompat
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.util.UUID
import java.util.concurrent.atomic.AtomicBoolean

private const val SAMPLE_RATE = 16000
private const val BIT_RATE = 32000
private const val MIN_SDK_FOR_OPUS_ENCODER = Build.VERSION_CODES.Q // 29

class RecordingPermissionException :
  CodedException("Recording permission was not granted")

class RecorderNotSupportedException :
  CodedException("On-device Opus encoding requires Android 10 (API 29) or newer")

class RecorderBusyException :
  CodedException("A recording is already in progress")

class NoActiveRecordingException :
  CodedException("No active recording to stop")

/**
 * Captures the mic as raw PCM (AudioRecord), encodes it to Opus
 * (MediaCodec, MIME "audio/opus" — real hardware/software Opus support was
 * added in API 29), and muxes the encoded packets into a genuine WebM
 * container (MediaMuxer.OutputFormat.MUXER_OUTPUT_WEBM). Unlike
 * MediaRecorder, this path never touches an unsupported
 * encoder/container combination — every API used here is documented to
 * support Opus-in-WebM.
 */
private class WebmRecordingSession(private val outputFile: File) {
  private var audioRecord: AudioRecord? = null
  private var codec: MediaCodec? = null
  private var muxer: MediaMuxer? = null
  private var trackIndex = -1
  private var muxerStarted = false
  private val keepRunning = AtomicBoolean(false)
  private var recordingThread: Thread? = null
  private var presentationTimeUs = 0L
  private var startError: Throwable? = null

  fun start() {
    val minBufSize = AudioRecord.getMinBufferSize(
      SAMPLE_RATE,
      AudioFormat.CHANNEL_IN_MONO,
      AudioFormat.ENCODING_PCM_16BIT
    )
    if (minBufSize <= 0) {
      throw IllegalStateException("Device does not support 16kHz mono PCM capture")
    }
    val bufferSize = minBufSize * 2

    val record = AudioRecord(
      MediaRecorder.AudioSource.VOICE_RECOGNITION,
      SAMPLE_RATE,
      AudioFormat.CHANNEL_IN_MONO,
      AudioFormat.ENCODING_PCM_16BIT,
      bufferSize
    )
    if (record.state != AudioRecord.STATE_INITIALIZED) {
      record.release()
      throw IllegalStateException("AudioRecord failed to initialize")
    }
    audioRecord = record

    val format = MediaFormat.createAudioFormat(MediaFormat.MIMETYPE_AUDIO_OPUS, SAMPLE_RATE, 1)
    format.setInteger(MediaFormat.KEY_BIT_RATE, BIT_RATE)
    format.setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, bufferSize)

    val enc = MediaCodec.createEncoderByType(MediaFormat.MIMETYPE_AUDIO_OPUS)
    enc.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
    enc.start()
    codec = enc

    muxer = MediaMuxer(outputFile.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_WEBM)

    keepRunning.set(true)
    record.startRecording()

    recordingThread = Thread({ encodeLoop(bufferSize) }, "WebmAudioRecorderThread").apply { start() }
  }

  private fun encodeLoop(bufferSize: Int) {
    try {
      val pcmBuffer = ByteArray(bufferSize)
      val bufferInfo = MediaCodec.BufferInfo()
      val enc = codec ?: return
      val record = audioRecord ?: return

      while (keepRunning.get()) {
        val read = record.read(pcmBuffer, 0, pcmBuffer.size)
        if (read > 0) {
          feedInput(enc, pcmBuffer, read, endOfStream = false)
        }
        drainOutput(enc, bufferInfo, endOfStream = false)
      }
      // Signal end-of-stream and drain whatever the encoder still has buffered.
      feedInput(enc, ByteArray(0), 0, endOfStream = true)
      drainOutput(enc, bufferInfo, endOfStream = true)
    } catch (e: Throwable) {
      startError = e
    }
  }

  private fun feedInput(enc: MediaCodec, data: ByteArray, length: Int, endOfStream: Boolean) {
    val inputIndex = enc.dequeueInputBuffer(10_000)
    if (inputIndex < 0) return

    val inputBuffer = enc.getInputBuffer(inputIndex) ?: return
    inputBuffer.clear()
    if (length > 0) {
      inputBuffer.put(data, 0, length)
    }

    val flags = if (endOfStream) MediaCodec.BUFFER_FLAG_END_OF_STREAM else 0
    enc.queueInputBuffer(inputIndex, 0, length, presentationTimeUs, flags)

    if (length > 0) {
      // 16-bit mono samples: 2 bytes per sample.
      val durationUs = (length / 2).toLong() * 1_000_000 / SAMPLE_RATE
      presentationTimeUs += durationUs
    }
  }

  private fun drainOutput(enc: MediaCodec, bufferInfo: MediaCodec.BufferInfo, endOfStream: Boolean) {
    while (true) {
      val outputIndex = enc.dequeueOutputBuffer(bufferInfo, 10_000)
      when {
        outputIndex == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED -> {
          trackIndex = muxer!!.addTrack(enc.outputFormat)
          muxer!!.start()
          muxerStarted = true
        }
        outputIndex >= 0 -> {
          val encodedData = enc.getOutputBuffer(outputIndex)
          if (encodedData != null && bufferInfo.size > 0 && muxerStarted) {
            encodedData.position(bufferInfo.offset)
            encodedData.limit(bufferInfo.offset + bufferInfo.size)
            muxer!!.writeSampleData(trackIndex, encodedData, bufferInfo)
          }
          val isEos = bufferInfo.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM != 0
          enc.releaseOutputBuffer(outputIndex, false)
          if (isEos) return
        }
        else -> {
          // MediaCodec.INFO_TRY_AGAIN_LATER (or any negative code): nothing
          // ready yet. During normal streaming we just return and pick more
          // up on the next loop iteration; during end-of-stream draining we
          // keep polling until the EOS buffer actually arrives.
          if (!endOfStream) return
        }
      }
    }
  }

  /** Stops capture/encoding and finalizes the WebM file. Blocks until the encoder thread drains. */
  fun stop(): File {
    keepRunning.set(false)
    recordingThread?.join(5_000)

    runCatching { audioRecord?.stop() }
    runCatching { audioRecord?.release() }
    runCatching { codec?.stop() }
    runCatching { codec?.release() }
    if (muxerStarted) {
      runCatching { muxer?.stop() }
    }
    runCatching { muxer?.release() }

    startError?.let { throw it }
    return outputFile
  }
}

class WebmAudioRecorderModule : Module() {
  private var session: WebmRecordingSession? = null
  private var outputFile: File? = null

  override fun definition() = ModuleDefinition {
    Name("WebmAudioRecorder")

    Function("isSupported") {
      Build.VERSION.SDK_INT >= MIN_SDK_FOR_OPUS_ENCODER
    }

    AsyncFunction("startRecording") { promise: Promise ->
      if (session != null) {
        throw RecorderBusyException()
      }
      if (Build.VERSION.SDK_INT < MIN_SDK_FOR_OPUS_ENCODER) {
        throw RecorderNotSupportedException()
      }

      val context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
      if (ContextCompat.checkSelfPermission(context, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
        throw RecordingPermissionException()
      }

      val dir = File(context.cacheDir, "WebmAudio").apply { mkdirs() }
      val file = File(dir, "recording-${UUID.randomUUID()}.webm")
      val newSession = WebmRecordingSession(file)

      try {
        newSession.start()
        session = newSession
        outputFile = file
        promise.resolve(null)
      } catch (e: Throwable) {
        promise.reject("ERR_WEBM_START", e.message ?: "Failed to start recording", e)
      }
    }

    AsyncFunction("stopRecording") { promise: Promise ->
      val current = session ?: throw NoActiveRecordingException()
      session = null

      try {
        val file = current.stop()
        promise.resolve(
          mapOf(
            "uri" to "file://${file.absolutePath}",
            "size" to file.length().toInt()
          )
        )
      } catch (e: Throwable) {
        outputFile?.delete()
        promise.reject("ERR_WEBM_STOP", e.message ?: "Failed to finalize recording", e)
      }
    }
  }
}
