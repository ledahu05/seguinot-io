import type { Board, Piece } from '../types/quarto.types';
import { WINNING_LINES } from '../types/quarto.types';
import { getPieceById, findSharedAttributes } from '../utils/pieceAttributes';
import { hasQuarto } from '../utils/winDetection';

/**
 * Board evaluation heuristics for Quarto AI.
 *
 * Scoring philosophy:
 * - Immediate win/loss: extreme values
 * - Near-win threats (3 pieces with shared attribute): high value
 * - Potential lines (2 pieces with shared attribute): medium value
 * - Board control (center positions): low value
 */

// Score constants
const SCORE_WIN = 100000;
const SCORE_LOSS = -100000;
const SCORE_THREE_THREAT = 1000;
const SCORE_TWO_POTENTIAL = 100;
const SCORE_ONE_START = 10;
const SCORE_CENTER_CONTROL = 5;

// Center positions get a small bonus
const CENTER_POSITIONS = [5, 6, 9, 10];

/**
 * Evaluates the board from the perspective of the AI (maximizing player).
 * Higher scores favor the AI, lower scores favor the opponent.
 */
export function evaluateBoard(
  board: Board,
  availablePieces: number[],
  isAITurn: boolean
): number {
  // Check for immediate win
  if (hasQuarto(board)) {
    // If Quarto exists and it's AI's turn to call it, AI wins
    // If opponent's turn, opponent wins
    return isAITurn ? SCORE_WIN : SCORE_LOSS;
  }

  let score = 0;

  // Evaluate each winning line
  for (const line of WINNING_LINES) {
    const lineScore = evaluateLine(board, line, availablePieces);
    score += lineScore;
  }

  // Center control bonus
  for (const pos of CENTER_POSITIONS) {
    if (board.positions[pos] !== null) {
      score += SCORE_CENTER_CONTROL;
    }
  }

  return score;
}

/**
 * Evaluates a single line for potential threats and opportunities.
 */
export function evaluateLine(
  board: Board,
  linePositions: number[],
  availablePieces: number[]
): number {
  const pieceIds = linePositions.map(pos => board.positions[pos]);
  const filledPositions = pieceIds.filter(id => id !== null);

  // Empty line - no value yet
  if (filledPositions.length === 0) {
    return 0;
  }

  // Get actual pieces on the line
  const pieces = filledPositions
    .map(id => getPieceById(id as number))
    .filter((p): p is Piece => p !== undefined);

  // Check for shared attributes among existing pieces
  const sharedAttrs = findSharedAttributes(pieces);

  // No shared attributes means this line can't form a Quarto
  if (sharedAttrs.length === 0) {
    return 0;
  }

  // Score based on how many pieces are in the line
  switch (pieces.length) {
    case 4:
      // Full line with shared attributes = Quarto (handled above)
      return SCORE_WIN;
    case 3:
      // Three pieces with shared attribute - potential winning threat
      // Check if there's a piece available that would complete the Quarto
      if (canCompleteQuarto(pieces, availablePieces, sharedAttrs)) {
        return SCORE_THREE_THREAT * sharedAttrs.length;
      }
      return SCORE_THREE_THREAT * 0.5 * sharedAttrs.length;
    case 2:
      // Two pieces with shared attribute - building potential
      return SCORE_TWO_POTENTIAL * sharedAttrs.length;
    case 1:
      // Single piece - minimal strategic value
      return SCORE_ONE_START;
    default:
      return 0;
  }
}

/**
 * Checks if there's an available piece that would complete a Quarto on this line.
 */
export function canCompleteQuarto(
  existingPieces: Piece[],
  availablePieces: number[],
  sharedAttrs: Array<keyof Omit<Piece, 'id'>>
): boolean {
  for (const pieceId of availablePieces) {
    const piece = getPieceById(pieceId);
    if (!piece) continue;

    // Check if this piece shares ALL the required attributes
    const wouldComplete = sharedAttrs.every(attr =>
      piece[attr] === existingPieces[0][attr]
    );

    if (wouldComplete) {
      return true;
    }
  }
  return false;
}

/**
 * Evaluates giving a specific piece to the opponent.
 * Lower scores are better (less dangerous to give).
 */
export function evaluatePieceGive(
  board: Board,
  pieceId: number,
  _availablePieces: number[]
): number {
  const piece = getPieceById(pieceId);
  if (!piece) return 0;

  let dangerScore = 0;

  // Check each line for how dangerous giving this piece would be
  for (const line of WINNING_LINES) {
    const pieceIds = line.map(pos => board.positions[pos]);
    const filledPieces = pieceIds
      .filter(id => id !== null)
      .map(id => getPieceById(id as number))
      .filter((p): p is Piece => p !== undefined);

    const emptyCount = 4 - filledPieces.length;

    // If line has 3 pieces and giving this piece could complete it
    if (filledPieces.length === 3 && emptyCount === 1) {
      const allFourPieces = [...filledPieces, piece];
      const sharedAttrs = findSharedAttributes(allFourPieces);
      if (sharedAttrs.length > 0) {
        // This piece would enable opponent to win!
        dangerScore += SCORE_THREE_THREAT * 10;
      }
    }

    // If line has 2 pieces, check if this piece builds threat
    if (filledPieces.length === 2) {
      const threePieces = [...filledPieces, piece];
      const sharedAttrs = findSharedAttributes(threePieces);
      if (sharedAttrs.length > 0) {
        dangerScore += SCORE_TWO_POTENTIAL;
      }
    }
  }

  return -dangerScore; // Negative because lower is better for giving
}

/**
 * Gets the best piece to give to opponent (least dangerous).
 */
export function getBestPieceToGive(
  board: Board,
  availablePieces: number[]
): number {
  if (availablePieces.length === 0) {
    throw new Error('No pieces available to give');
  }

  let bestPiece = availablePieces[0];
  let bestScore = evaluatePieceGive(board, bestPiece, availablePieces);

  for (let i = 1; i < availablePieces.length; i++) {
    const pieceId = availablePieces[i];
    const score = evaluatePieceGive(board, pieceId, availablePieces);
    if (score > bestScore) {
      bestScore = score;
      bestPiece = pieceId;
    }
  }

  return bestPiece;
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
 * Evaluates placing a piece at a specific position.
 * Higher scores are better positions.
 */
export function evaluatePlacement(
  board: Board,
  position: number,
  pieceId: number,
  availablePieces: number[]
): number {
  // Create a temporary board with the piece placed
  const tempBoard: Board = {
    positions: [...board.positions],
  };
  tempBoard.positions[position] = pieceId;

  // Filter out the placed piece from available
  const remainingPieces = availablePieces.filter(id => id !== pieceId);

  // Evaluate the resulting board state
  return evaluateBoard(tempBoard, remainingPieces, true);
}
