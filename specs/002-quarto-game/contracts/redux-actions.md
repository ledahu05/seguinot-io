# Redux Actions Contract: Quarto Board Game

**Feature**: 002-quarto-game
**Date**: 2025-12-05

## Slice: `quarto`

### State Shape

```typescript
interface QuartoState {
  game: Game | null;
  ui: {
    selectedPosition: number | null;  // For keyboard navigation
    hoveredPosition: number | null;   // For mouse hover
    isAIThinking: boolean;
    connectionStatus: 'disconnected' | 'connecting' | 'connected';
    error: string | null;
  };
}
```

---

## Actions

### Game Lifecycle

#### `startLocalGame`
Initializes a new local 2-player game.

```typescript
startLocalGame(state, action: PayloadAction<{
  player1Name: string;
  player2Name: string;
}>)
```

**State Changes**:
- Creates new Game with mode='local'
- Sets status='playing'
- Randomly assigns starting player
- Initializes empty board and full availablePieces

---

#### `startAIGame`
Initializes a new game against AI.

```typescript
startAIGame(state, action: PayloadAction<{
  playerName: string;
  difficulty: AIDifficulty;
  playerGoesFirst: boolean;
}>)
```

**State Changes**:
- Creates new Game with mode='ai'
- Sets player[1] as AI with specified difficulty
- If AI goes first, triggers AI selection

---

#### `setOnlineGame`
Sets game state received from server.

```typescript
setOnlineGame(state, action: PayloadAction<Game>)
```

**State Changes**:
- Replaces entire game state with server state
- Used after WebSocket STATE_UPDATE

---

#### `resetGame`
Clears current game state.

```typescript
resetGame(state)
```

**State Changes**:
- Sets game to null
- Resets all UI state

---

### Game Moves

#### `selectPiece`
Current player selects a piece to give opponent.

```typescript
selectPiece(state, action: PayloadAction<{
  pieceId: number;
}>)
```

**Preconditions**:
- game.phase === 'selecting'
- pieceId in game.availablePieces

**State Changes**:
- Sets game.selectedPiece
- Changes phase to 'placing'
- Switches currentTurn
- Adds move to history

---

#### `placePiece`
Current player places the selected piece.

```typescript
placePiece(state, action: PayloadAction<{
  position: number;
}>)
```

**Preconditions**:
- game.phase === 'placing'
- game.selectedPiece !== null
- board.positions[position] === null

**State Changes**:
- Sets board.positions[position] to selectedPiece
- Removes pieceId from availablePieces
- Clears selectedPiece
- Changes phase to 'selecting'
- Adds move to history
- Does NOT switch turn (same player selects next piece)

---

#### `callQuarto`
Player claims victory.

```typescript
callQuarto(state)
```

**Preconditions**:
- Valid winning alignment exists

**State Changes**:
- If valid: sets winner, winningLine, status='finished'
- If invalid: error (player loses in strict mode, or just rejected)
- Adds move to history

---

### AI Actions

#### `setAIThinking`
Indicates AI is computing move.

```typescript
setAIThinking(state, action: PayloadAction<boolean>)
```

**State Changes**:
- Sets ui.isAIThinking

---

#### `applyAIMove`
Applies move computed by AI.

```typescript
applyAIMove(state, action: PayloadAction<{
  type: 'select' | 'place';
  pieceId?: number;
  position?: number;
}>)
```

**State Changes**:
- Dispatches selectPiece or placePiece internally
- Sets isAIThinking to false

---

### Online Multiplayer

#### `setConnectionStatus`
Updates WebSocket connection status.

```typescript
setConnectionStatus(state, action: PayloadAction<
  'disconnected' | 'connecting' | 'connected'
>)
```

---

#### `handlePlayerLeft`
Handles opponent disconnection.

```typescript
handlePlayerLeft(state, action: PayloadAction<{
  reason: 'disconnect' | 'forfeit' | 'timeout';
}>)
```

**State Changes**:
- If timeout: sets winner to remaining player
- Updates status to 'finished'

---

### UI State

#### `setSelectedPosition`
Keyboard navigation selection.

```typescript
setSelectedPosition(state, action: PayloadAction<number | null>)
```

---

#### `setHoveredPosition`
Mouse hover feedback.

```typescript
setHoveredPosition(state, action: PayloadAction<number | null>)
```

---

#### `setError`
Sets/clears error message.

```typescript
setError(state, action: PayloadAction<string | null>)
```

---

## Selectors

```typescript
// Basic selectors
export const selectGame = (state: RootState) => state.quarto.game;
export const selectUI = (state: RootState) => state.quarto.ui;

// Derived selectors (memoized with createSelector)
export const selectBoard = createSelector(selectGame, game => game?.board);
export const selectCurrentPlayer = createSelector(selectGame, game =>
  game ? game.players[game.currentTurn] : null
);
export const selectIsMyTurn = createSelector(
  [selectGame, (_, playerId: string) => playerId],
  (game, playerId) => game?.players[game.currentTurn].id === playerId
);
export const selectAvailablePieces = createSelector(selectGame, game =>
  game ? ALL_PIECES.filter(p => game.availablePieces.includes(p.id)) : []
);
export const selectCanCallQuarto = createSelector(selectBoard, board =>
  board ? checkForQuarto(board) : false
);
export const selectWinningLines = createSelector(selectBoard, board =>
  board ? findWinningLines(board) : []
);
```

---

## Thunks

### `makeAIMove`
Async thunk that computes and applies AI move.

```typescript
export const makeAIMove = createAsyncThunk(
  'quarto/makeAIMove',
  async (_, { getState, dispatch }) => {
    dispatch(setAIThinking(true));
    const game = selectGame(getState());

    // Run minimax in worker
    const move = await computeAIMove(game, game.players[1].difficulty);

    dispatch(applyAIMove(move));
  }
);
```

### `connectToRoom`
Async thunk that establishes WebSocket connection.

```typescript
export const connectToRoom = createAsyncThunk(
  'quarto/connectToRoom',
  async ({ roomId, playerId }, { dispatch }) => {
    dispatch(setConnectionStatus('connecting'));
    const ws = new WebSocket(`/api/games/quarto/ws/${roomId}?playerId=${playerId}`);
    // ... handle messages, dispatch setOnlineGame, etc.
  }
);
```
