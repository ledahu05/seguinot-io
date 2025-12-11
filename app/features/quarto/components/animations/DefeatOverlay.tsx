import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface DefeatOverlayProps {
  isVisible: boolean;
  duration: number;
  onComplete?: () => void;
  opponentName?: string;
}

interface FallingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
}

const PARTICLE_COUNT = 40;
const PARTICLE_COLORS = ['#64748b', '#475569', '#94a3b8', '#334155'];

export function DefeatOverlay({
  isVisible,
  duration,
  onComplete,
  opponentName,
}: DefeatOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FallingParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isVisible || prefersReducedMotion || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Initialize particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height, // Start above viewport
      size: 2 + Math.random() * 4,
      speed: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.5,
    }));

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (const p of particlesRef.current) {
        p.y += p.speed;
        p.x += p.drift;

        // Reset particle if it goes off screen
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        // Fade out in last 20% of animation
        const fadeAlpha = progress > 0.8 ? 1 - ((progress - 0.8) / 0.2) : 1;

        ctx.globalAlpha = p.opacity * fadeAlpha;
        ctx.fillStyle = PARTICLE_COLORS[p.id % PARTICLE_COLORS.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', updateSize);
    };
  }, [isVisible, duration, onComplete, prefersReducedMotion]);

  // Auto-complete for reduced motion
  useEffect(() => {
    if (!isVisible || !prefersReducedMotion) return;

    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, prefersReducedMotion, duration, onComplete]);

  if (!isVisible) return null;

  // Reduced motion: show static banner
  if (prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"
        role="alert"
        aria-live="polite"
      >
        <div className="bg-slate-800 px-8 py-4 rounded-xl shadow-2xl border border-slate-600">
          <h2 className="text-3xl font-bold text-slate-300">
            {opponentName ? `${opponentName} Wins!` : 'You Lost!'}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 z-50 pointer-events-none"
        role="alert"
        aria-live="polite"
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Falling particles canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Defeat text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-slate-800/90 px-8 py-4 rounded-xl shadow-2xl border border-slate-600"
          >
            <h2 className="text-3xl font-bold text-slate-300">
              {opponentName ? `${opponentName} Wins!` : 'You Lost!'}
            </h2>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DefeatOverlay;
