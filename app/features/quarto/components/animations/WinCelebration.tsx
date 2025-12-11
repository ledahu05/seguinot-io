import { TsParticlesFireworks } from './TsParticlesFireworks';
import { DefeatOverlay } from './DefeatOverlay';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface WinCelebrationProps {
  animationType: 'firework' | 'defeat' | null;
  isPlaying: boolean;
  duration: number;
  winnerName?: string;
  onAnimationComplete: () => void;
}

export function WinCelebration({
  animationType,
  isPlaying,
  duration,
  winnerName,
  onAnimationComplete,
}: WinCelebrationProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!isPlaying || !animationType) return null;

  // Reduced motion: show static banner instead of particles
  if (prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        role="alert"
        aria-live="polite"
      >
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-4 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-black">
            {animationType === 'firework'
              ? winnerName
                ? `${winnerName} Wins!`
                : 'You Win!'
              : 'You Lost!'}
          </h2>
        </div>
      </div>
    );
  }

  // Winner celebration with fireworks
  if (animationType === 'firework') {
    return (
      <>
        <TsParticlesFireworks
          isPlaying={isPlaying}
          duration={duration}
          onComplete={onAnimationComplete}
        />
        {/* Winner text overlay */}
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-4 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-black">
              {winnerName ? `${winnerName} Wins!` : 'Quarto!'}
            </h2>
          </div>
        </div>
      </>
    );
  }

  // Defeat animation for online losers
  if (animationType === 'defeat') {
    return (
      <DefeatOverlay
        isVisible={isPlaying}
        duration={duration}
        onComplete={onAnimationComplete}
        opponentName={winnerName}
      />
    );
  }

  return null;
}

export default WinCelebration;
