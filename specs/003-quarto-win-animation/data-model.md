# Data Model: Quarto Win/Lose Celebration Animations (tsParticles)

**Feature**: 003-quarto-win-animation
**Date**: 2025-12-11 (Updated)

## Entity Definitions

### AnimationState (Existing - No Changes)

The state of the celebration/defeat animation.

```typescript
type AnimationStatus = 'idle' | 'playing' | 'complete';
type AnimationType = 'firework' | 'defeat' | null;

interface AnimationState {
  status: AnimationStatus;
  type: AnimationType;
  startedAt: number | null;       // timestamp when animation started
  duration: number;               // 5000-10000ms
  winningPositions: number[];     // board positions [0-15] that form the Quarto
}
```

**Validation Rules**:
- `duration` must be between 5000 and 10000 milliseconds
- `winningPositions` must have exactly 4 elements when status is 'playing' or 'complete'
- `startedAt` is set when status transitions to 'playing'
- `type` is determined by game mode and player role

### TsParticlesFireworksProps (NEW)

Props for the new tsParticles-based fireworks component.

```typescript
interface TsParticlesFireworksProps {
  isPlaying: boolean;             // Whether animation should be active
  duration: number;               // Duration in ms (5000-10000)
  onComplete?: () => void;        // Callback when animation ends
  colors?: string[];              // Custom firework colors (optional)
}
```

**Default Values**:
- `colors`: `['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']` (from FIREWORK_COLORS constant)

### TsParticlesOptions (Configuration Type)

Configuration object for tsParticles. Simplified type representing the options we use:

```typescript
interface TsParticlesOptions {
  fullScreen: { enable: boolean };
  background: { color: string };
  emitters: EmitterOptions;
  particles: ParticleOptions;
}

interface EmitterOptions {
  direction: 'top' | 'bottom' | 'left' | 'right' | string;
  life: { duration: number; delay: number };
  rate: { delay: number; quantity: number };
  size: { width: number; height: number };
  position: { x: number; y: number };
}

interface ParticleOptions {
  number: { value: number };
  destroy: DestroyOptions;
  life: { count: number; duration: { value: { min: number; max: number } } };
  shape: { type: string };
  size: { value: { min: number; max: number }; animation: { enable: boolean } };
  stroke: { color: { value: string }; width: number };
  rotate: { path: boolean };
  move: MoveOptions;
}

interface DestroyOptions {
  mode: 'split';
  split: {
    count: number;
    factor: { value: number };
    rate: { value: number };
    particles: {
      color: { value: string[] };
      number: { value: number };
      opacity: { value: { min: number; max: number }; animation: { enable: boolean } };
      shape: { type: string };
      size: { value: { min: number; max: number } };
    };
  };
}

interface MoveOptions {
  enable: boolean;
  gravity: { enable: boolean; acceleration: number };
  speed: { min: number; max: number };
  outModes: { default: string; top: string };
}
```

**Note**: Full TypeScript types are provided by `@tsparticles/react` package. These simplified types are for documentation purposes.

### GameOutcome (Existing - No Changes)

Extended game outcome for animation purposes.

```typescript
interface GameOutcome {
  winner: 0 | 1 | 'draw' | null;  // player index or draw
  winnerId: string | null;        // for online: the playerId who won
  winningPositions: number[];     // [0-15] positions forming Quarto
  isLocalPlayerWinner: boolean;   // derived: determines animation type
}
```

**State Transitions**:
```
null → { winner: 0|1, winningPositions: [...], winnerId: '...', isLocalPlayerWinner: true|false }
```

## Redux State Extensions (Existing - No Changes)

### Quarto Slice State

Animation state already exists in QuartoState:

```typescript
interface QuartoState {
  // ... existing fields ...
  animation: AnimationState;
  winner: 0 | 1 | 'draw' | null;
  winningPositions: number[];
}
```

### Initial Animation State (Already Implemented)

```typescript
const initialAnimationState: AnimationState = {
  status: 'idle',
  type: null,
  startedAt: null,
  duration: 7000,  // default, randomized on win
  winningPositions: []
};
```

## State Transitions (Existing - No Changes)

### Win Detection Flow (Already Implemented)

```
1. placePiece action dispatched
2. Reducer places piece on board
3. Reducer calls findWinningLine(board)
4. If winning line found:
   a. Set winner = currentTurn
   b. Set winningPositions = winning line
   c. Set status = 'finished'
   d. Set animation.status = 'playing'
   e. Set animation.type based on mode/role
   f. Set animation.startedAt = Date.now()
   g. Set animation.duration = random(5000, 10000)
```

### Animation Lifecycle (Unchanged)

```
idle → playing (on win detection)
playing → complete (after duration elapsed)
complete → idle (on new game)
```

## Component Architecture (Updated for tsParticles)

### Old Architecture (Being Replaced)

```
WinCelebration
    └── FireworkCanvas (custom canvas implementation)
    └── DefeatOverlay (Framer Motion + canvas)
```

### New Architecture (tsParticles)

```
WinCelebration
    └── TsParticlesFireworks (NEW: @tsparticles/react wrapper)
    └── DefeatOverlay (unchanged: Framer Motion + canvas)
```

### Component Props Interface

```typescript
// TsParticlesFireworks.tsx (NEW)
interface TsParticlesFireworksProps {
  isPlaying: boolean;
  duration: number;
  onComplete?: () => void;
  colors?: string[];
}

// WinCelebration.tsx (UPDATED imports only)
interface WinCelebrationProps {
  animationType: 'firework' | 'defeat' | null;
  isPlaying: boolean;
  duration: number;
  winnerName?: string;
  onAnimationComplete: () => void;
}

// DefeatOverlay.tsx (unchanged)
interface DefeatOverlayProps {
  isVisible: boolean;
  duration: number;
  onComplete?: () => void;
  opponentName?: string;
}
```

## API Changes

**No Redux API changes required** - this is a pure component replacement.

### Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `TsParticlesFireworks.tsx` | NEW | tsParticles wrapper component |
| `WinCelebration.tsx` | MODIFY | Import TsParticlesFireworks instead of FireworkCanvas |
| `index.ts` | MODIFY | Export TsParticlesFireworks |
| `FireworkCanvas.tsx` | DELETE | No longer needed |
| `package.json` | MODIFY | Add @tsparticles/react, @tsparticles/fireworks |
