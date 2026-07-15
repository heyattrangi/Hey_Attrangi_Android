import { useUiStore, GlobalLoaderKind } from '../store/uiStore';

export type LoadingKind = Exclude<GlobalLoaderKind, 'none'>;

/**
 * Global Loading Manager — every feature should prefer this over ad-hoc spinners.
 * Inline + skeleton remain per-screen via AsyncStateRenderer / Skeleton*.
 */
export const LoadingManager = {
  showFullScreen(message?: string): void {
    useUiStore.getState().showLoader('fullscreen', message);
  },

  showOverlay(message?: string): void {
    useUiStore.getState().showLoader('overlay', message);
  },

  showBackground(message?: string): void {
    useUiStore.getState().showLoader('background', message);
  },

  /** Marks intent for inline loaders — caller still renders ActivityIndicator */
  showInline(message?: string): void {
    useUiStore.getState().showLoader('inline', message);
  },

  hide(): void {
    useUiStore.getState().hideLoader();
  },

  async withLoader<T>(
    kind: LoadingKind,
    work: () => Promise<T>,
    message?: string,
  ): Promise<T> {
    useUiStore.getState().showLoader(kind, message);
    try {
      return await work();
    } finally {
      useUiStore.getState().hideLoader();
    }
  },
};
