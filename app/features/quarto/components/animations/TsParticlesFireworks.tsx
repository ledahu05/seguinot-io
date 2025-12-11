import { useEffect, useRef, useState, useCallback } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFireworksPreset } from '@tsparticles/preset-fireworks';
import type { ISourceOptions, Engine } from '@tsparticles/engine';
import { FIREWORK_COLORS } from '../../types/quarto.types';

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
  const options: ISourceOptions = {
    preset: 'fireworks',
    fullScreen: { enable: false },
    background: { color: 'transparent' },
    particles: {
      color: { value: colors },
    },
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
