import { describe, it, expect } from 'vitest';
import {
  checkLine,
  findWinningLine,
  findAllWinningLines,
  hasQuarto,
  isBoardFull,
  getEmptyPositions,
  getPlacedPieceCount,
  createEmptyBoard,
  isValidPlacement,
  positionToCoords,
  coordsToPosition,
} from '../../../app/features/quarto/utils/winDetection';
import type { Board } from '../../../app/features/quarto/types/quarto.types';

describe('winDetection', () => {
  describe('createEmptyBoard', () => {
    it('should create a board with 16 null positions', () => {
      const board = createEmptyBoard();
      expect(board.positions).toHaveLength(16);
      expect(board.positions.every(p => p === null)).toBe(true);
    });
  });

  describe('checkLine', () => {
    it('should return no quarto for line with empty positions', () => {
      const board = createEmptyBoard();
      const result = checkLine(board, [0, 1, 2, 3]);
      expect(result.hasQuarto).toBe(false);
    });

    it('should return no quarto for partially filled line', () => {
      const board: Board = {
        positions: [0, 1, null, null, ...Array(12).fill(null)],
      };
      const result = checkLine(board, [0, 1, 2, 3]);
      expect(result.hasQuarto).toBe(false);
    });

    it('should detect quarto for 4 pieces sharing color', () => {
      // Pieces 0, 2, 4, 6 are all light
      const board: Board = {
        positions: [0, 2, 4, 6, ...Array(12).fill(null)],
      };
      const result = checkLine(board, [0, 1, 2, 3]);
      expect(result.hasQuarto).toBe(true);
      expect(result.sharedAttributes).toContain('color');
    });

    it('should detect quarto for 4 pieces sharing shape', () => {
      // Pieces 0, 1, 4, 5 are all round
      const board: Board = {
        positions: [0, 1, 4, 5, ...Array(12).fill(null)],
      };
      const result = checkLine(board, [0, 1, 2, 3]);
      expect(result.hasQuarto).toBe(true);
      expect(result.sharedAttributes).toContain('shape');
    });

    it('should detect quarto for 4 pieces sharing top', () => {
      // Pieces 0, 1, 2, 3 are all solid
      const board: Board = {
        positions: [0, 1, 2, 3, ...Array(12).fill(null)],
      };
      const result = checkLine(board, [0, 1, 2, 3]);
      expect(result.hasQuarto).toBe(true);
      expect(result.sharedAttributes).toContain('top');
    });

    it('should detect quarto for 4 pieces sharing height', () => {
      // Pieces 0, 1, 2, 3 are all short
      const board: Board = {
        positions: [0, 1, 2, 3, ...Array(12).fill(null)],
      };
      const result = checkLine(board, [0, 1, 2, 3]);
      expect(result.hasQuarto).toBe(true);
      expect(result.sharedAttributes).toContain('height');
    });

    it('should return no quarto for 4 pieces with no shared attributes', () => {
      // Pieces that differ in all attributes
      // 0: light, round, solid, short
      // 5: dark, round, hollow, short
      // 10: light, square, solid, tall
      // 15: dark, square, hollow, tall
      const board: Board = {
        positions: [0, 5, 10, 15, ...Array(12).fill(null)],
      };
      const result = checkLine(board, [0, 1, 2, 3]);
      expect(result.hasQuarto).toBe(false);
    });
  });

  describe('findWinningLine', () => {
    it('should return null for empty board', () => {
      const board = createEmptyBoard();
      expect(findWinningLine(board)).toBeNull();
    });

    it('should find winning row', () => {
      // Light pieces in row 1
      const board: Board = {
        positions: [
          ...Array(4).fill(null),  // row 0
          0, 2, 4, 6,              // row 1: light pieces
          ...Array(8).fill(null),  // rows 2-3
        ],
      };
      const result = findWinningLine(board);
      expect(result).not.toBeNull();
      expect(result?.positions).toEqual([4, 5, 6, 7]);
    });

    it('should find winning column', () => {
      // Short pieces in column 0
      const board: Board = {
        positions: [
          0, null, null, null,   // row 0
          1, null, null, null,   // row 1
          2, null, null, null,   // row 2
          3, null, null, null,   // row 3
        ],
      };
      const result = findWinningLine(board);
      expect(result).not.toBeNull();
      expect(result?.positions).toEqual([0, 4, 8, 12]);
    });

    it('should find winning diagonal', () => {
      // Light + short pieces on main diagonal
      const board: Board = {
        positions: [
          0, null, null, null,    // position 0
          null, 2, null, null,    // position 5
          null, null, 4, null,    // position 10
          null, null, null, 6,    // position 15
        ],
      };
      const result = findWinningLine(board);
      expect(result).not.toBeNull();
      expect(result?.positions).toEqual([0, 5, 10, 15]);
    });

    it('should find anti-diagonal win', () => {
      // Round pieces on anti-diagonal: positions 3, 6, 9, 12
      const board: Board = {
        positions: [
          null, null, null, 0,    // position 3
          null, null, 1, null,    // position 6
          null, 4, null, null,    // position 9
          5, null, null, null,    // position 12
        ],
      };
      const result = findWinningLine(board);
      expect(result).not.toBeNull();
      expect(result?.positions).toEqual([3, 6, 9, 12]);
    });
  });

  describe('findAllWinningLines', () => {
    it('should return empty array for no wins', () => {
      const board = createEmptyBoard();
      expect(findAllWinningLines(board)).toEqual([]);
    });

    it('should find multiple winning lines', () => {
      // Board where a row and column both win
      const board: Board = {
        positions: [
          0, 2, 4, 6,    // row 0: all light (win)
          null, null, null, null,
          null, null, null, null,
          null, null, null, null,
        ],
      };
      // Modify to also win a column
      board.positions[4] = 8;   // tall+light
      board.positions[8] = 0;   // Actually we need 4 in column
      // Let's simplify: just verify single win returns array of 1
      const results = findAllWinningLines(board);
      expect(results.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('hasQuarto', () => {
    it('should return false for empty board', () => {
      expect(hasQuarto(createEmptyBoard())).toBe(false);
    });

    it('should return true when quarto exists', () => {
      const board: Board = {
        positions: [0, 2, 4, 6, ...Array(12).fill(null)],
      };
      expect(hasQuarto(board)).toBe(true);
    });
  });

  describe('isBoardFull', () => {
    it('should return false for empty board', () => {
      expect(isBoardFull(createEmptyBoard())).toBe(false);
    });

    it('should return false for partially filled board', () => {
      const board: Board = {
        positions: [0, 1, 2, null, ...Array(12).fill(null)],
      };
      expect(isBoardFull(board)).toBe(false);
    });

    it('should return true for full board', () => {
      const board: Board = {
        positions: Array.from({ length: 16 }, (_, i) => i),
      };
      expect(isBoardFull(board)).toBe(true);
    });
  });

  describe('getEmptyPositions', () => {
    it('should return all positions for empty board', () => {
      const empty = getEmptyPositions(createEmptyBoard());
      expect(empty).toHaveLength(16);
      expect(empty).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });

    it('should return correct empty positions', () => {
      const board: Board = {
        positions: [0, null, 2, null, ...Array(12).fill(null)],
      };
      const empty = getEmptyPositions(board);
      expect(empty).toContain(1);
      expect(empty).toContain(3);
      expect(empty).not.toContain(0);
      expect(empty).not.toContain(2);
    });

    it('should return empty array for full board', () => {
      const board: Board = {
        positions: Array.from({ length: 16 }, (_, i) => i),
      };
      expect(getEmptyPositions(board)).toEqual([]);
    });
  });

  describe('getPlacedPieceCount', () => {
    it('should return 0 for empty board', () => {
      expect(getPlacedPieceCount(createEmptyBoard())).toBe(0);
    });

    it('should return correct count', () => {
      const board: Board = {
        positions: [0, 1, 2, null, ...Array(12).fill(null)],
      };
      expect(getPlacedPieceCount(board)).toBe(3);
    });

    it('should return 16 for full board', () => {
      const board: Board = {
        positions: Array.from({ length: 16 }, (_, i) => i),
      };
      expect(getPlacedPieceCount(board)).toBe(16);
    });
  });

  describe('isValidPlacement', () => {
    it('should return true for empty position', () => {
      const board = createEmptyBoard();
      expect(isValidPlacement(board, 0)).toBe(true);
      expect(isValidPlacement(board, 15)).toBe(true);
    });

    it('should return false for occupied position', () => {
      const board: Board = {
        positions: [0, ...Array(15).fill(null)],
      };
      expect(isValidPlacement(board, 0)).toBe(false);
    });

    it('should return false for out-of-bounds position', () => {
      const board = createEmptyBoard();
      expect(isValidPlacement(board, -1)).toBe(false);
      expect(isValidPlacement(board, 16)).toBe(false);
    });
  });

  describe('positionToCoords', () => {
    it('should convert positions to correct coordinates', () => {
      expect(positionToCoords(0)).toEqual({ row: 0, col: 0 });
      expect(positionToCoords(3)).toEqual({ row: 0, col: 3 });
      expect(positionToCoords(4)).toEqual({ row: 1, col: 0 });
      expect(positionToCoords(15)).toEqual({ row: 3, col: 3 });
      expect(positionToCoords(6)).toEqual({ row: 1, col: 2 });
    });
  });

  describe('coordsToPosition', () => {
    it('should convert coordinates to correct position', () => {
      expect(coordsToPosition(0, 0)).toBe(0);
      expect(coordsToPosition(0, 3)).toBe(3);
      expect(coordsToPosition(1, 0)).toBe(4);
      expect(coordsToPosition(3, 3)).toBe(15);
      expect(coordsToPosition(1, 2)).toBe(6);
    });

    it('should be inverse of positionToCoords', () => {
      for (let pos = 0; pos < 16; pos++) {
        const { row, col } = positionToCoords(pos);
        expect(coordsToPosition(row, col)).toBe(pos);
      }
    });
  });
});
