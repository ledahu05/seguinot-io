# Implementation Plan: Online Game End-Screen Bug Fix

**Branch**: `003-quarto-win-animation` | **Date**: 2025-12-11 | **Spec**: [spec.md](./spec.md)
**Input**: Bug report - "In multiplayer when a player wins, both players are redirected to the You Win!/You Lose! screen. They should remain on the same game screen with the firework/defeat animations and then see the highlighted winning pieces."

## Summary

**Bug**: The online game page (`online.tsx`) has an early return when `isGameOver` is true that shows a static "You Win!/You Lose!" screen instead of showing the game board with:
1. The win/defeat animations
2. The highlighted winning pieces

**Fix**: Remove the early return and let the game continue showing the board with the animation overlay, then show the winning pieces highlighted. Only show "Back to Menu" button after animation completes.

## Root Cause Analysis

In `/app/routes/games/quarto/online.tsx` lines 215-239:

```tsx
// Game over screen
if (isGameOver) {
  return (
    <div className="...">
      <h2>You Win!/You Lose!</h2>
      <button>Back to Menu</button>
    </div>
  );
}
```

This early return:
1. Prevents the `WinCelebration` component from rendering
2. Prevents the Board3D from showing with highlighted winning pieces
3. Immediately shows a static screen instead of the animation

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Node.js 20+
**Primary Dependencies**: TanStack Start, React Three Fiber, Redux Toolkit, PartyKit
**Storage**: In-memory (Redux) + PartyKit room state
**Testing**: Vitest (unit), Playwright (e2e)
**Target Platform**: Modern browsers
**Project Type**: Web application

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | ✅ PASS | Bug fix in route component |
| II. Tech Stack | ✅ PASS | No changes to tech stack |
| III. Testing First | ⚠️ N/A | Manual testing sufficient for UI bug |
| IV. Accessibility | ✅ PASS | No accessibility changes |
| V. Performance | ✅ PASS | No performance impact |
| VI. Minimal Dependencies | ✅ PASS | No new dependencies |

## Fix Approach

### Option 1: Remove Early Return (Recommended)

Remove the `isGameOver` early return block entirely. The game view already has:
- `WinCelebration` component for animations
- `Board3D` with winning line highlighting
- Side panel with game status

**Changes needed**:
1. Remove lines 215-239 (the `isGameOver` early return)
2. Add "Back to Menu" button to side panel when `isGameOver` is true
3. Ensure winning line highlighting works with `game.winningLine`

### Option 2: Conditional Early Return

Only do the early return after animation completes (`animation.status === 'complete'`).

**Rejected because**: Users should still see the board and highlighted pieces even after animation completes.

## Files to Modify

| File | Change | Description |
|------|--------|-------------|
| `app/routes/games/quarto/online.tsx` | MODIFY | Remove early return, add conditional Back to Menu button |

## Implementation Tasks

1. Remove the `isGameOver` early return block (lines 215-239)
2. Add "Back to Menu" button to side panel when `isGameOver && !isAnimationPlaying`
3. Test online game end-to-end with both players
4. Verify animations play correctly for winner and loser
5. Verify winning pieces are highlighted after animation

## Verification Steps

1. Create online game room
2. Have both players join
3. Play until one wins (make a Quarto)
4. **Winner should see**: Firework animation → highlighted pieces → "Back to Menu" button
5. **Loser should see**: Defeat animation → highlighted pieces → "Back to Menu" button
6. Both should remain on game screen throughout
