import { create } from 'zustand';
import { EmptyKind, LoadingDomain, UiStateKey } from '../app/ui-states';

/** High-level visual mode a screen can display */
export type ScreenUiMode =
  | 'content'
  | 'loading'
  | 'empty'
  | 'error'
  | 'offline'
  | 'success';

export type DialogKind =
  | 'logout'
  | 'cancelSession'
  | 'discardChanges'
  | 'passwordChanged'
  | 'sessionCancelled'
  | null;

export interface ScreenUiOverride {
  mode: ScreenUiMode;
  /** Catalog key for empty/error/success variants */
  variant?: UiStateKey;
  emptyKind?: EmptyKind;
  loadingDomain?: LoadingDomain;
  errorVariant?: 'server' | 'generic' | 'sessionExpired' | 'booking' | 'payment';
  successVariant?: 'booking' | 'payment' | 'moodSaved' | 'passwordChanged' | 'sessionCancelled';
}

interface DialogState {
  kind: DialogKind;
  visible: boolean;
}

interface UiStateStore {
  /** Per-screen overrides (screenId → state). Cleared when mode returns to content. */
  screens: Record<string, ScreenUiOverride>;
  dialog: DialogState;

  setScreenState: (screenId: string, override: ScreenUiOverride) => void;
  clearScreenState: (screenId: string) => void;
  getScreenState: (screenId: string) => ScreenUiOverride | undefined;

  openDialog: (kind: NonNullable<DialogKind>) => void;
  closeDialog: () => void;
}

export const useUiStateStore = create<UiStateStore>((set, get) => ({
  screens: {},
  dialog: { kind: null, visible: false },

  setScreenState: (screenId, override) =>
    set((state) => ({
      screens: { ...state.screens, [screenId]: override },
    })),

  clearScreenState: (screenId) =>
    set((state) => {
      const next = { ...state.screens };
      delete next[screenId];
      return { screens: next };
    }),

  getScreenState: (screenId) => get().screens[screenId],

  openDialog: (kind) => set({ dialog: { kind, visible: true } }),
  closeDialog: () => set({ dialog: { kind: null, visible: false } }),
}));
