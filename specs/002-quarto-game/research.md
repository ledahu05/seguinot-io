# Research: Quarto Board Game

**Feature**: 002-quarto-game
**Date**: 2025-12-05

## Technology Decisions

### 1. 3D Rendering: React Three Fiber + Drei

**Decision**: Use React Three Fiber (R3F) with Drei helpers for 3D visualization.

**Rationale**:
- Declarative React syntax integrates naturally with existing stack
- Drei provides pre-built helpers (OrbitControls, materials, shadows)
- Excellent TypeScript support
- Active community and maintenance
- Smaller bundle than alternatives when tree-shaken

**Alternatives Considered**:
- **Three.js vanilla**: More boilerplate, harder to integrate with React state
- **Babylon.js**: Heavier, overkill for simple board game
- **CSS 3D transforms**: Limited realism, no proper lighting/shadows
- **2D Canvas**: Would not meet "elegant wooden aesthetic" requirement

**Best Practices**:
- Use `Suspense` for loading 3D assets
- Implement `useFrame` carefully to avoid performance issues
- Use instanced meshes for 16 pieces if needed
- Lazy-load the entire 3D canvas component

---

### 2. State Management: Redux Toolkit

**Decision**: Use RTK with slices for game state management.

**Rationale**:
- Game state is complex: board (4x4), 16 pieces with 4 attributes each, turn phases, game modes, history
- Multiple components need synchronized access (3D board, piece tray, status, controls)
- DevTools for debugging game state during development
- Time-travel debugging useful for game replay feature

**Alternatives Considered**:
- **React Context**: Would require extensive memoization; frequent updates during gameplay
- **Zustand**: Lighter but less tooling; RTK already in constitution
- **Jotai/Recoil**: Atomic state less suited for interconnected game state

**Best Practices**:
- Single slice for all game state (`quartoSlice`)
- Use `createSelector` for derived state (available pieces, winning lines)
- Normalize board state as flat array with position indices
- Keep piece definitions as constants, not in state

---

### 3. AI Algorithm: Minimax with Alpha-Beta Pruning

**Decision**: Implement Minimax with alpha-beta pruning for AI opponent.

**Rationale**:
- Quarto has manageable game tree (16! max positions, but heavily prunable)
- Alpha-beta provides optimal play with good performance
- Well-documented algorithm, easy to implement and test
- Difficulty levels achieved by limiting search depth

**Alternatives Considered**:
- **Random moves**: Too easy, no challenge
- **Monte Carlo Tree Search**: Overkill for deterministic game
- **Neural network**: Requires training data, adds complexity

**Best Practices**:
- Run AI computation in Web Worker to avoid UI blocking
- Use iterative deepening for time-limited moves
- Implement transposition table for repeated positions
- Difficulty levels: Easy (depth 1-2), Medium (depth 3-4), Hard (depth 5+)

**Evaluation Heuristics**:
1. Immediate win/loss detection (highest priority)
2. Pieces that create multiple winning opportunities
3. Avoiding giving pieces that complete opponent's line
4. Center positions slightly preferred early game

---

### 4. Real-time Multiplayer: WebSocket via TanStack Start

**Decision**: Use native WebSocket with TanStack Start server functions.

**Rationale**:
- TanStack Start supports server-side WebSocket handlers
- Simple protocol for turn-based game (no complex sync needed)
- Direct integration with existing stack
- Low latency for move synchronization

**Alternatives Considered**:
- **Socket.io**: Additional dependency, more features than needed
- **Polling**: Would not meet <1s sync requirement
- **WebRTC**: Overkill for turn-based game, NAT traversal complexity

**Best Practices**:
- Use room-based architecture (one WS connection per game session)
- Implement heartbeat for connection monitoring
- Store room state server-side with short TTL
- Handle reconnection with session tokens

**Message Protocol**:
```typescript
type WSMessage =
  | { type: 'JOIN'; roomId: string; playerId: string }
  | { type: 'SELECT_PIECE'; pieceId: number }
  | { type: 'PLACE_PIECE'; position: number }
  | { type: 'CALL_QUARTO' }
  | { type: 'STATE_UPDATE'; state: GameState }
  | { type: 'PLAYER_LEFT'; playerId: string }
  | { type: 'ERROR'; message: string }
```

---

### 5. 3D Asset Strategy: Procedural Geometry

**Decision**: Generate board and pieces procedurally with Three.js geometry, not GLTF models.

**Rationale**:
- Board is simple 4x4 grid with cylindrical indentations
- Pieces are basic shapes: cylinders and boxes with variations
- Procedural = smaller bundle, faster load
- Easier to animate and customize
- Generated images serve as style reference, not actual textures

**Alternatives Considered**:
- **GLTF models**: Larger download, harder to customize programmatically
- **Sprites/2D**: Doesn't meet 3D requirement

**Best Practices**:
- Use `BufferGeometry` for efficiency
- Apply `MeshStandardMaterial` with wood-like colors (no texture images needed for MVP)
- Add subtle bevel/chamfer to edges for realism
- Use `THREE.Group` to organize piece parts (base + top)

---

### 6. Animation: React Spring for 3D

**Decision**: Use `@react-spring/three` for 3D animations, Framer Motion for UI.

**Rationale**:
- React Spring has first-class R3F integration (`@react-spring/three`)
- Physics-based animations for natural piece movement
- Framer Motion already in stack for UI elements
- Clear separation: Spring for 3D, Motion for 2D

**Alternatives Considered**:
- **GSAP**: Additional dependency, not React-native
- **Three.js Tween**: Lower-level, more boilerplate
- **CSS animations**: Not applicable to 3D canvas

**Animation Specifications**:
- Piece selection: Scale up 1.1x with spring
- Piece placement: Arc trajectory with gravity easing
- Camera transitions: Smooth spring interpolation
- Victory celebration: Winning pieces pulse/glow

---

### 7. Accessibility Strategy

**Decision**: Implement hybrid a11y approach for canvas-based game.

**Rationale**:
- 3D canvas is inherently not accessible to screen readers
- Must provide alternative interaction methods
- Game state must be announced for non-visual users

**Implementation**:
1. **Keyboard Navigation**:
   - Arrow keys to navigate board positions
   - Tab to cycle through available pieces
   - Enter/Space to select/place
   - Q key to call Quarto

2. **ARIA Live Regions**:
   - Announce turn changes
   - Announce piece selections
   - Announce game outcomes

3. **Visual Indicators**:
   - High contrast focus rings
   - Clear current selection highlighting
   - Reduced motion mode (CSS `prefers-reduced-motion`)

---

## Resolved Clarifications

All technical context items resolved. No NEEDS CLARIFICATION markers remain.

## Open Questions (Deferred to Implementation)

1. Exact wood color values (can iterate during development)
2. Specific animation timing curves (tune during testing)
3. WebSocket server hosting configuration (deployment concern)
