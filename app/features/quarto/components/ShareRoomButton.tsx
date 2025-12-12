import { useState, useCallback } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { useShare } from '@/lib/hooks/useShare';
import { generateShareLink } from '../utils/shareLink';

interface ShareRoomButtonProps {
  roomCode: string;
  className?: string;
}

type FeedbackStatus = 'idle' | 'copied' | 'shared' | 'error';

export function ShareRoomButton({ roomCode, className = '' }: ShareRoomButtonProps) {
  const [status, setStatus] = useState<FeedbackStatus>('idle');
  const { share, canNativeShare } = useShare();

  const handleShare = useCallback(async () => {
    const shareLink = generateShareLink(roomCode);
    const result = await share(shareLink, 'Join my Quarto game!');

    if (result.status === 'copied') {
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } else if (result.status === 'shared') {
      setStatus('shared');
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [roomCode, share]);

  const getIcon = () => {
    if (status === 'copied' || status === 'shared') {
      return <Check className="h-5 w-5" aria-hidden="true" />;
    }
    if (canNativeShare) {
      return <Share2 className="h-5 w-5" aria-hidden="true" />;
    }
    return <Copy className="h-5 w-5" aria-hidden="true" />;
  };

  const getLabel = () => {
    if (status === 'copied') return 'Link Copied!';
    if (status === 'shared') return 'Shared!';
    if (status === 'error') return 'Failed to share';
    if (canNativeShare) return 'Share Invite Link';
    return 'Copy Invite Link';
  };

  const getAriaLabel = () => {
    if (status === 'copied') return 'Link copied to clipboard';
    if (status === 'shared') return 'Link shared successfully';
    if (status === 'error') return 'Failed to share link';
    return 'Share invite link to this game room';
  };

  return (
    <button
      onClick={handleShare}
      disabled={status !== 'idle'}
      aria-label={getAriaLabel()}
      aria-live="polite"
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2
        font-medium transition-all
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${
          status === 'copied' || status === 'shared'
            ? 'bg-emerald-600 text-white'
            : status === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-emerald-500 text-white hover:bg-emerald-400'
        }
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </button>
  );
}
