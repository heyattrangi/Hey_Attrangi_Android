import { create } from 'zustand';
import { Motion } from '../app/design-system';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type BannerType = 'success' | 'error' | 'warning' | 'info';

export type GlobalLoaderKind =
  | 'none'
  | 'fullscreen'
  | 'overlay'
  | 'inline'
  | 'background';

export interface SnackbarState {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface BannerState {
  type: BannerType;
  message: string;
}

interface UiState {
  toastMessage: string | null;
  toastType: ToastType;
  snackbar: SnackbarState | null;
  banner: BannerState | null;
  globalLoader: GlobalLoaderKind;
  loaderMessage: string | null;

  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
  showSnackbar: (snackbar: SnackbarState) => void;
  hideSnackbar: () => void;
  showBanner: (type: BannerType, message: string) => void;
  hideBanner: () => void;
  showLoader: (kind?: Exclude<GlobalLoaderKind, 'none'>, message?: string) => void;
  hideLoader: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;
let snackbarTimer: ReturnType<typeof setTimeout> | null = null;
let bannerTimer: ReturnType<typeof setTimeout> | null = null;

export const useUiStore = create<UiState>((set) => ({
  toastMessage: null,
  toastType: 'success',
  snackbar: null,
  banner: null,
  globalLoader: 'none',
  loaderMessage: null,

  showToast: (message, type = 'success') => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toastMessage: message, toastType: type });
    toastTimer = setTimeout(() => {
      set({ toastMessage: null });
      toastTimer = null;
    }, Motion.duration.toast);
  },

  hideToast: () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    set({ toastMessage: null });
  },

  showSnackbar: (snackbar) => {
    if (snackbarTimer) clearTimeout(snackbarTimer);
    set({ snackbar });
    snackbarTimer = setTimeout(() => {
      set({ snackbar: null });
      snackbarTimer = null;
    }, Motion.duration.toast + 1200);
  },

  hideSnackbar: () => {
    if (snackbarTimer) {
      clearTimeout(snackbarTimer);
      snackbarTimer = null;
    }
    set({ snackbar: null });
  },

  showBanner: (type, message) => {
    if (bannerTimer) clearTimeout(bannerTimer);
    set({ banner: { type, message } });
    bannerTimer = setTimeout(() => {
      set({ banner: null });
      bannerTimer = null;
    }, Motion.duration.toast + 800);
  },

  hideBanner: () => {
    if (bannerTimer) {
      clearTimeout(bannerTimer);
      bannerTimer = null;
    }
    set({ banner: null });
  },

  showLoader: (kind = 'overlay', message) =>
    set({ globalLoader: kind, loaderMessage: message ?? null }),

  hideLoader: () => set({ globalLoader: 'none', loaderMessage: null }),
}));
