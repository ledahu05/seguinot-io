import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';
import type { Piece, Player } from '../types/quarto.types';
import { ALL_PIECES, getPieceById } from '../utils/pieceAttributes';
import { hasQuarto, findAllWinningLines } from '../utils/winDetection';

// Basic selectors
export const selectQuartoState = (state: RootState) => state.quarto;
export const selectGame = (state: RootState) => state.quarto.game;
export const selectUI = (state: RootState) => state.quarto.ui;

// Derived selectors (memoized)
export const selectBoard = createSelector(
  selectGame,
  (game) => game?.board ?? null
);

export const selectCurrentPlayer = createSelector(
  selectGame,
  (game): Player | null => (game ? game.players[game.currentTurn] : null)
);

export const selectOpponentPlayer = createSelector(
  selectGame,
  (game): Player | null => {
    if (!game) return null;
    const opponentIndex = game.currentTurn === 0 ? 1 : 0;
    return game.players[opponentIndex];
  }
);

export const selectIsMyTurn = createSelector(
  [selectGame, (_state: RootState, playerId: string) => playerId],
  (game, playerId): boolean => {
    if (!game) return false;
    return game.players[game.currentTurn].id === playerId;
  }
);

export const selectAvailablePieces = createSelector(
  selectGame,
  (game): Piece[] => {
    if (!game) return [...ALL_PIECES];
    return game.availablePieces
      .map(id => getPieceById(id))
      .filter((p): p is Piece => p !== undefined);
  }
);

export const selectSelectedPiece = createSelector(
  selectGame,
  (game): Piece | null => {
    if (!game || game.selectedPiece === null) return null;
    return getPieceById(game.selectedPiece) ?? null;
  }
);

export const selectCanCallQuarto = createSelector(
  selectBoard,
  (board): boolean => {
    if (!board) return false;
    return hasQuarto(board);
  }
);

export const selectWinningLines = createSelector(
  selectBoard,
  (board) => {
    if (!board) return [];
    return findAllWinningLines(board);
  }
);

export const selectGameStatus = createSelector(
  selectGame,
  (game) => game?.status ?? null
);

export const selectGamePhase = createSelector(
  selectGame,
  (game) => game?.phase ?? null
);

export const selectWinner = createSelector(
  selectGame,
  (game) => game?.winner ?? null
);

export const selectWinnerPlayer = createSelector(
  selectGame,
  (game): Player | null => {
    if (!game || game.winner === null || game.winner === 'draw') return null;
    return game.players[game.winner];
  }
);

export const selectIsGameOver = createSelector(
  selectGameStatus,
  (status): boolean => status === 'finished'
);

export const selectIsPlaying = createSelector(
  selectGameStatus,
  (status): boolean => status === 'playing'
);

export const selectIsWaiting = createSelector(
  selectGameStatus,
  (status): boolean => status === 'waiting'
);

export const selectGameMode = createSelector(
  selectGame,
  (game) => game?.mode ?? null
);

export const selectMoveHistory = createSelector(
  selectGame,
  (game) => game?.history ?? []
);

export const selectMoveCount = createSelector(
  selectMoveHistory,
  (history) => history.length
);

export const selectPlacedPiecesCount = createSelector(
  selectBoard,
  (board): number => {
    if (!board) return 0;
    return board.positions.filter(p => p !== null).length;
  }
);

export const selectEmptyPositions = createSelector(
  selectBoard,
  (board): number[] => {
    if (!board) return [];
    return board.positions
      .map((pos, idx) => (pos === null ? idx : -1))
      .filter(idx => idx !== -1);
  }
);

// UI selectors
export const selectSelectedPosition = createSelector(
  selectUI,
  (ui) => ui.selectedPosition
);

export const selectHoveredPosition = createSelector(
  selectUI,
  (ui) => ui.hoveredPosition
);

export const selectIsAIThinking = createSelector(
  selectUI,
  (ui) => ui.isAIThinking
);

export const selectConnectionStatus = createSelector(
  selectUI,
  (ui) => ui.connectionStatus
);

export const selectError = createSelector(
  selectUI,
  (ui) => ui.error
);

export const selectIsConnected = createSelector(
  selectConnectionStatus,
  (status) => status === 'connected'
);

export const selectIsConnecting = createSelector(
  selectConnectionStatus,
  (status) => status === 'connecting'
);
