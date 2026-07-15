import { create } from 'zustand';
import { getVideoSessionService } from '../services/container';
import { normalizeServiceError } from '../api/client';
import {
  ConnectionQuality,
  Session,
  SessionChatMessage,
  SessionDeviceStatus,
  SessionFeedbackDraft,
  SessionJourneyPhase,
  SessionPermissionKind,
  SessionPermissionState,
  VideoRoomCredentials,
} from '../types/domain';
import { AppError } from '../types/errors';
import { RequestStatus } from '../types/api';

interface SessionExperienceState {
  session: Session | null;
  phase: SessionJourneyPhase;
  connection: ConnectionQuality;
  devices: SessionDeviceStatus;
  credentials: VideoRoomCredentials | null;
  chat: SessionChatMessage[];
  handRaised: boolean;
  chatOpen: boolean;
  therapistJoined: boolean;
  elapsedSeconds: number;
  joinStatus: RequestStatus;
  error: AppError | null;
  feedback: SessionFeedbackDraft;
  loadSession: (sessionId: string) => Promise<void>;
  setPhase: (phase: SessionJourneyPhase) => void;
  setConnection: (q: ConnectionQuality) => void;
  setPermission: (
    kind: SessionPermissionKind,
    state: SessionPermissionState,
  ) => void;
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleSpeaker: () => void;
  switchCamera: () => void;
  toggleHand: () => void;
  setChatOpen: (open: boolean) => void;
  tickElapsed: () => void;
  joinRoom: () => Promise<void>;
  leaveRoom: () => Promise<void>;
  loadChat: () => Promise<void>;
  sendChat: (body: string) => Promise<void>;
  updateFeedback: (patch: Partial<SessionFeedbackDraft>) => void;
  submitFeedback: () => Promise<void>;
  reset: () => void;
}

const defaultDevices = (): SessionDeviceStatus => ({
  camera: 'unknown',
  microphone: 'unknown',
  notifications: 'unknown',
  network: 'granted',
  micMuted: false,
  cameraOff: false,
  speakerOn: true,
  facing: 'user',
});

const defaultFeedback = (): SessionFeedbackDraft => ({
  rating: 0,
  emotionalHelpfulness: 0,
  therapistFeedback: '',
  experience: '',
  notes: '',
});

export const useSessionExperienceStore = create<SessionExperienceState>(
  (set, get) => ({
    session: null,
    phase: 'upcoming',
    connection: 'good',
    devices: defaultDevices(),
    credentials: null,
    chat: [],
    handRaised: false,
    chatOpen: false,
    therapistJoined: false,
    elapsedSeconds: 0,
    joinStatus: 'idle',
    error: null,
    feedback: defaultFeedback(),

    reset: () =>
      set({
        session: null,
        phase: 'upcoming',
        connection: 'good',
        devices: defaultDevices(),
        credentials: null,
        chat: [],
        handRaised: false,
        chatOpen: false,
        therapistJoined: false,
        elapsedSeconds: 0,
        joinStatus: 'idle',
        error: null,
        feedback: defaultFeedback(),
      }),

    loadSession: async (sessionId) => {
      set({ joinStatus: 'loading', error: null });
      try {
        const response = await getVideoSessionService().getSessionContext(
          sessionId,
        );
        if (!response.success) throw response.error;
        set({
          session: response.data,
          phase: 'waiting_room',
          joinStatus: 'success',
        });
      } catch (error) {
        set({
          joinStatus: 'error',
          error: normalizeServiceError(error),
        });
      }
    },

    setPhase: (phase) => set({ phase }),
    setConnection: (connection) => set({ connection }),

    setPermission: (kind, state) =>
      set((s) => ({
        devices: { ...s.devices, [kind]: state },
      })),

    toggleMic: () =>
      set((s) => ({
        devices: { ...s.devices, micMuted: !s.devices.micMuted },
      })),
    toggleCamera: () =>
      set((s) => ({
        devices: { ...s.devices, cameraOff: !s.devices.cameraOff },
      })),
    toggleSpeaker: () =>
      set((s) => ({
        devices: { ...s.devices, speakerOn: !s.devices.speakerOn },
      })),
    switchCamera: () =>
      set((s) => ({
        devices: {
          ...s.devices,
          facing: s.devices.facing === 'user' ? 'environment' : 'user',
        },
      })),
    toggleHand: () => set((s) => ({ handRaised: !s.handRaised })),
    setChatOpen: (chatOpen) => set({ chatOpen }),
    tickElapsed: () =>
      set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),

    joinRoom: async () => {
      const session = get().session;
      if (!session) return;
      set({ joinStatus: 'loading', phase: 'joining', error: null });
      try {
        const response = await getVideoSessionService().joinRoom(session.id);
        if (!response.success) throw response.error;
        set({
          credentials: response.data,
          phase: 'in_session',
          joinStatus: 'success',
          therapistJoined: true,
          connection: 'excellent',
          elapsedSeconds: 0,
        });
      } catch (error) {
        set({
          joinStatus: 'error',
          phase: 'preview',
          connection: 'disconnected',
          error: normalizeServiceError(error),
        });
        throw error;
      }
    },

    leaveRoom: async () => {
      const session = get().session;
      if (session) {
        await getVideoSessionService().leaveRoom(session.id).catch(() => undefined);
      }
      set({ phase: 'summary', chatOpen: false });
    },

    loadChat: async () => {
      const session = get().session;
      if (!session) return;
      const response = await getVideoSessionService().getChat(session.id);
      if (response.success) set({ chat: response.data });
    },

    sendChat: async (body) => {
      const session = get().session;
      if (!session || !body.trim()) return;
      const response = await getVideoSessionService().sendChat(
        session.id,
        body,
      );
      if (response.success) {
        set((s) => ({ chat: [...s.chat, response.data] }));
      }
    },

    updateFeedback: (patch) =>
      set((s) => ({ feedback: { ...s.feedback, ...patch } })),

    submitFeedback: async () => {
      const session = get().session;
      if (!session) return;
      const response = await getVideoSessionService().submitFeedback(
        session.id,
        get().feedback,
      );
      if (!response.success) throw response.error;
      set({ phase: 'ended' });
    },
  }),
);
