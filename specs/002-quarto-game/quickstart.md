# Quickstart: Quarto Board Game

**Feature**: 002-quarto-game
**Date**: 2025-12-05

## Prerequisites

- Node.js 20+
- pnpm (package manager)
- Modern browser with WebGL support

## Setup

### 1. Install Dependencies

```bash
# From repository root
pnpm install

# New dependencies for this feature
pnpm add @react-three/fiber @react-three/drei three @react-spring/three
pnpm add @reduxjs/toolkit react-redux
pnpm add -D @types/three
```

### 2. Create Feature Directory Structure

```bash
mkdir -p app/features/quarto/{store,components,hooks,ai,types,utils}
mkdir -p app/routes/games/quarto
mkdir -p app/server/api/quarto
mkdir -p tests/unit/quarto tests/integration/quarto
```

### 3. Configure Redux Store

Add quarto slice to store configuration:

```typescript
// app/store.ts (or wherever store is configured)
import { quartoReducer } from './features/quarto/store';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    quarto: quartoReducer,
  },
});
```

## Development Workflow

### Running the Game Locally

```bash
# Start development server
pnpm dev

# Navigate to
http://localhost:3000/games/quarto
```

### Running Tests

```bash
# All quarto tests
pnpm test tests/unit/quarto tests/integration/quarto

# Specific test file
pnpm test tests/unit/quarto/winDetection.test.ts

# Watch mode
pnpm test --watch tests/unit/quarto
```

### Testing 3D Rendering

```bash
# Visual regression testing (if configured)
pnpm test:visual

# Manual testing checklist:
# 1. Load /games/quarto - board renders
# 2. Rotate camera with mouse drag
# 3. Click pieces - selection highlights
# 4. Place piece - animation plays
```

## Key Files to Implement (Priority Order)

### Phase 1: Core Game Logic (P1)

1. **`app/features/quarto/types/quarto.types.ts`**
   - All TypeScript interfaces from data-model.md
   - Zod schemas for validation

2. **`app/features/quarto/utils/pieceAttributes.ts`**
   - `generateAllPieces()`: Create 16 piece objects
   - `getPieceById(id)`: Lookup piece by ID
   - `comparePieceAttribute(pieces, attr)`: Check if pieces share attribute

3. **`app/features/quarto/utils/winDetection.ts`**
   - `WINNING_LINES`: Constant array of line indices
   - `checkLine(board, line)`: Check if 4 pieces share attribute
   - `findWinningLine(board)`: Find first winning alignment
   - `hasQuarto(board)`: Boolean check for any winner

4. **`app/features/quarto/store/quartoSlice.ts`**
   - Initial state
   - All reducers from contracts/redux-actions.md
   - Selectors

### Phase 2: 3D Visualization (P1)

5. **`app/features/quarto/components/Piece3D.tsx`**
   - Props: piece attributes, position, isSelected
   - Procedural geometry based on attributes
   - Spring animations for selection/placement

6. **`app/features/quarto/components/Board3D.tsx`**
   - 4x4 grid with indentations
   - Click handlers for placement
   - Renders placed pieces

7. **`app/features/quarto/components/PieceTray.tsx`**
   - Display available pieces
   - Click to select piece for opponent
   - 3D or 2D based on screen size

8. **`app/routes/games/quarto/play.tsx`**
   - Canvas setup with R3F
   - OrbitControls
   - Lighting
   - Compose Board3D + PieceTray + GameStatus

### Phase 3: Game Modes

9. **`app/features/quarto/hooks/useQuartoGame.ts`**
   - Orchestrates game flow
   - Handles mode-specific logic
   - Exposes actions to components

10. **`app/features/quarto/ai/minimax.ts`**
    - Minimax with alpha-beta pruning
    - Depth limiting for difficulty
    - Web Worker wrapper

11. **`app/features/quarto/hooks/useAI.ts`**
    - Triggers AI move computation
    - Handles async worker communication

### Phase 4: Online Multiplayer (P3)

12. **`app/server/api/quarto/room.ts`**
    - REST handlers: create, join, leave, status

13. **`app/server/api/quarto/websocket.ts`**
    - WebSocket connection handling
    - Message routing
    - State synchronization

14. **`app/features/quarto/hooks/useMultiplayer.ts`**
    - WebSocket client hook
    - Connection management
    - Message dispatch

## Environment Variables

```bash
# .env.local (if needed for WebSocket URL)
VITE_WS_URL=ws://localhost:3000
```

## Common Issues

### 3D Not Rendering
- Check WebGL support: `!!window.WebGLRenderingContext`
- Ensure Canvas has explicit dimensions
- Check console for Three.js errors

### Redux State Not Updating
- Verify slice is added to store
- Check action is being dispatched (Redux DevTools)
- Ensure reducer handles the action type

### WebSocket Connection Failing
- Verify server is running
- Check CORS configuration
- Ensure playerId matches room participant

## Testing Checklist

Before marking implementation complete:

- [ ] Local 2-player game: full playthrough to win
- [ ] Local 2-player game: full playthrough to draw
- [ ] AI game (Easy): beatable within 5 moves
- [ ] AI game (Hard): AI blocks obvious wins
- [ ] 3D: Camera rotation smooth
- [ ] 3D: All 16 pieces visually distinct
- [ ] Mobile: Touch controls work
- [ ] Keyboard: Full game playable without mouse
- [ ] Online: Room creation returns code
- [ ] Online: Second player can join
- [ ] Online: Moves sync in <1s
- [ ] Online: Reconnection works

## Next Steps

After implementation:
1. Run `/speckit.tasks` to generate task breakdown
2. Create PR with first working mode (local 2-player)
3. Iterate on visual polish
4. Add AI and online modes incrementally
