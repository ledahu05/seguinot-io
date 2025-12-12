/**
 * Hook for sharing content via Web Share API with clipboard fallback.
 * On mobile devices with Web Share API support, opens native share sheet.
 * On desktop or unsupported browsers, copies to clipboard.
 */

export type ShareResult =
  | { status: 'shared' }
  | { status: 'copied' }
  | { status: 'error'; message: string };

export interface UseShareResult {
  share: (url: string, title?: string, text?: string) => Promise<ShareResult>;
  canNativeShare: boolean;
}

export function useShare(): UseShareResult {
  const canNativeShare =
    typeof navigator !== 'undefined' &&
    'share' in navigator &&
    typeof navigator.canShare === 'function';

  const share = async (
    url: string,
    title?: string,
    text?: string
  ): Promise<ShareResult> => {
    try {
      // Try native share on supported devices
      if (canNativeShare && navigator.canShare?.({ url })) {
        await navigator.share({ url, title, text });
        return { status: 'shared' };
      }

      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      return { status: 'copied' };
    } catch (err) {
      // User cancelled native share - not an error
      if (err instanceof Error && err.name === 'AbortError') {
        return { status: 'shared' };
      }

      // Try clipboard as last resort
      try {
        await navigator.clipboard.writeText(url);
        return { status: 'copied' };
      } catch {
        return { status: 'error', message: 'Failed to share or copy link' };
      }
    }
  };

  return { share, canNativeShare };
}
