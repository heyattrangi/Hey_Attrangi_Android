import { Session, WaitingRoomTip } from '../types/domain';
import { mockSessions } from './mockSessions';

/** Enrich sessions with countdown / therapist meta for the therapy journey. */
export const enrichSessionForJourney = (session: Session): Session => {
  const durationMinutes = session.durationMinutes ?? 60;
  // Mock: session starts in ~8 minutes from “now” for demo countdown
  const startsAt =
    session.startsAt ??
    new Date(Date.now() + 8 * 60 * 1000).toISOString();
  return {
    ...session,
    durationMinutes,
    startsAt,
    therapistSpecialty: session.therapistSpecialty ?? 'Clinical Psychology',
    therapistQualification:
      session.therapistQualification ?? 'M.Phil · RCI Registered',
  };
};

export const mockJourneySessions: Session[] = mockSessions.map(
  enrichSessionForJourney,
);

export const WAITING_ROOM_TIPS: WaitingRoomTip[] = [
  { id: 't1', text: 'Find a quiet, private space where you feel safe.' },
  { id: 't2', text: 'Use headphones for clearer audio and privacy.' },
  { id: 't3', text: 'Keep water nearby and sit comfortably.' },
  { id: 't4', text: 'Test your camera lighting — face a soft light source.' },
];

export const SESSION_PREP_MESSAGES = [
  'Connecting securely…',
  'Loading camera…',
  'Loading audio…',
  'Waiting for your therapist…',
];
