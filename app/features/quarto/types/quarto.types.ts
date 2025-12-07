import { z } from 'zod';

// Piece attributes (binary)
export type PieceColor = 'light' | 'dark';
export type PieceShape = 'round' | 'square';
export type PieceTop = 'solid' | 'hollow';
export type PieceHeight = 'tall' | 'short';

export interface Piece {
  id: number;           // 0-15, derived from attributes
  color: PieceColor;    // Bit 0
  shape: PieceShape;    // Bit 1
  top: PieceTop;        // Bit 2
  height: PieceHeight;  // Bit 3
}

// Board position (piece ID or null if empty)
export type BoardPosition = number | null;

export interface Board {
  positions: BoardPosition[];  // length 16, indexed 0-15
}

// Player types
export type PlayerType = 'human-local' | 'human-remote' | 'ai';
export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface Player {
  id: string;
  type: PlayerType;
  name: string;
  difficulty?: AIDifficulty;
}

// Game types
export type GameMode = 'local' | 'ai' | 'online';
export type GameStatus = 'waiting' | 'playing' | 'finished';
export type TurnPhase = 'selecting' | 'placing';

export interface GameMove {
  type: 'select' | 'place' | 'quarto';
  player: 0 | 1;
  pieceId?: number;
  position?: number;
  timestamp: number;
}

export interface Game {
  id: string;
  mode: GameMode;
  status: GameStatus;
  players: [Player, Player];
  board: Board;
  availablePieces: number[];
  currentTurn: 0 | 1;
  phase: TurnPhase;
  selectedPiece: number | null;
  winner: 0 | 1 | 'draw' | null;
  winningLine: number[] | null;
  history: GameMove[];
  createdAt: number;
  updatedAt: number;
}

// Room for online multiplayer
export interface Room {
  id: string;
  gameId: string;
  hostId: string;
  guestId: string | null;
  createdAt: number;
  expiresAt: number;
}

// Redux state shape
export interface QuartoState {
  game: Game | null;
  ui: {
    selectedPosition: number | null;
    hoveredPosition: number | null;
    isAIThinking: boolean;
    connectionStatus: 'disconnected' | 'connecting' | 'connected';
    error: string | null;
  };
}

// Zod Schemas
export const PieceColorSchema = z.enum(['light', 'dark']);
export const PieceShapeSchema = z.enum(['round', 'square']);
export const PieceTopSchema = z.enum(['solid', 'hollow']);
export const PieceHeightSchema = z.enum(['tall', 'short']);

export const PieceSchema = z.object({
  id: z.number().min(0).max(15),
  color: PieceColorSchema,
  shape: PieceShapeSchema,
  top: PieceTopSchema,
  height: PieceHeightSchema,
});

export const BoardSchema = z.object({
  positions: z.array(z.number().min(0).max(15).nullable()).length(16),
});

export const PlayerTypeSchema = z.enum(['human-local', 'human-remote', 'ai']);
export const AIDifficultySchema = z.enum(['easy', 'medium', 'hard']);

export const PlayerSchema = z.object({
  id: z.string(),
  type: PlayerTypeSchema,
  name: z.string().min(1).max(20),
  difficulty: AIDifficultySchema.optional(),
});

export const GameModeSchema = z.enum(['local', 'ai', 'online']);
export const GameStatusSchema = z.enum(['waiting', 'playing', 'finished']);
export const TurnPhaseSchema = z.enum(['selecting', 'placing']);

export const GameMoveSchema = z.object({
  type: z.enum(['select', 'place', 'quarto']),
  player: z.literal(0).or(z.literal(1)),
  pieceId: z.number().min(0).max(15).optional(),
  position: z.number().min(0).max(15).optional(),
  timestamp: z.number(),
});

export const GameSchema = z.object({
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

export const RoomSchema = z.object({
  id: z.string().length(6).regex(/^[A-Z0-9]+$/),
  gameId: z.string().uuid(),
  hostId: z.string(),
  guestId: z.string().nullable(),
  createdAt: z.number(),
  expiresAt: z.number(),
});

// Constants
export const WINNING_LINES: number[][] = [
  // Rows
  [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
  // Columns
  [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
  // Diagonals
  [0, 5, 10, 15], [3, 6, 9, 12]
];

export const AI_DEPTHS: Record<AIDifficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 6
};
