# Tasks: Online Game End-Screen Bug Fix

**Input**: Design documents from `/specs/003-quarto-win-animation/`
**Prerequisites**: plan.md (bug fix specification)

**Scope**: This is a **bug fix** task. The online game page shows a static "You Win!/You Lose!" screen instead of keeping players on the game board with animations and highlighted winning pieces.

**Organization**: Single-phase fix with verification tasks.

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Phase 1: Bug Fix Implementation

**Purpose**: Fix the early return in online.tsx that prevents animations from displaying

**Bug Location**: `app/routes/games/quarto/online.tsx` lines 215-239

- [x] T001 Remove the `isGameOver` early return block (lines 215-239) in app/routes/games/quarto/online.tsx
- [x] T002 Update side panel to show "Game Over" message and "Back to Menu" button when `isGameOver` is true in app/routes/games/quarto/online.tsx
- [x] T003 Ensure "Back to Menu" button only appears after animation completes (`!isAnimationPlaying`) in app/routes/games/quarto/online.tsx

---

## Phase 2: Verification & Testing

**Purpose**: Verify the fix works correctly for both winner and loser

- [x] T004 Manual test: Create online game room and have two players join
- [x] T005 Manual test: Play game until Quarto is achieved
- [x] T006 Manual test: Verify winner sees firework animation on game board
- [x] T007 Manual test: Verify loser sees defeat animation on game board
- [x] T008 Manual test: Verify both players see highlighted winning pieces after animation
- [x] T009 Manual test: Verify "Back to Menu" button appears after animation completes
- [x] T010 Run TypeScript check: `pnpm typecheck` to ensure no type errors (pre-existing error in Piece3D.tsx)
- [x] T011 Run existing tests: `pnpm test tests/integration/quarto` to ensure no regressions (13 tests pass)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Bug Fix)**: No dependencies - can start immediately
- **Phase 2 (Verification)**: Depends on Phase 1 completion

### Task Dependencies

```
T001 → T002 → T003 (sequential - same file)
T004 → T005 → T006, T007, T008, T009 (sequential - same test session)
T010, T011 can run in parallel after T003
```

---

## Implementation Details

### Before (Bug)

```tsx
// Game over screen - THIS CAUSES THE BUG
if (isGameOver) {
  return (
    <div className="...">
      <h2>You Win!/You Lose!</h2>
      <button>Back to Menu</button>
    </div>
  );
}
```

### After (Fix)

Remove the early return. In the side panel, add conditional content:

```tsx
{/* In side panel, after game controls */}
{isGameOver && (
  <div className="text-center space-y-4">
    <h2 className="text-2xl font-bold text-amber-400">
      {winner === 'draw'
        ? "It's a Draw!"
        : winner === playerIndex
          ? 'You Win!'
          : 'You Lose!'}
    </h2>
    {!isAnimationPlaying && (
      <button
        onClick={() => navigate({ to: '/games/quarto' })}
        className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-white hover:from-emerald-400 hover:to-teal-400"
      >
        Back to Menu
      </button>
    )}
  </div>
)}
```

---

## Expected Behavior After Fix

**Winner Experience**:
1. Player completes a Quarto
2. Game board remains visible
3. Firework animation plays over the board
4. Animation fades, winning pieces become highlighted
5. "You Win!" message appears in side panel
6. "Back to Menu" button appears

**Loser Experience**:
1. Opponent completes a Quarto
2. Game board remains visible
3. Defeat animation plays over the board
4. Animation fades, winning pieces become highlighted
5. "You Lose!" message appears in side panel
6. "Back to Menu" button appears

---

## Files Changed Summary

| File | Action | Description |
|------|--------|-------------|
| `app/routes/games/quarto/online.tsx` | MODIFY | Remove early return, add conditional game-over UI in side panel |

## Notes

- This is a focused bug fix affecting only one file
- The animation components (`WinCelebration`, `TsParticlesFireworks`) are already working
- The Board3D already supports winning line highlighting
- Only the routing/conditional rendering logic needs to change
