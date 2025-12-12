import { useEffect, useRef, useState, useCallback } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFireworksPreset } from '@tsparticles/preset-fireworks';
import type { ISourceOptions, Engine } from '@tsparticles/engine';
import { FIREWORK_COLORS } from '../../types/quarto.types';
import { useIsMobile } from '../../hooks/useIsMobile';

export interface TsParticlesFireworksProps {
  isPlaying: boolean;
  duration: number;
  onComplete?: () => void;
  colors?: string[];
}

// Initialize engine once (singleton pattern)
let engineInitPromise: Promise<void> | null = null;

const initEngine = () => {
  if (!engineInitPromise) {
    engineInitPromise = initParticlesEngine(async (engine: Engine) => {
      await loadFireworksPreset(engine);
    });
  }
  return engineInitPromise;
};

export function TsParticlesFireworks({
  isPlaying,
  duration,
  onComplete,
  colors = FIREWORK_COLORS,
}: TsParticlesFireworksProps) {
  const [ready, setReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();

  // Initialize engine on first render
  useEffect(() => {
    initEngine().then(() => setReady(true));
  }, []);

  // Handle duration timeout
  useEffect(() => {
    if (!isPlaying || !ready) return;

    timeoutRef.current = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, duration, onComplete, ready]);

  // Callback when particles are loaded
  const particlesLoaded = useCallback(async () => {
    // Particles loaded successfully
  }, []);

  if (!isPlaying || !ready) return null;

  // Using the fireworks preset with custom configuration
  // Mobile: reduced particle count and emitter frequency for better performance
  const options: ISourceOptions = {
    preset: 'fireworks',
    fullScreen: { enable: false },
    background: { color: 'transparent' },
    particles: {
      color: { value: colors },
      number: {
        value: isMobile ? 25 : 50,
      },
    },
    emitters: isMobile
      ? {
          rate: {
            quantity: 2, // Fewer particles per burst (default ~5-8)
            delay: 0.4, // Less frequent bursts (default ~0.1-0.2)
          },
        }
      : undefined,
  };

  return (
    <Particles
      id="fireworks"
      className="absolute inset-0 pointer-events-none z-50"
      options={options}
      particlesLoaded={particlesLoaded}
    />
  );
}

export default TsParticlesFireworks;
