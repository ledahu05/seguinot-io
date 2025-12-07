# Data Model: Quarto Board Game

**Feature**: 002-quarto-game
**Date**: 2025-12-05

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Game     │       │    Board    │       │   Piece     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │───┐   │ positions[] │◄──────│ id (0-15)   │
│ mode        │   │   │             │       │ color       │
│ status      │   │   └─────────────┘       │ shape       │
│ players[]   │   │                         │ top         │
│ currentTurn │   │                         │ height      │
│ phase       │   │                         └─────────────┘
│ selectedPiece│  │
│ winner      │   │   ┌─────────────┐
│ createdAt   │   │   │   Player    │
└─────────────┘   │   ├─────────────┤
                  └──►│ id          │
                      │ type        │
                      │ name        │
                      └─────────────┘
```

## Core Types

### Piece

Represents one of 16 unique game pieces with 4 binary attributes.

```typescript
// Piece attributes (binary)
type PieceColor = 'light' | 'dark';
type PieceShape = 'round' | 'square';
type PieceTop = 'solid' | 'hollow';
type PieceHeight = 'tall' | 'short';

interface Piece {
  id: number;           // 0-15, derived from attributes
  color: PieceColor;    // Bit 0
  shape: PieceShape;    // Bit 1
  top: PieceTop;        // Bit 2
  height: PieceHeight;  // Bit 3
}

// Piece ID encoding (4-bit binary):
// id = (color << 0) | (shape << 1) | (top << 2) | (height << 3)
// Example: dark + round + hollow + tall = 1 + 0 + 4 + 8 = 13
```

**Validation Rules**:
- `id` must be 0-15 (derived, not stored)
- Each attribute must be one of two valid values
- All 16 pieces must be unique (enforced by ID derivation)

### Board

Represents the 4x4 game board with piece placements.

```typescript
// Position indices (0-15):
// ┌────┬────┬────┬────┐
// │  0 │  1 │  2 │  3 │
// ├────┼────┼────┼────┤
// │  4 │  5 │  6 │  7 │
// ├────┼────┼────┼────┤
// │  8 │  9 │ 10 │ 11 │
// ├────┼────┼────┼────┤
// │ 12 │ 13 │ 14 │ 15 │
// └────┴────┴────┴────┘

type BoardPosition = number | null;  // pieceId or null if empty

interface Board {
  positions: BoardPosition[];  // length 16, indexed 0-15
}
```

**Validation Rules**:
- `positions` array must have exactly 16 elements
- Each position is either `null` (empty) or a valid piece ID (0-15)
- No duplicate piece IDs on board

### Player

Represents a game participant.

```typescript
type PlayerType = 'human-local' | 'human-remote' | 'ai';

interface Player {
  id: string;           // UUID for remote, 'player1'/'player2' for local
  type: PlayerType;
  name: string;         // Display name
  difficulty?: AIDifficulty;  // Only for AI players
}

type AIDifficulty = 'easy' | 'medium' | 'hard';
```

### Game

Represents a complete game session.

```typescript
type GameMode = 'local' | 'ai' | 'online';
type GameStatus = 'waiting' | 'playing' | 'finished';
type TurnPhase = 'selecting' | 'placing';

interface Game {
  id: string;                    // UUID
  mode: GameMode;
  status: GameStatus;
  players: [Player, Player];     // Always exactly 2 players
  board: Board;
  availablePieces: number[];     // IDs of pieces not yet placed
  currentTurn: 0 | 1;            // Index into players array
  phase: TurnPhase;
  selectedPiece: number | null;  // Piece ID selected for opponent
  winner: 0 | 1 | 'draw' | null; // null if game ongoing
  winningLine: number[] | null;  // Positions of winning 4 pieces
  history: GameMove[];           // For replay/undo
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
}

interface GameMove {
  type: 'select' | 'place' | 'quarto';
  player: 0 | 1;
  pieceId?: number;
  position?: number;
  timestamp: number;
}
```

**Validation Rules**:
- `players` must have exactly 2 entries
- `currentTurn` must be 0 or 1
- `selectedPiece` must be in `availablePieces` when selecting
- `winner` can only be set when `status` is 'finished'

### Room (Online Multiplayer)

Represents an online game room.

```typescript
interface Room {
  id: string;           // 6-character code (e.g., "ABC123")
  gameId: string;       // Reference to Game
  hostId: string;       // Player who created room
  guestId: string | null;  // Second player (null if waiting)
  createdAt: number;
  expiresAt: number;    // Auto-cleanup after timeout
}
```

**Validation Rules**:
- `id` must be 6 alphanumeric characters
- `expiresAt` = `createdAt` + 30 minutes (if no activity)

## State Transitions

### Game Status Flow

```
                    ┌─────────┐
                    │ waiting │ (online mode only)
                    └────┬────┘
                         │ guest joins
                         ▼
┌─────────┐        ┌─────────┐
│  init   │───────►│ playing │
└─────────┘        └────┬────┘
  (local/ai)            │
                        │ quarto called OR
                        │ board full (draw)
                        ▼
                   ┌──────────┐
                   │ finished │
                   └──────────┘
```

### Turn Phase Flow

```
┌────────────┐     player selects      ┌──────────┐
│ selecting  │─────────piece──────────►│ placing  │
└────────────┘                         └────┬─────┘
      ▲                                     │
      │          opponent places piece      │
      └─────────────────────────────────────┘
```

## Derived Data (Selectors)

These are computed from state, not stored:

```typescript
// Available pieces = all pieces - placed pieces
const selectAvailablePieces = (state: Game): Piece[] => ...

// Check if position is valid for placement
const selectIsValidPosition = (state: Game, pos: number): boolean => ...

// Get all winning lines (rows, cols, diagonals)
const selectWinningLines = (board: Board): number[][] => ...

// Check if a line has 4 pieces with shared attribute
const selectHasQuarto = (board: Board, line: number[]): boolean => ...

// Current player object
const selectCurrentPlayer = (state: Game): Player => ...

// Opponent player object
const selectOpponentPlayer = (state: Game): Player => ...
```

## Constants

```typescript
// All 16 pieces (generated once, immutable)
const ALL_PIECES: Piece[] = generateAllPieces();

// Winning line definitions (indices into board positions)
const WINNING_LINES: number[][] = [
  // Rows
  [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
  // Columns
  [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
  // Diagonals
  [0, 5, 10, 15], [3, 6, 9, 12]
];

// AI search depths by difficulty
const AI_DEPTHS: Record<AIDifficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 6
};
```

## Zod Schemas

```typescript
import { z } from 'zod';

const PieceColorSchema = z.enum(['light', 'dark']);
const PieceShapeSchema = z.enum(['round', 'square']);
const PieceTopSchema = z.enum(['solid', 'hollow']);
const PieceHeightSchema = z.enum(['tall', 'short']);

const PieceSchema = z.object({
  id: z.number().min(0).max(15),
  color: PieceColorSchema,
  shape: PieceShapeSchema,
  top: PieceTopSchema,
  height: PieceHeightSchema,
});

const BoardSchema = z.object({
  positions: z.array(z.number().min(0).max(15).nullable()).length(16),
});

const PlayerTypeSchema = z.enum(['human-local', 'human-remote', 'ai']);
const AIDifficultySchema = z.enum(['easy', 'medium', 'hard']);

const PlayerSchema = z.object({
  id: z.string(),
  type: PlayerTypeSchema,
  name: z.string().min(1).max(20),
  difficulty: AIDifficultySchema.optional(),
});

const GameModeSchema = z.enum(['local', 'ai', 'online']);
const GameStatusSchema = z.enum(['waiting', 'playing', 'finished']);
const TurnPhaseSchema = z.enum(['selecting', 'placing']);

const GameMoveSchema = z.object({
  type: z.enum(['select', 'place', 'quarto']),
  player: z.literal(0).or(z.literal(1)),
  pieceId: z.number().min(0).max(15).optional(),
  position: z.number().min(0).max(15).optional(),
  timestamp: z.number(),
});

const GameSchema = z.object({
  id: z.string().uuid(),
  mode: GameModeSchema,
  status: GameStatusSchema,
  players: z.tuple([PlayerSchema, PlayerSchema]),
  board: BoardSchema,
  availablePieces: z.array(z.number().min(0).max(15)),
  currentTurn: z.literal(0).or(z.literal(1)),
  phase: TurnPhaseSchema,
  selectedPiece: z.number().min(0).max(15).nullable(),
  winner: z.literal(0).or(z.literal(1)).or(z.literal('draw')).nullable(),
  winningLine: z.array(z.number().min(0).max(15)).length(4).nullable(),
  history: z.array(GameMoveSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const RoomSchema = z.object({
  id: z.string().length(6).regex(/^[A-Z0-9]+$/),
  gameId: z.string().uuid(),
  hostId: z.string(),
  guestId: z.string().nullable(),
  createdAt: z.number(),
  expiresAt: z.number(),
});
```
