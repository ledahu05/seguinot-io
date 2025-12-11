# Quickstart: Quarto Win/Lose Celebration Animations (tsParticles)

**Feature**: 003-quarto-win-animation
**Date**: 2025-12-11 (Updated)

## Prerequisites

- Existing 002-quarto-game feature fully implemented
- Node.js 20+
- pnpm

## Setup

### 1. Animation Components Directory (Already Exists)

```bash
# Directory already created
app/features/quarto/components/animations/
```

### 2. Install New Dependencies

```bash
npm install @tsparticles/react @tsparticles/fireworks
```

This adds:
- **@tsparticles/react**: React component wrapper for tsParticles
- **@tsparticles/fireworks**: Pre-configured fireworks effect bundle

## Development Workflow

### Running the Game

```bash
# Start development server
pnpm dev

# Navigate to
http://localhost:3000/games/quarto
```

### Testing Animations

```bash
# Run unit tests
pnpm test tests/unit/quarto/winAnimation.test.ts

# Run all quarto tests
pnpm test tests/unit/quarto tests/integration/quarto
```

### Testing Reduced Motion

1. In browser DevTools, press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
2. Type "Reduce motion"
3. Select "Emulate CSS prefers-reduced-motion"
4. Win a game - should show static overlay instead of particles

### Testing Online Mode

```bash
# Terminal 1: Start PartyKit dev server
pnpm party:dev

# Terminal 2: Start main app
pnpm dev

# Open two browser windows, create/join same room
# Winner should see fireworks
# Loser should see defeat animation
```

## Files to Change

### Task 1: Install Dependencies

```bash
npm install @tsparticles/react @tsparticles/fireworks
```

### Task 2: Create TsParticlesFireworks Component (NEW)

**File**: `app/features/quarto/components/animations/TsParticlesFireworks.tsx`

```typescript
import { useEffect, useRef, useState, useCallback } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFireworksBundle } from '@tsparticles/fireworks';
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
    engineInitPromise = initParticlesEngine(async (engine) => {
      await loadFireworksBundle(engine);
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

  if (!isPlaying || !ready) return null;

  const options = {
    fullScreen: { enable: false },
    background: { color: 'transparent' },
    emitters: {
      direction: 'top' as const,
      life: { duration: 0.1, delay: 0.1 },
      rate: { delay: 0.15, quantity: 1 },
      size: { width: 100, height: 0 },
      position: { y: 100, x: 50 }
    },
    particles: {
      number: { value: 0 },
      destroy: {
        mode: 'split' as const,
        split: {
          count: 1,
          factor: { value: 0.333333 },
          rate: { value: 100 },
          particles: {
            color: { value: colors },
            number: { value: 0 },
            opacity: {
              value: { min: 0.1, max: 1 },
              animation: { enable: true, speed: 0.7, startValue: 'max', destroy: 'min' }
            },
            shape: { type: 'circle' },
            size: { value: { min: 2, max: 3 } }
          }
        }
      },
      life: { count: 1, duration: { value: { min: 1, max: 2 } } },
      shape: { type: 'line' },
      size: {
        value: { min: 0.1, max: 50 },
        animation: { enable: true, speed: 90, startValue: 'max', destroy: 'min' }
      },
      stroke: { color: { value: '#ffffff' }, width: 1 },
      rotate: { path: true },
      move: {
        enable: true,
        gravity: { enable: true, acceleration: 15 },
        speed: { min: 10, max: 20 },
        outModes: { default: 'destroy' as const, top: 'none' as const }
      }
    }
  };

  return (
    <Particles
      id="fireworks"
      className="absolute inset-0 pointer-events-none z-50"
      options={options}
    />
  );
}

export default TsParticlesFireworks;
```

### Task 3: Update WinCelebration Component (MODIFY)

**File**: `app/features/quarto/components/animations/WinCelebration.tsx`

Change import from:
```typescript
import { FireworkCanvas } from './FireworkCanvas';
```

To:
```typescript
import { TsParticlesFireworks } from './TsParticlesFireworks';
```

And update the render:
```typescript
// OLD
<FireworkCanvas
  isPlaying={isPlaying}
  duration={duration}
  onComplete={onAnimationComplete}
/>

// NEW
<TsParticlesFireworks
  isPlaying={isPlaying}
  duration={duration}
  onComplete={onAnimationComplete}
/>
```

### Task 4: Update Barrel Export (MODIFY)

**File**: `app/features/quarto/components/animations/index.ts`

```typescript
// Animation components barrel export
export { TsParticlesFireworks } from './TsParticlesFireworks';
export type { TsParticlesFireworksProps } from './TsParticlesFireworks';
export { DefeatOverlay } from './DefeatOverlay';
export type { DefeatOverlayProps } from './DefeatOverlay';
export { WinCelebration } from './WinCelebration';
export type { WinCelebrationProps } from './WinCelebration';
// NOTE: FireworkCanvas export removed
```

### Task 5: Delete Old FireworkCanvas (DELETE)

**File**: `app/features/quarto/components/animations/FireworkCanvas.tsx`

Delete this file after confirming the new implementation works.

## Implementation Patterns

### tsParticles Engine Initialization Pattern

```typescript
// Singleton pattern for engine initialization
let engineInitPromise: Promise<void> | null = null;

const initEngine = () => {
  if (!engineInitPromise) {
    engineInitPromise = initParticlesEngine(async (engine) => {
      await loadFireworksBundle(engine);
    });
  }
  return engineInitPromise;
};

// Use in component
useEffect(() => {
  initEngine().then(() => setReady(true));
}, []);
```

### Animation Hook Pattern (Unchanged)

```typescript
// useWinAnimation.ts
export function useWinAnimation() {
  const animation = useAppSelector(selectAnimationState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (animation.status !== 'playing') return;

    const timeout = setTimeout(() => {
      dispatch(animationComplete());
    }, animation.duration);

    return () => clearTimeout(timeout);
  }, [animation.status, animation.duration, dispatch]);

  return {
    isPlaying: animation.status === 'playing',
    type: animation.type,
    duration: animation.duration,
    winningPositions: animation.winningPositions
  };
}
```

### Reduced Motion Pattern (Unchanged)

```typescript
// WinCelebration.tsx
const prefersReducedMotion = useReducedMotion();

if (prefersReducedMotion) {
  return (
    <div className="win-banner">
      {isWinner ? 'You Won!' : 'You Lost!'}
    </div>
  );
}

return isWinner
  ? <TsParticlesFireworks {...props} />
  : <DefeatOverlay {...props} />;
```

## Testing Checklist

Before marking implementation complete:

- [ ] Local 2P: Win triggers firework animation
- [ ] Local 2P: Animation plays 5-10 seconds
- [ ] Local 2P: Winning pieces highlighted after animation
- [ ] AI game: Same behavior as local
- [ ] Online: Winner sees fireworks
- [ ] Online: Loser sees defeat animation
- [ ] Online: Both see highlighted pieces after animation
- [ ] Reduced motion: Shows static banner, no particles
- [ ] Multiple Quartos: Single celebration, all winning pieces highlighted
- [ ] No "Call Quarto" button visible anywhere

## Common Issues

### Animation Not Playing

- Check animation.status in Redux DevTools
- Verify findWinningLine returns correct positions
- Ensure WinCelebration is mounted in play.tsx

### Particles Not Visible

- Check canvas dimensions match viewport
- Verify particle spawn positions are within bounds
- Check particle colors have sufficient contrast

### Online Animation Mismatch

- Verify winnerId is being broadcast by PartyKit
- Check playerId is stored in client state
- Ensure comparison logic is correct (string equality)

### Performance Issues

- Reduce particleCount if FPS drops
- Use object pooling instead of creating new particles
- Ensure requestAnimationFrame is cancelled on unmount
