# Animation Events Contract

**Feature**: 003-quarto-win-animation
**Date**: 2025-12-10

## Overview

This document defines the event contracts for win/lose celebration animations, including Redux actions and PartyKit WebSocket messages.

## Redux Actions

### animationComplete

Dispatched by the `useWinAnimation` hook after animation duration elapses.

```typescript
interface AnimationCompleteAction {
  type: 'quarto/animationComplete';
  payload: void;
}
```

**Trigger**: Called automatically after animation duration (5-10 seconds)
**Effect**: Sets `animation.status` to 'complete', allows post-animation UI to show

### setAnimationType (for online mode)

Sets the animation type based on player role in online game.

```typescript
interface SetAnimationTypeAction {
  type: 'quarto/setAnimationType';
  payload: {
    type: 'firework' | 'defeat';
    winnerId: string;
  };
}
```

**Trigger**: Called by online game hook when GAME_OVER message received
**Effect**: Updates `animation.type` based on comparison with local playerId

## PartyKit WebSocket Messages

### GAME_OVER (Server → Client)

Extended message broadcast when a Quarto is detected server-side.

```typescript
interface GameOverMessage {
  type: 'GAME_OVER';
  payload: {
    winnerId: string;              // playerId of the winner
    winnerName: string;            // display name
    winningPositions: [number, number, number, number]; // positions 0-15
    reason: 'quarto';              // always 'quarto' for this feature
  };
}
```

**Sent**: When server detects Quarto after PLACE_PIECE
**Recipients**: All connected players in the room
**Client Handling**:
```typescript
// In useOnlineGame or equivalent
if (message.type === 'GAME_OVER') {
  const isWinner = message.payload.winnerId === myPlayerId;
  dispatch(setAnimationType({
    type: isWinner ? 'firework' : 'defeat',
    winnerId: message.payload.winnerId
  }));
}
```

## Component Props Contracts

### FireworkCanvas

```typescript
interface FireworkCanvasProps {
  isPlaying: boolean;            // controls animation loop
  duration: number;              // total duration in ms
  onComplete?: () => void;       // callback when animation ends
  particleCount?: number;        // default: 80
  colors?: string[];             // default: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']
}
```

### DefeatOverlay

```typescript
interface DefeatOverlayProps {
  isVisible: boolean;            // controls visibility
  duration: number;              // total duration in ms
  onComplete?: () => void;       // callback when animation ends
  opponentName?: string;         // "Opponent wins!" vs "[Name] wins!"
}
```

### WinCelebration

Orchestrating component that renders either FireworkCanvas or DefeatOverlay.

```typescript
interface WinCelebrationProps {
  animationType: 'firework' | 'defeat' | null;
  isPlaying: boolean;
  duration: number;
  winnerName?: string;
  onAnimationComplete: () => void;
}
```

## Hook Contracts

### useWinAnimation

```typescript
interface UseWinAnimationReturn {
  isAnimationPlaying: boolean;
  animationType: 'firework' | 'defeat' | null;
  duration: number;
  timeRemaining: number;
  winningPositions: number[];
  handleAnimationComplete: () => void;
}

function useWinAnimation(): UseWinAnimationReturn;
```

**Responsibilities**:
1. Read animation state from Redux
2. Track time elapsed
3. Dispatch `animationComplete` when duration reached
4. Provide derived values for components

## Event Sequence Diagram

```
Local/AI Game:
┌─────────┐     ┌─────────────┐     ┌──────────────────┐
│ Player  │     │ QuartoSlice │     │ WinCelebration   │
└────┬────┘     └──────┬──────┘     └────────┬─────────┘
     │ placePiece      │                     │
     │────────────────>│                     │
     │                 │ (auto-detect win)   │
     │                 │ set animation state │
     │                 │ ─ ─ ─ ─ ─ ─ ─ ─ ─ >│
     │                 │                     │ render FireworkCanvas
     │                 │                     │ (5-10 seconds)
     │                 │<─ ─ ─ ─ ─ ─ ─ ─ ─ ─│ animationComplete
     │                 │ set status=complete │
     │                 │                     │ render highlighted pieces
     │                 │                     │

Online Multiplayer Game:
┌─────────┐  ┌─────────────┐  ┌───────────┐  ┌─────────────┐  ┌─────────┐
│ Winner  │  │ PartyKit    │  │ QuartoSlice│ │ WinCelebration│ │ Loser   │
└────┬────┘  └──────┬──────┘  └─────┬─────┘  └──────┬──────┘  └────┬────┘
     │ PLACE_PIECE  │               │               │               │
     │─────────────>│               │               │               │
     │              │ detect win    │               │               │
     │              │ GAME_OVER     │               │               │
     │<─────────────│──────────────>│               │               │
     │              │               │<──────────────│───────────────│
     │              │               │ setAnimation  │               │
     │              │               │ type=firework │               │
     │              │               │ ─ ─ ─ ─ ─ ─ >│ type=defeat   │
     │              │               │               │<─ ─ ─ ─ ─ ─ ─│
     │              │               │               │               │
```

## Error Handling

### Animation Interrupted

If user navigates away or refreshes during animation:
- Animation state is lost (purely visual)
- Game state (winner, winning positions) is preserved in Redux
- On reload, game shows final state without animation

### Network Failure During Online Game

If GAME_OVER message is missed:
- Client state may be stale
- On reconnect, server sends current game state
- If game is finished, animation may not play (acceptable degradation)
