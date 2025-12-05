import type { Piece, PieceColor, PieceShape, PieceTop, PieceHeight } from '../types/quarto.types';

/**
 * Generates all 16 unique Quarto pieces.
 * Each piece has 4 binary attributes, creating 2^4 = 16 combinations.
 *
 * Piece ID encoding (4-bit binary):
 * - Bit 0: color (0=light, 1=dark)
 * - Bit 1: shape (0=round, 1=square)
 * - Bit 2: top (0=solid, 1=hollow)
 * - Bit 3: height (0=short, 1=tall)
 */
export function generateAllPieces(): Piece[] {
  const pieces: Piece[] = [];

  for (let id = 0; id < 16; id++) {
    pieces.push({
      id,
      color: (id & 1) === 0 ? 'light' : 'dark',
      shape: (id & 2) === 0 ? 'round' : 'square',
      top: (id & 4) === 0 ? 'solid' : 'hollow',
      height: (id & 8) === 0 ? 'short' : 'tall',
    });
  }

  return pieces;
}

/**
 * Pre-generated array of all 16 pieces (immutable).
 */
export const ALL_PIECES: readonly Piece[] = Object.freeze(generateAllPieces());

/**
 * Gets a piece by its ID (0-15).
 */
export function getPieceById(id: number): Piece | undefined {
  if (id < 0 || id > 15) return undefined;
  return ALL_PIECES[id];
}

/**
 * Gets pieces from an array of IDs.
 */
export function getPiecesById(ids: number[]): Piece[] {
  return ids
    .map(id => getPieceById(id))
    .filter((p): p is Piece => p !== undefined);
}

/**
 * Computes piece ID from attributes.
 */
export function computePieceId(
  color: PieceColor,
  shape: PieceShape,
  top: PieceTop,
  height: PieceHeight
): number {
  return (
    (color === 'dark' ? 1 : 0) |
    (shape === 'square' ? 2 : 0) |
    (top === 'hollow' ? 4 : 0) |
    (height === 'tall' ? 8 : 0)
  );
}

/**
 * Checks if a set of pieces all share at least one common attribute.
 * Returns the shared attribute(s) if found.
 */
export function findSharedAttributes(pieces: Piece[]): Array<keyof Omit<Piece, 'id'>> {
  if (pieces.length < 2) return [];

  const sharedAttrs: Array<keyof Omit<Piece, 'id'>> = [];
  const attributes: Array<keyof Omit<Piece, 'id'>> = ['color', 'shape', 'top', 'height'];

  for (const attr of attributes) {
    const firstValue = pieces[0][attr];
    if (pieces.every(p => p[attr] === firstValue)) {
      sharedAttrs.push(attr);
    }
  }

  return sharedAttrs;
}

/**
 * Checks if all pieces in array share at least one attribute.
 */
export function hasSharedAttribute(pieces: Piece[]): boolean {
  return findSharedAttributes(pieces).length > 0;
}

/**
 * Gets piece attribute value by attribute name.
 */
export function getPieceAttribute(piece: Piece, attr: keyof Omit<Piece, 'id'>): string {
  return piece[attr];
}
