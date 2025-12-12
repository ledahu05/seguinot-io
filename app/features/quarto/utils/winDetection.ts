import type { Board, Piece } from '../types/quarto.types';
import { WINNING_LINES, WINNING_SQUARES } from '../types/quarto.types';
import { getPieceById, findSharedAttributes } from './pieceAttributes';

/**
 * Result of checking a line or square for Quarto.
 */
export interface LineCheckResult {
  hasQuarto: boolean;
  positions: number[];
  sharedAttributes: Array<keyof Omit<Piece, 'id'>>;
  isSquare?: boolean;  // True if this is a 2x2 square win
}

/**
 * Checks if a specific line (4 positions) forms a Quarto.
 * A Quarto exists when all 4 pieces share at least one common attribute.
 */
export function checkLine(board: Board, linePositions: number[]): LineCheckResult {
  const result: LineCheckResult = {
    hasQuarto: false,
    positions: linePositions,
    sharedAttributes: [],
  };

  // Get pieces at the line positions
  const pieceIds = linePositions.map(pos => board.positions[pos]);

  // All 4 positions must have pieces
  if (pieceIds.some(id => id === null)) {
    return result;
  }

  // Get actual piece objects
  const pieces = pieceIds.map(id => getPieceById(id as number)).filter((p): p is Piece => p !== undefined);

  if (pieces.length !== 4) {
    return result;
  }

  // Check for shared attributes
  const sharedAttrs = findSharedAttributes(pieces);

  if (sharedAttrs.length > 0) {
    result.hasQuarto = true;
    result.sharedAttributes = sharedAttrs;
  }

  return result;
}

/**
 * Checks if a specific 2x2 square (4 positions) forms a Quarto.
 * A Quarto exists when all 4 pieces share at least one common attribute.
 * (Advanced Variation)
 */
export function checkSquare(board: Board, squarePositions: number[]): LineCheckResult {
  const result: LineCheckResult = {
    hasQuarto: false,
    positions: squarePositions,
    sharedAttributes: [],
    isSquare: true,
  };

  // Get pieces at the square positions
  const pieceIds = squarePositions.map(pos => board.positions[pos]);

  // All 4 positions must have pieces
  if (pieceIds.some(id => id === null)) {
    return result;
  }

  // Get actual piece objects
  const pieces = pieceIds.map(id => getPieceById(id as number)).filter((p): p is Piece => p !== undefined);

  if (pieces.length !== 4) {
    return result;
  }

  // Check for shared attributes
  const sharedAttrs = findSharedAttributes(pieces);

  if (sharedAttrs.length > 0) {
    result.hasQuarto = true;
    result.sharedAttributes = sharedAttrs;
  }

  return result;
}

/**
 * Finds the first winning 2x2 square on the board.
 * Returns null if no Quarto exists in any square.
 * (Advanced Variation)
 */
export function findWinningSquare(board: Board): LineCheckResult | null {
  for (const square of WINNING_SQUARES) {
    const result = checkSquare(board, square);
    if (result.hasQuarto) {
      return result;
    }
  }
  return null;
}

/**
 * Finds all winning 2x2 squares on the board.
 * (Advanced Variation)
 */
export function findAllWinningSquares(board: Board): LineCheckResult[] {
  const winners: LineCheckResult[] = [];

  for (const square of WINNING_SQUARES) {
    const result = checkSquare(board, square);
    if (result.hasQuarto) {
      winners.push(result);
    }
  }

  return winners;
}

/**
 * Finds the first winning line on the board.
 * Returns null if no Quarto exists.
 * @param advancedRules - If true, also checks 2x2 squares (Advanced Variation)
 */
export function findWinningLine(board: Board, advancedRules = false): LineCheckResult | null {
  // Check standard winning lines first
  for (const line of WINNING_LINES) {
    const result = checkLine(board, line);
    if (result.hasQuarto) {
      return result;
    }
  }

  // Check 2x2 squares if advanced rules enabled
  if (advancedRules) {
    for (const square of WINNING_SQUARES) {
      const result = checkSquare(board, square);
      if (result.hasQuarto) {
        return result;
      }
    }
  }

  return null;
}

/**
 * Finds all winning lines on the board.
 * Usually there's only one, but theoretically multiple could exist.
 * @param advancedRules - If true, also checks 2x2 squares (Advanced Variation)
 */
export function findAllWinningLines(board: Board, advancedRules = false): LineCheckResult[] {
  const winners: LineCheckResult[] = [];

  // Check standard winning lines
  for (const line of WINNING_LINES) {
    const result = checkLine(board, line);
    if (result.hasQuarto) {
      winners.push(result);
    }
  }

  // Check 2x2 squares if advanced rules enabled
  if (advancedRules) {
    for (const square of WINNING_SQUARES) {
      const result = checkSquare(board, square);
      if (result.hasQuarto) {
        winners.push(result);
      }
    }
  }

  return winners;
}

/**
 * Quick check if any Quarto exists on the board.
 * @param advancedRules - If true, also checks 2x2 squares (Advanced Variation)
 */
export function hasQuarto(board: Board, advancedRules = false): boolean {
  return findWinningLine(board, advancedRules) !== null;
}

/**
 * Checks if the board is full (draw if no Quarto).
 */
export function isBoardFull(board: Board): boolean {
  return board.positions.every(pos => pos !== null);
}

/**
 * Gets all empty positions on the board.
 */
export function getEmptyPositions(board: Board): number[] {
  return board.positions
    .map((pos, idx) => (pos === null ? idx : -1))
    .filter(idx => idx !== -1);
}

/**
 * Gets the count of placed pieces on the board.
 */
export function getPlacedPieceCount(board: Board): number {
  return board.positions.filter(pos => pos !== null).length;
}

/**
 * Creates an empty board.
 */
export function createEmptyBoard(): Board {
  return {
    positions: Array(16).fill(null),
  };
}

/**
 * Checks if a position is valid and empty.
 */
export function isValidPlacement(board: Board, position: number): boolean {
  if (position < 0 || position > 15) return false;
  return board.positions[position] === null;
}

/**
 * Gets board position as row/column coordinates.
 */
export function positionToCoords(position: number): { row: number; col: number } {
  return {
    row: Math.floor(position / 4),
    col: position % 4,
  };
}

/**
 * Gets board position from row/column coordinates.
 */
export function coordsToPosition(row: number, col: number): number {
  return row * 4 + col;
}
