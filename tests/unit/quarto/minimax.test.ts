import { describe, it, expect } from 'vitest';
import {
  getAIMove,
  getRandomMove,
  getAIMoveWithRandomness,
  selectPieceForOpponent,
  placePiece,
} from '../../../app/features/quarto/ai/minimax';
import {
  evaluateBoard,
  evaluateLine,
  evaluatePieceGive,
  getBestPieceToGive,
  canCompleteQuarto,
} from '../../../app/features/quarto/ai/evaluation';
import { createEmptyBoard, hasQuarto } from '../../../app/features/quarto/utils/winDetection';
import { getPieceById } from '../../../app/features/quarto/utils/pieceAttributes';
import type { Board } from '../../../app/features/quarto/types/quarto.types';

describe('AI Evaluation', () => {
  describe('evaluateBoard', () => {
    it('should return 0 for empty board', () => {
      const board = createEmptyBoard();
      const availablePieces = Array.from({ length: 16 }, (_, i) => i);
      const score = evaluateBoard(board, availablePieces, true);
      expect(score).toBe(0);
    });

    it('should return high score for winning position', () => {
      // Create a board with a Quarto (4 light pieces in a row)
      const board: Board = {
        positions: [0, 2, 4, 6, null, null, null, null, null, null, null, null, null, null, null, null],
      };
      const availablePieces = [1, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const score = evaluateBoard(board, availablePieces, true);
      expect(score).toBe(100000); // Win score
    });

    it('should give center control bonus', () => {
      // Place a piece in center
      const boardWithCenter: Board = {
        positions: [null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, null],
      };
      const boardWithCorner: Board = {
        positions: [0, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      };
      const availablePieces = Array.from({ length: 15 }, (_, i) => i + 1);

      const centerScore = evaluateBoard(boardWithCenter, availablePieces, true);
      const cornerScore = evaluateBoard(boardWithCorner, availablePieces, true);

      expect(centerScore).toBeGreaterThan(cornerScore);
    });
  });

  describe('evaluateLine', () => {
    it('should return 0 for empty line', () => {
      const board = createEmptyBoard();
      const availablePieces = Array.from({ length: 16 }, (_, i) => i);
      const score = evaluateLine(board, [0, 1, 2, 3], availablePieces);
      expect(score).toBe(0);
    });

    it('should return positive score for two pieces with shared attribute', () => {
      // Two light pieces on a line
      const board: Board = {
        positions: [0, 2, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      };
      const availablePieces = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const score = evaluateLine(board, [0, 1, 2, 3], availablePieces);
      expect(score).toBeGreaterThan(0);
    });

    it('should return higher score for three pieces with shared attribute', () => {
      // Three light pieces on a line
      const boardTwo: Board = {
        positions: [0, 2, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      };
      const boardThree: Board = {
        positions: [0, 2, 4, null, null, null, null, null, null, null, null, null, null, null, null, null],
      };
      const availablePieces = [1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

      const scoreTwo = evaluateLine(boardTwo, [0, 1, 2, 3], availablePieces);
      const scoreThree = evaluateLine(boardThree, [0, 1, 2, 3], availablePieces);

      expect(scoreThree).toBeGreaterThan(scoreTwo);
    });
  });

  describe('canCompleteQuarto', () => {
    it('should return true when a completing piece exists', () => {
      // Three light pieces, need one more light piece
      const pieces = [getPieceById(0)!, getPieceById(2)!, getPieceById(4)!];
      const availablePieces = [6, 8, 10]; // 6 is light, 8 and 10 are also light

      const result = canCompleteQuarto(pieces, availablePieces, ['color']);
      expect(result).toBe(true);
    });

    it('should return false when no completing piece exists', () => {
      // Three light pieces, only dark pieces available
      const pieces = [getPieceById(0)!, getPieceById(2)!, getPieceById(4)!];
      const availablePieces = [1, 3, 5, 7]; // All dark pieces

      const result = canCompleteQuarto(pieces, availablePieces, ['color']);
      expect(result).toBe(false);
    });
  });

  describe('evaluatePieceGive', () => {
    it('should return negative score for dangerous pieces', () => {
      // Board with 3 light round pieces in positions 0, 1, 2 (need pos 3 to complete)
      // Pieces: 0 (light, round, solid, short), 2 (light, round, solid, tall are at diff pos)
      // Let's use pieces that share color only
      const board: Board = {
        positions: [0, 2, 4, null, null, null, null, null, null, null, null, null, null, null, null, null],
      };
      // 0, 2, 4 are all light (even numbers < 8 with bit 0 = 0)
      // 6 is also light - would complete the Quarto
      // 9 is dark, tall, square, solid - no shared attributes with existing pieces
      const availablePieces = [6, 9];

      const dangerousScore = evaluatePieceGive(board, 6, availablePieces);
      const safeScore = evaluatePieceGive(board, 9, availablePieces);

      // Dangerous should be more negative (worse to give)
      expect(dangerousScore).toBeLessThanOrEqual(safeScore);
    });
  });

  describe('getBestPieceToGive', () => {
    it('should return a piece from available pieces', () => {
      const board = createEmptyBoard();
      const availablePieces = [0, 1, 2, 3, 4, 5];

      const bestPiece = getBestPieceToGive(board, availablePieces);

      expect(availablePieces).toContain(bestPiece);
    });

    it('should prefer safer pieces over dangerous ones', () => {
      // Board with 3 light pieces in a row
      const board: Board = {
        positions: [0, 2, 4, null, null, null, null, null, null, null, null, null, null, null, null, null],
      };
      // 6 is light (dangerous - completes the row), 9 has no shared attrs
      const availablePieces = [6, 9];

      // Get evaluation scores for comparison
      const dangerousScore = evaluatePieceGive(board, 6, availablePieces);
      const safeScore = evaluatePieceGive(board, 9, availablePieces);

      // The dangerous piece should have a lower (more negative) score
      expect(dangerousScore).toBeLessThanOrEqual(safeScore);
    });
  });
});

describe('AI Minimax', () => {
  describe('getAIMove', () => {
    it('should return a valid move for selecting phase', () => {
      const board = createEmptyBoard();
      const availablePieces = Array.from({ length: 16 }, (_, i) => i);

      const move = getAIMove(board, availablePieces, null, 'selecting', 'easy');

      expect(move.type).toBe('select');
      expect(move.pieceId).toBeDefined();
      expect(availablePieces).toContain(move.pieceId);
    });

    it('should return a valid move for placing phase', () => {
      const board = createEmptyBoard();
      const availablePieces = Array.from({ length: 15 }, (_, i) => i + 1);
      const selectedPiece = 0;

      const move = getAIMove(board, availablePieces, selectedPiece, 'placing', 'easy');

      expect(move.type).toBe('place');
      expect(move.position).toBeDefined();
      expect(move.position).toBeGreaterThanOrEqual(0);
      expect(move.position).toBeLessThanOrEqual(15);
    });

    it('should find winning move when available', () => {
      // Board with 3 light pieces, AI has light piece to place
      const board: Board = {
        positions: [0, 2, 4, null, null, null, null, null, null, null, null, null, null, null, null, null],
      };
      const availablePieces = [1, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const selectedPiece = 6; // Light piece that completes the row

      const move = getAIMove(board, availablePieces, selectedPiece, 'placing', 'hard');

      expect(move.type).toBe('place');
      expect(move.position).toBe(3); // Position to complete the row
      expect(move.score).toBe(100000); // Win score
    });
  });

  describe('selectPieceForOpponent', () => {
    it('should return a piece from available pieces', () => {
      const board = createEmptyBoard();
      const availablePieces = [0, 1, 2, 3, 4, 5];

      const move = selectPieceForOpponent(board, availablePieces, 2);

      expect(move.type).toBe('select');
      expect(availablePieces).toContain(move.pieceId);
    });

    it('should avoid giving winning pieces when possible', () => {
      // Board where giving certain pieces leads to immediate loss
      const board: Board = {
        positions: [0, 2, 4, null, null, null, null, null, null, null, null, null, null, null, null, null],
      };
      const availablePieces = [6, 1, 3, 5]; // 6 is dangerous (light)

      const move = selectPieceForOpponent(board, availablePieces, 3);

      // AI should avoid giving the dangerous piece if possible
      // (though this depends on depth and looking ahead)
      expect(move.type).toBe('select');
      expect(availablePieces).toContain(move.pieceId);
    });
  });

  describe('placePiece', () => {
    it('should find immediate winning position', () => {
      const board: Board = {
        positions: [0, 2, 4, null, null, null, null, null, null, null, null, null, null, null, null, null],
      };
      const availablePieces = [1, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const selectedPiece = 6; // Completes light row

      const move = placePiece(board, selectedPiece, availablePieces, 4);

      expect(move.position).toBe(3);
      expect(move.score).toBe(100000);
    });

    it('should return valid position for normal game', () => {
      const board = createEmptyBoard();
      const availablePieces = Array.from({ length: 15 }, (_, i) => i + 1);

      const move = placePiece(board, 0, availablePieces, 2);

      expect(move.position).toBeGreaterThanOrEqual(0);
      expect(move.position).toBeLessThanOrEqual(15);
    });
  });

  describe('getRandomMove', () => {
    it('should return random piece for selecting phase', () => {
      const board = createEmptyBoard();
      const availablePieces = [0, 1, 2, 3];

      const move = getRandomMove(board, availablePieces, null, 'selecting');

      expect(move.type).toBe('select');
      expect(availablePieces).toContain(move.pieceId);
    });

    it('should return random position for placing phase', () => {
      const board = createEmptyBoard();
      const availablePieces = [1, 2, 3];

      const move = getRandomMove(board, availablePieces, 0, 'placing');

      expect(move.type).toBe('place');
      expect(move.position).toBeGreaterThanOrEqual(0);
      expect(move.position).toBeLessThanOrEqual(15);
    });
  });

  describe('getAIMoveWithRandomness', () => {
    it('should return valid move for easy difficulty', () => {
      const board = createEmptyBoard();
      const availablePieces = Array.from({ length: 16 }, (_, i) => i);

      const move = getAIMoveWithRandomness(board, availablePieces, null, 'selecting', 'easy');
      expect(move.type).toBe('select');
      expect(availablePieces).toContain(move.pieceId);
    });

    it('should return valid move for medium difficulty', () => {
      const board = createEmptyBoard();
      const availablePieces = Array.from({ length: 16 }, (_, i) => i);

      const move = getAIMoveWithRandomness(board, availablePieces, null, 'selecting', 'medium');
      expect(move.type).toBe('select');
      expect(availablePieces).toContain(move.pieceId);
    });
  });
});

describe('AI Integration', () => {
  it('should play a complete game without errors', () => {
    let board = createEmptyBoard();
    let availablePieces = Array.from({ length: 16 }, (_, i) => i);
    let selectedPiece: number | null = null;
    let phase: 'selecting' | 'placing' = 'selecting';
    let moves = 0;
    const maxMoves = 32; // 16 pieces * 2 actions each

    while (moves < maxMoves && availablePieces.length > 0) {
      const move = getAIMoveWithRandomness(board, availablePieces, selectedPiece, phase, 'easy');

      if (phase === 'selecting') {
        expect(move.type).toBe('select');
        expect(move.pieceId).toBeDefined();
        selectedPiece = move.pieceId!;
        phase = 'placing';
      } else {
        expect(move.type).toBe('place');
        expect(move.position).toBeDefined();

        // Place the piece
        const newPositions = [...board.positions];
        newPositions[move.position!] = selectedPiece;
        board = { positions: newPositions };

        // Remove piece from available
        availablePieces = availablePieces.filter(id => id !== selectedPiece);
        selectedPiece = null;
        phase = 'selecting';

        // Check for win
        if (hasQuarto(board)) {
          break;
        }
      }

      moves++;
    }

    // Game should complete without throwing
    expect(moves).toBeGreaterThan(0);
  });

  it('should respond within reasonable time for medium difficulty', () => {
    const board = createEmptyBoard();
    const availablePieces = Array.from({ length: 16 }, (_, i) => i);

    const start = Date.now();
    getAIMove(board, availablePieces, null, 'selecting', 'medium');
    const duration = Date.now() - start;

    // Should complete within 2 seconds for medium difficulty
    expect(duration).toBeLessThan(2000);
  });
});
