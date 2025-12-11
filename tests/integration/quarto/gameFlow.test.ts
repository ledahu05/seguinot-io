import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { quartoReducer } from '../../../app/features/quarto/store/quartoSlice';
import type { QuartoState } from '../../../app/features/quarto/types/quarto.types';
import {
  startLocalGame,
  selectPiece,
  placePiece,
  resetGame,
  selectGame,
  selectBoard,
  selectAvailablePieces,
  selectSelectedPiece,
  selectIsGameOver,
  selectWinner,
  selectGamePhase,
  selectGameStatus,
  selectAnimationState,
} from '../../../app/features/quarto/store';

type TestState = { quarto: QuartoState };

const createTestStore = () => configureStore({
  reducer: { quarto: quartoReducer },
});

describe('Quarto Game Flow Integration', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  const getState = (): TestState => store.getState();

  describe('Game Initialization', () => {
    it('should start a local game with correct initial state', () => {
      store.dispatch(startLocalGame({ player1Name: 'Alice', player2Name: 'Bob' }));

      const state = getState();
      const game = selectGame(state);
      const board = selectBoard(state);
      const availablePieces = selectAvailablePieces(state);
      const status = selectGameStatus(state);
      const phase = selectGamePhase(state);

      expect(game).not.toBeNull();
      expect(game?.mode).toBe('local');
      expect(status).toBe('playing');
      expect(phase).toBe('selecting');
      expect(game?.players[0].name).toBe('Alice');
      expect(game?.players[1].name).toBe('Bob');
      expect(board?.positions.every(p => p === null)).toBe(true);
      expect(availablePieces).toHaveLength(16);
    });

    it('should randomly assign starting player', () => {
      const startingPlayers: number[] = [];

      // Run multiple times to verify randomness
      for (let i = 0; i < 20; i++) {
        store = createTestStore();
        store.dispatch(startLocalGame({ player1Name: 'P1', player2Name: 'P2' }));
        const game = selectGame(getState());
        startingPlayers.push(game?.currentTurn ?? -1);
      }

      // Should have both 0 and 1 in the results (statistically very likely)
      expect(startingPlayers.some(p => p === 0)).toBe(true);
      expect(startingPlayers.some(p => p === 1)).toBe(true);
    });
  });

  describe('Game Moves', () => {
    beforeEach(() => {
      store.dispatch(startLocalGame({ player1Name: 'Alice', player2Name: 'Bob' }));
    });

    it('should allow selecting a piece during selecting phase', () => {
      const game = selectGame(getState());
      const currentTurn = game?.currentTurn;

      store.dispatch(selectPiece({ pieceId: 0 }));

      const updatedGame = selectGame(getState());
      const phase = selectGamePhase(getState());
      const selectedPiece = selectSelectedPiece(getState());

      expect(phase).toBe('placing');
      expect(selectedPiece?.id).toBe(0);
      // Turn should switch after selecting
      expect(updatedGame?.currentTurn).toBe(currentTurn === 0 ? 1 : 0);
    });

    it('should allow placing a piece during placing phase', () => {
      store.dispatch(selectPiece({ pieceId: 5 }));
      store.dispatch(placePiece({ position: 0 }));

      const board = selectBoard(getState());
      const phase = selectGamePhase(getState());
      const selectedPiece = selectSelectedPiece(getState());
      const availablePieces = selectAvailablePieces(getState());

      expect(phase).toBe('selecting');
      expect(board?.positions[0]).toBe(5);
      expect(selectedPiece).toBeNull();
      expect(availablePieces).toHaveLength(15);
      expect(availablePieces.find(p => p.id === 5)).toBeUndefined();
    });

    it('should not allow placing on occupied position', () => {
      store.dispatch(selectPiece({ pieceId: 0 }));
      store.dispatch(placePiece({ position: 5 }));

      // Try to place another piece on the same position
      store.dispatch(selectPiece({ pieceId: 1 }));
      store.dispatch(placePiece({ position: 5 }));

      const board = selectBoard(getState());

      // Original piece should still be there
      expect(board?.positions[5]).toBe(0);
    });

    it('should not allow selecting already placed piece', () => {
      store.dispatch(selectPiece({ pieceId: 7 }));
      store.dispatch(placePiece({ position: 0 }));

      // Try to select the same piece again
      store.dispatch(selectPiece({ pieceId: 7 }));

      const selectedPiece = selectSelectedPiece(getState());
      expect(selectedPiece).toBeNull();
    });
  });

  describe('Win Detection', () => {
    beforeEach(() => {
      store.dispatch(startLocalGame({ player1Name: 'Alice', player2Name: 'Bob' }));
    });

    it('should detect a winning line (all same color)', () => {
      // Place 4 light pieces (IDs 0, 2, 4, 6 are all light) in a row
      const lightPieces = [0, 2, 4, 6];
      const positions = [0, 1, 2, 3];

      for (let i = 0; i < 4; i++) {
        store.dispatch(selectPiece({ pieceId: lightPieces[i] }));
        store.dispatch(placePiece({ position: positions[i] }));
      }

      // Auto-detection triggers win on 4th piece placement
      const isGameOver = selectIsGameOver(getState());
      expect(isGameOver).toBe(true);
    });

    it('should detect a winning line (all same shape)', () => {
      // Place 4 round pieces (IDs 0, 1, 4, 5 are all round) in a column
      const roundPieces = [0, 1, 4, 5];
      const positions = [0, 4, 8, 12]; // Column 0

      for (let i = 0; i < 4; i++) {
        store.dispatch(selectPiece({ pieceId: roundPieces[i] }));
        store.dispatch(placePiece({ position: positions[i] }));
      }

      // Auto-detection triggers win on 4th piece placement
      const isGameOver = selectIsGameOver(getState());
      expect(isGameOver).toBe(true);
    });

    it('should auto-detect win when placing the winning piece', () => {
      // Place winning combination - win is auto-detected
      const shortPieces = [0, 1, 2, 3]; // All short
      const positions = [0, 1, 2, 3];

      for (let i = 0; i < 4; i++) {
        store.dispatch(selectPiece({ pieceId: shortPieces[i] }));
        store.dispatch(placePiece({ position: positions[i] }));
      }

      const isGameOver = selectIsGameOver(getState());
      const winner = selectWinner(getState());
      const status = selectGameStatus(getState());
      const animation = selectAnimationState(getState());

      expect(isGameOver).toBe(true);
      expect(status).toBe('finished');
      expect(winner).toEqual(expect.any(Number));
      expect(animation.status).toBe('playing');
      expect(animation.type).toBe('firework');
    });

    it('should not trigger win when no winning line exists', () => {
      // Place pieces without a winning line
      store.dispatch(selectPiece({ pieceId: 0 }));
      store.dispatch(placePiece({ position: 0 }));
      store.dispatch(selectPiece({ pieceId: 15 }));
      store.dispatch(placePiece({ position: 1 }));

      const isGameOver = selectIsGameOver(getState());

      expect(isGameOver).toBe(false);
    });
  });

  describe('Draw Condition', () => {
    it('should detect draw when board is full with no Quarto', () => {
      store.dispatch(startLocalGame({ player1Name: 'Alice', player2Name: 'Bob' }));

      // Fill board with pieces that don't form any Quarto
      // This is a specific arrangement that avoids any 4-in-a-row with shared attribute
      const placements = [
        { piece: 0, pos: 0 },
        { piece: 15, pos: 1 },
        { piece: 6, pos: 2 },
        { piece: 9, pos: 3 },
        { piece: 5, pos: 4 },
        { piece: 10, pos: 5 },
        { piece: 3, pos: 6 },
        { piece: 12, pos: 7 },
        { piece: 11, pos: 8 },
        { piece: 4, pos: 9 },
        { piece: 13, pos: 10 },
        { piece: 2, pos: 11 },
        { piece: 8, pos: 12 },
        { piece: 7, pos: 13 },
        { piece: 14, pos: 14 },
        { piece: 1, pos: 15 },
      ];

      for (const { piece, pos } of placements) {
        store.dispatch(selectPiece({ pieceId: piece }));
        store.dispatch(placePiece({ position: pos }));
      }

      const isGameOver = selectIsGameOver(getState());
      const winner = selectWinner(getState());

      expect(isGameOver).toBe(true);
      expect(winner).toBe('draw');
    });
  });

  describe('Game Reset', () => {
    it('should reset game state completely', () => {
      store.dispatch(startLocalGame({ player1Name: 'Alice', player2Name: 'Bob' }));
      store.dispatch(selectPiece({ pieceId: 0 }));
      store.dispatch(placePiece({ position: 5 }));
      store.dispatch(resetGame());

      const game = selectGame(getState());
      expect(game).toBeNull();
    });
  });

  describe('Complete Game Flow', () => {
    it('should play a complete game to victory with auto-detection', () => {
      store.dispatch(startLocalGame({ player1Name: 'Alice', player2Name: 'Bob' }));

      // Place pieces to create a winning diagonal with tall pieces (8, 9, 10, 11 are all tall)
      const tallPieces = [8, 9, 10, 11];
      const diagonalPositions = [0, 5, 10, 15]; // Main diagonal

      for (let i = 0; i < 4; i++) {
        store.dispatch(selectPiece({ pieceId: tallPieces[i] }));
        store.dispatch(placePiece({ position: diagonalPositions[i] }));
      }

      // Win is auto-detected on the 4th piece placement
      const game = selectGame(getState());
      const isGameOver = selectIsGameOver(getState());
      const animation = selectAnimationState(getState());

      expect(isGameOver).toBe(true);
      expect(game?.status).toBe('finished');
      expect(game?.winner).not.toBeNull();
      expect(game?.winningLine).toEqual(diagonalPositions);
      expect(animation.status).toBe('playing');
      expect(animation.winningPositions).toEqual(diagonalPositions);
    });
  });
});
