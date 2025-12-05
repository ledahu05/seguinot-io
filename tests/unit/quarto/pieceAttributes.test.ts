import { describe, it, expect } from 'vitest';
import {
  generateAllPieces,
  ALL_PIECES,
  getPieceById,
  getPiecesById,
  computePieceId,
  findSharedAttributes,
  hasSharedAttribute,
} from '../../../app/features/quarto/utils/pieceAttributes';

describe('pieceAttributes', () => {
  describe('generateAllPieces', () => {
    it('should generate exactly 16 pieces', () => {
      const pieces = generateAllPieces();
      expect(pieces).toHaveLength(16);
    });

    it('should generate pieces with unique IDs from 0-15', () => {
      const pieces = generateAllPieces();
      const ids = pieces.map(p => p.id);
      expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });

    it('should encode attributes correctly into piece ID', () => {
      const pieces = generateAllPieces();

      // ID 0: light, round, solid, short (all 0 bits)
      expect(pieces[0]).toEqual({
        id: 0,
        color: 'light',
        shape: 'round',
        top: 'solid',
        height: 'short',
      });

      // ID 1: dark (bit 0 = 1)
      expect(pieces[1].color).toBe('dark');
      expect(pieces[1].shape).toBe('round');
      expect(pieces[1].top).toBe('solid');
      expect(pieces[1].height).toBe('short');

      // ID 2: square (bit 1 = 1)
      expect(pieces[2].color).toBe('light');
      expect(pieces[2].shape).toBe('square');

      // ID 4: hollow (bit 2 = 1)
      expect(pieces[4].top).toBe('hollow');

      // ID 8: tall (bit 3 = 1)
      expect(pieces[8].height).toBe('tall');

      // ID 15: all 1 bits
      expect(pieces[15]).toEqual({
        id: 15,
        color: 'dark',
        shape: 'square',
        top: 'hollow',
        height: 'tall',
      });
    });
  });

  describe('ALL_PIECES constant', () => {
    it('should be frozen and immutable', () => {
      expect(Object.isFrozen(ALL_PIECES)).toBe(true);
    });

    it('should have 16 pieces', () => {
      expect(ALL_PIECES).toHaveLength(16);
    });
  });

  describe('getPieceById', () => {
    it('should return the correct piece for valid IDs', () => {
      expect(getPieceById(0)?.id).toBe(0);
      expect(getPieceById(15)?.id).toBe(15);
      expect(getPieceById(7)?.id).toBe(7);
    });

    it('should return undefined for invalid IDs', () => {
      expect(getPieceById(-1)).toBeUndefined();
      expect(getPieceById(16)).toBeUndefined();
      expect(getPieceById(100)).toBeUndefined();
    });
  });

  describe('getPiecesById', () => {
    it('should return array of pieces for valid IDs', () => {
      const pieces = getPiecesById([0, 5, 10]);
      expect(pieces).toHaveLength(3);
      expect(pieces.map(p => p.id)).toEqual([0, 5, 10]);
    });

    it('should filter out invalid IDs', () => {
      const pieces = getPiecesById([0, -1, 5, 20, 10]);
      expect(pieces).toHaveLength(3);
      expect(pieces.map(p => p.id)).toEqual([0, 5, 10]);
    });

    it('should return empty array for all invalid IDs', () => {
      const pieces = getPiecesById([-1, 16, 100]);
      expect(pieces).toHaveLength(0);
    });
  });

  describe('computePieceId', () => {
    it('should compute ID 0 for all "zero" attributes', () => {
      expect(computePieceId('light', 'round', 'solid', 'short')).toBe(0);
    });

    it('should compute ID 15 for all "one" attributes', () => {
      expect(computePieceId('dark', 'square', 'hollow', 'tall')).toBe(15);
    });

    it('should compute correct IDs for various combinations', () => {
      // dark only = 1
      expect(computePieceId('dark', 'round', 'solid', 'short')).toBe(1);

      // square only = 2
      expect(computePieceId('light', 'square', 'solid', 'short')).toBe(2);

      // hollow only = 4
      expect(computePieceId('light', 'round', 'hollow', 'short')).toBe(4);

      // tall only = 8
      expect(computePieceId('light', 'round', 'solid', 'tall')).toBe(8);

      // dark + hollow = 1 + 4 = 5
      expect(computePieceId('dark', 'round', 'hollow', 'short')).toBe(5);

      // square + tall = 2 + 8 = 10
      expect(computePieceId('light', 'square', 'solid', 'tall')).toBe(10);
    });

    it('should match the generated pieces', () => {
      for (const piece of ALL_PIECES) {
        const computedId = computePieceId(
          piece.color,
          piece.shape,
          piece.top,
          piece.height
        );
        expect(computedId).toBe(piece.id);
      }
    });
  });

  describe('findSharedAttributes', () => {
    it('should return empty array for less than 2 pieces', () => {
      expect(findSharedAttributes([])).toEqual([]);
      expect(findSharedAttributes([ALL_PIECES[0]])).toEqual([]);
    });

    it('should find shared color attribute', () => {
      // All light pieces: 0, 2, 4, 6
      const lightPieces = getPiecesById([0, 2, 4, 6]);
      const shared = findSharedAttributes(lightPieces);
      expect(shared).toContain('color');
    });

    it('should find shared shape attribute', () => {
      // All round pieces: 0, 1, 4, 5, 8, 9, 12, 13
      const roundPieces = getPiecesById([0, 1, 4, 5]);
      const shared = findSharedAttributes(roundPieces);
      expect(shared).toContain('shape');
    });

    it('should find multiple shared attributes', () => {
      // Light and round: 0, 4
      const pieces = getPiecesById([0, 4]);
      const shared = findSharedAttributes(pieces);
      expect(shared).toContain('color');
      expect(shared).toContain('shape');
    });

    it('should return empty array when no shared attributes', () => {
      // Pieces with no common attributes
      const pieces = getPiecesById([0, 15]); // Opposite in every way
      const shared = findSharedAttributes(pieces);
      expect(shared).toEqual([]);
    });
  });

  describe('hasSharedAttribute', () => {
    it('should return true when pieces share an attribute', () => {
      const lightPieces = getPiecesById([0, 2, 4, 6]);
      expect(hasSharedAttribute(lightPieces)).toBe(true);
    });

    it('should return false when pieces share no attributes', () => {
      const pieces = getPiecesById([0, 15]);
      expect(hasSharedAttribute(pieces)).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(hasSharedAttribute([])).toBe(false);
    });
  });
});
