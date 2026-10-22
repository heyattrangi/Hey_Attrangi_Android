import { NativeModule, requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';
import { StopRecordingResult } from './WebmAudioRecorder.types';

declare class WebmAudioRecorderModuleClass extends NativeModule<{}> {
  isSupported(): boolean;
  startRecording(): Promise<void>;
  stopRecording(): Promise<StopRecordingResult>;
}

const nativeModule = Platform.OS === 'android'
  ? requireOptionalNativeModule<WebmAudioRecorderModuleClass>('WebmAudioRecorder')
  : null;

export default {
  isSupported(): boolean {
    return Platform.OS === 'android' && nativeModule ? nativeModule.isSupported() : false;
  },
  async startRecording(): Promise<void> {
    if (Platform.OS === 'android' && nativeModule) {
      return await nativeModule.startRecording();
    }
  },
  async stopRecording(): Promise<StopRecordingResult> {
    if (Platform.OS === 'android' && nativeModule) {
      return await nativeModule.stopRecording();
    }
    return { uri: '', size: 0 };
  },
};
