import { Platform } from 'react-native';
import { BaseRepository } from './base/BaseRepository';
import { guestTokenManager } from '../auth/GuestTokenManager';
import { tokenManager } from '../auth/TokenManager';
import { env } from '../config/env';
import { RateLimitError } from '../types/errors';

export interface PragyaChatResponse {
  reply?: string;
  expression?: string;
  suggestions?: string[];
  action?: {
    type: string;
    title: string;
    url: string;
    rationale?: string;
    confidence?: number;
    severity?: string;
  };
  requiresLogin?: boolean;
  error?: string;
}

export interface PragyaHistoryResponse {
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface PragyaSuggestionsResponse {
  suggestions?: string[];
}

export interface TranscribeResponse {
  transcript?: string;
  error?: string;
  /** True when the backend understood the request but found no speech in the
   *  audio (silence/empty recording) — this is a normal outcome, not a
   *  failure, so callers should treat it as "nothing to transcribe" rather
   *  than surfacing an error. */
  noSpeech?: boolean;
}

const NO_SPEECH_PATTERNS = [
  'no speech',
  'no speech detected',
  'silence detected',
  'empty audio',
  'no audio detected',
  'could not detect any speech',
  'no transcription found',
  'no discernible speech',
];

function isNoSpeechMessage(message: string | undefined | null): boolean {
  if (!message) return false;
  const lower = message.toLowerCase();
  return NO_SPEECH_PATTERNS.some((pattern) => lower.includes(pattern));
}

// React Native's built-in Blob does not implement the standard
// `Blob.prototype.arrayBuffer()` — only `FileReader.readAsArrayBuffer()` is
// wired up natively (via NativeFileReaderModule). Using `.arrayBuffer()`
// throws "undefined is not a function" on-device despite type-checking fine.
function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error || new Error('Failed to read recording'));
    reader.readAsArrayBuffer(blob);
  });
}

export class ChatRepository extends BaseRepository {
  // PHASE 8L: iosSttRequestId is optional and only ever populated by the iOS
  // recorder (useSttRecorder.ts) to correlate [IOS_STT] log lines across the
  // start/stop/upload/response lifecycle. Android/Web never pass it, and the
  // extra logging below is itself gated on Platform.OS === 'ios', so this is
  // a no-op for both of those platforms.
  async transcribeAudio(fileUri: string, iosSttRequestId?: string): Promise<TranscribeResponse> {
    console.log('[STT][UPLOAD] preparing multipart');
    const isIOS = Platform.OS === 'ios';

    try {
      if (!fileUri) {
        console.error('[STT][UPLOAD] failed: missing file URI');
        return { error: 'No audio file recorded' };
      }

      const cleanUri = fileUri.startsWith('file://') ? fileUri : `file://${fileUri}`;

      const sourceFilename = cleanUri.split('/').pop() || 'recording.m4a';
      const sourceExtension = sourceFilename.split('.').pop()?.toLowerCase() || '';

      // 1. Fetch raw binary Blob from the local recorder output. This is the
      // ACTUAL recording — nothing below may rename, retype, or otherwise
      // relabel these bytes into a different container than they really are.
      const fileRes = await fetch(cleanUri);
      const rawBlob = await fileRes.blob();

      // 2. Inspect the real header bytes to determine the actual container.
      // WebM/Matroska starts with the EBML signature 1A 45 DF A3.
      // MP4/M4A starts with a 4-byte box size followed by an 'ftyp' box tag
      // at byte offset 4-7.
      const headerBytes = new Uint8Array(await readBlobAsArrayBuffer(rawBlob.slice(0, 12)));
      const headerHex = Array.from(headerBytes).map((b) => b.toString(16).padStart(2, '0')).join(' ');
      const isWebM =
        headerBytes[0] === 0x1a && headerBytes[1] === 0x45 && headerBytes[2] === 0xdf && headerBytes[3] === 0xa3;
      const isM4a =
        headerBytes[4] === 0x66 && headerBytes[5] === 0x74 && headerBytes[6] === 0x79 && headerBytes[7] === 0x70; // 'ftyp'
      const detectedContainer = isWebM ? 'webm' : isM4a ? 'm4a' : 'unknown';

      console.log('[STT][FORMAT]');
      console.log(`  sourceUri=${cleanUri}`);
      console.log(`  sourceExtension=${sourceExtension}`);
      console.log(`  sourceMime=${rawBlob.type || '(none)'}`);
      console.log(`  sourceSize=${rawBlob.size}`);
      console.log(`  sourceHeader=${headerHex}`);
      console.log(`  detectedContainer=${detectedContainer}`);

      if (detectedContainer === 'unknown') {
        console.error('[STT][FORMAT] refusing to upload: unrecognized container, recording is likely corrupt');
        return { error: 'Recording could not be read. Please try again.' };
      }

      const uploadFilename = detectedContainer === 'webm' ? 'recording.webm' : 'recording.m4a';
      const outputMime = detectedContainer === 'webm' ? 'audio/webm' : 'audio/m4a';
      const audioBlob = rawBlob.type === outputMime ? rawBlob : new Blob([rawBlob], { type: outputMime });

      let baseUrl = env.API_BASE_URL;
      if (baseUrl.startsWith('mock://') || !baseUrl) {
        baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:3000';
      }
      const targetUrl = `${baseUrl.replace(/\/$/, '')}/api/speech/transcribe`;

      console.log('[STT][UPLOAD]');
      console.log(`  filename=${uploadFilename}`);
      console.log(`  mime=${outputMime}`);
      console.log(`  size=${audioBlob.size}`);
      console.log(`  endpoint=${targetUrl}`);

      if (isIOS) {
        console.log(
          `[IOS_STT][UPLOAD] requestId=${iosSttRequestId || 'n/a'} filename=${uploadFilename} mime=${outputMime} size=${audioBlob.size}`
        );
      }

      const headers: Record<string, string> = {};
      const authToken = await tokenManager.getAccessToken();
      if (authToken) {
        headers.Cookie = `authjs.session-token=${authToken}; next-auth.session-token=${authToken}`;
        headers.Authorization = `Bearer ${authToken}`;
      }

      let guestToken = await guestTokenManager.getGuestToken();
      if (!authToken && !guestToken) {
        try {
          const guestSession = await this.initGuestSession();
          guestToken = guestSession.guestToken || (await guestTokenManager.getGuestToken());
        } catch (_) {
          // Ignore fallback if guest session init fails
        }
      }
      if (guestToken) {
        const existingCookie = headers.Cookie ? `${headers.Cookie}; ` : '';
        headers.Cookie = `${existingCookie}pragya_guest_token=${guestToken}`;
      }

      console.log('[STT][UPLOAD] request dispatched to', targetUrl);

      const isWebClient = typeof window !== 'undefined' && typeof (window as any).document !== 'undefined';
      let status = 500;
      let responseText = '';

      if (isWebClient) {
        const formData = new FormData();
        formData.append('audio', audioBlob, uploadFilename);
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: { Accept: 'application/json', 'X-HeyAttrangi-Platform': 'web', ...headers },
          body: formData,
        });
        status = res.status;
        responseText = await res.text();
      } else {
        // Native React Native transport (Android & iOS) via XHR to guarantee RCTHTTPRequestHandler / OkHttp native file streaming
        const formData = new FormData();
        formData.append('audio', {
          uri: cleanUri,
          name: uploadFilename,
          type: outputMime,
        } as any);

        // PHASE 8H: identifies the calling platform for the backend's temporary
        // iOS-only forensic-testing quota bypass (see route.ts). Android must
        // never send 'ios' here.
        const nativePlatformHeader = Platform.OS === 'ios' ? 'ios' : 'android';

        const xhrRes = await new Promise<{ status: number; text: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', targetUrl);
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.setRequestHeader('X-HeyAttrangi-Platform', nativePlatformHeader);
          if (headers.Cookie) xhr.setRequestHeader('Cookie', headers.Cookie);
          if (headers.Authorization) xhr.setRequestHeader('Authorization', headers.Authorization);

          xhr.onload = () => resolve({ status: xhr.status, text: xhr.responseText });
          xhr.onerror = () => reject(new Error(xhr.responseText || `HTTP status ${xhr.status}`));
          xhr.ontimeout = () => reject(new Error('Network request timed out'));
          xhr.send(formData);
        });
        status = xhrRes.status;
        responseText = xhrRes.text;
      }

      console.log(`[STT][UPLOAD] response received status=${status}`);

      if (isIOS) {
        const contentTypeHint = responseText.trim().startsWith('{') ? 'application/json (inferred)' : 'unknown';
        console.log(
          `[IOS_STT][RESPONSE] requestId=${iosSttRequestId || 'n/a'} status=${status} contentType=${contentTypeHint} bodyLength=${responseText.length}`
        );
        console.log(
          `[IOS_STT][RESPONSE_BODY] requestId=${iosSttRequestId || 'n/a'} status=${status} body=${responseText.slice(0, 500)}`
        );
      }

      if (status >= 200 && status < 300) {
        let data: TranscribeResponse | null = null;
        try {
          data = JSON.parse(responseText) as TranscribeResponse;
        } catch (_) {}

        if (data?.transcript) {
          console.log('[STT][TRANSCRIPT]', `"${data.transcript}"`);
          if (isIOS) {
            console.log(
              `[IOS_STT][TRANSCRIPT] requestId=${iosSttRequestId || 'n/a'} length=${data.transcript.length} textPreview="${data.transcript.slice(0, 40)}"`
            );
          }
          return data;
        } else if (!data?.transcript && isNoSpeechMessage(data?.error)) {
          console.log('[STT][UPLOAD] no speech detected (200 response)');
          if (isIOS) {
            console.log(`[IOS_STT][TRANSCRIPT] requestId=${iosSttRequestId || 'n/a'} length=0 outcome=noSpeech(200)`);
          }
          return { noSpeech: true };
        }
        if (isIOS) {
          console.log(`[IOS_STT][TRANSCRIPT] requestId=${iosSttRequestId || 'n/a'} length=0 outcome=unrecognizedShape`);
        }
        return data || { error: 'Empty response' };
      } else {
        console.error(`[STT][UPLOAD] server status=${status}`);
        console.error(`[STT][UPLOAD] server response=${responseText}`);
        if (status === 429 || responseText.includes('LIMIT_EXCEEDED')) {
          throw new RateLimitError(responseText || 'Daily voice limit reached');
        }

        let parsedMessage = responseText;
        try {
          const parsed = JSON.parse(responseText);
          parsedMessage = parsed?.error || parsed?.message || responseText;
        } catch {
          // Response body wasn't JSON — fall back to the raw text.
        }

        if (isNoSpeechMessage(parsedMessage)) {
          console.log('[STT][UPLOAD] no speech detected');
          if (isIOS) {
            console.log(`[IOS_STT][TRANSCRIPT] requestId=${iosSttRequestId || 'n/a'} length=0 outcome=noSpeech(${status})`);
          }
          return { noSpeech: true };
        }

        if (isIOS) {
          console.log(`[IOS_STT][TRANSCRIPT] requestId=${iosSttRequestId || 'n/a'} length=0 outcome=error(${status})`);
        }
        return { error: parsedMessage || `Server error (${status})` };
      }
    } catch (err: any) {
      if (err instanceof RateLimitError) throw err;
      console.error('[STT][UPLOAD] failed', err?.message || err);
      return { error: err?.message || 'Transcription failed' };
    }
  }
  async initGuestSession(): Promise<{ conversationId?: string; guestToken?: string }> {
    let existingToken = await guestTokenManager.getGuestToken();
    const headers: Record<string, string> = {};
    if (existingToken) {
      headers.Cookie = `pragya_guest_token=${existingToken}`;
    }

    const res = await this.http.post<{ conversationId?: string; requiresLogin?: boolean }>(
      '/api/pragya/session',
      {},
      { skipAuth: true, headers },
    );

    const setCookie = res.headers?.['set-cookie'] || res.headers?.['Set-Cookie'];
    if (setCookie) {
      const match = setCookie.match(/pragya_guest_token=([^;]+)/);
      if (match && match[1]) {
        await guestTokenManager.setGuestToken(match[1]);
        existingToken = match[1];
      }
    }

    return {
      conversationId: res.data?.conversationId,
      guestToken: existingToken ?? undefined,
    };
  }

  async sendGuestMessage(message: string, mode?: string): Promise<PragyaChatResponse> {
    let guestToken = await guestTokenManager.getGuestToken();
    if (!guestToken) {
      const session = await this.initGuestSession();
      guestToken = session.guestToken ?? null;
    }

    const headers: Record<string, string> = {};
    if (guestToken) {
      headers.Cookie = `pragya_guest_token=${guestToken}`;
    }

    const res = await this.http.post<PragyaChatResponse>(
      '/api/pragya/chat',
      {
        message,
        mode,
        generate_suggestions: true,
        client_time: new Date().toISOString(),
      },
      { skipAuth: true, headers },
    );

    const setCookie = res.headers?.['set-cookie'] || res.headers?.['Set-Cookie'];
    if (setCookie) {
      const match = setCookie.match(/pragya_guest_token=([^;]+)/);
      if (match && match[1]) {
        await guestTokenManager.setGuestToken(match[1]);
      }
    }

    return res.data;
  }

  async sendMessage(
    message: string,
    mode?: string,
    sessionId?: string,
  ): Promise<PragyaChatResponse> {
    const { data } = await this.http.post<PragyaChatResponse>('/api/pragya/chat', {
      message,
      mode,
      session_id: sessionId,
      generate_suggestions: true,
    });
    return data;
  }

  async getHistory(): Promise<PragyaHistoryResponse> {
    const { data } = await this.http.get<PragyaHistoryResponse>('/api/pragya/history');
    return data;
  }

  async getSuggestions(sessionId?: string): Promise<PragyaSuggestionsResponse> {
    const { data } = await this.http.post<PragyaSuggestionsResponse>('/api/pragya/suggestions', {
      session_id: sessionId,
    });
    return data;
  }
}

export const chatRepository = new ChatRepository();
