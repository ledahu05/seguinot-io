// Client-side message types for PartyKit communication
// Mirror of party/src/types.ts for client use

import type { Game } from '../types/quarto.types';

// Client → Server Messages
export type ClientMessage =
  | { type: 'CREATE_ROOM'; playerName: string }
  | { type: 'JOIN_ROOM'; playerName: string }
  | { type: 'SELECT_PIECE'; pieceId: number }
  | { type: 'PLACE_PIECE'; position: number }
  | { type: 'CALL_QUARTO' }
  | { type: 'LEAVE_ROOM' }
  | { type: 'RECONNECT'; playerId: string };

// Server → Client Messages
export type ServerMessage =
  | { type: 'ROOM_CREATED'; roomId: string; playerId: string }
  | { type: 'ROOM_JOINED'; playerId: string; game: Game }
  | { type: 'PLAYER_JOINED'; playerName: string; game: Game }
  | { type: 'STATE_UPDATE'; game: Game }
  | { type: 'PLAYER_LEFT'; reason: 'disconnect' | 'forfeit' | 'timeout' }
  | { type: 'GAME_OVER'; winner: 0 | 1 | 'draw'; winnerId: string | null; winningPositions: number[]; game: Game }
  | { type: 'ERROR'; code: ErrorCode; message: string };

export type ErrorCode =
  | 'NOT_YOUR_TURN'
  | 'INVALID_PIECE'
  | 'INVALID_POSITION'
  | 'WRONG_PHASE'
  | 'NO_QUARTO'
  | 'GAME_ENDED'
  | 'ROOM_FULL'
  | 'ROOM_NOT_FOUND'
  | 'INVALID_MESSAGE';

// Connection state
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

// Online game context
export interface OnlineGameState {
  roomId: string | null;
  playerId: string | null;
  playerIndex: 0 | 1 | null;
  isHost: boolean;
  connectionStatus: ConnectionStatus;
  error: string | null;
}
