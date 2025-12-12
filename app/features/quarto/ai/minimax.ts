import type { Board, AIDifficulty } from '../types/quarto.types';
import { AI_DEPTHS } from '../types/quarto.types';
import { hasQuarto, isBoardFull } from '../utils/winDetection';
import {
  evaluateBoard,
  getEmptyPositions,
  getBestPieceToGive,
  evaluatePieceGive,
} from './evaluation';

/**
 * AI move decision for Quarto.
 */
export interface AIMove {
  type: 'select' | 'place';
  pieceId?: number;
  position?: number;
  score: number;
}

/**
 * Minimax result with alpha-beta pruning stats.
 */
export interface MinimaxResult {
  move: AIMove;
  nodesEvaluated: number;
  depth: number;
}

/**
 * Main AI entry point - decides the best move for the current game state.
 */
export function getAIMove(
  board: Board,
  availablePieces: number[],
  selectedPiece: number | null,
  phase: 'selecting' | 'placing',
  difficulty: AIDifficulty,
  advancedRules = false
): AIMove {
  const depth = AI_DEPTHS[difficulty];

  if (phase === 'selecting') {
    // AI needs to select a piece to give to opponent
    return selectPieceForOpponent(board, availablePieces, depth, advancedRules);
  } else {
    // AI needs to place the selected piece
    if (selectedPiece === null) {
      throw new Error('No piece selected for placement');
    }
    return placePiece(board, selectedPiece, availablePieces, depth, advancedRules);
  }
}

/**
 * Selects the best piece to give to the opponent.
 * Uses minimax to look ahead and find a piece that minimizes opponent's advantage.
 */
export function selectPieceForOpponent(
  board: Board,
  availablePieces: number[],
  depth: number,
  advancedRules = false
): AIMove {
  if (availablePieces.length === 0) {
    throw new Error('No pieces available');
  }

  // For very shallow depth or single piece, use heuristic
  if (depth <= 1 || availablePieces.length === 1) {
    const pieceId = getBestPieceToGive(board, availablePieces);
    return {
      type: 'select',
      pieceId,
      score: evaluatePieceGive(board, pieceId, availablePieces),
    };
  }

  let bestMove: AIMove = {
    type: 'select',
    pieceId: availablePieces[0],
    score: -Infinity,
  };

  // Evaluate each possible piece to give
  for (const pieceId of availablePieces) {
    // Simulate opponent placing this piece anywhere
    // We want to minimize the maximum score opponent can achieve
    let minOpponentScore = Infinity;

    const emptyPositions = getEmptyPositions(board);
    for (const position of emptyPositions) {
      // Create board after opponent places the piece
      const tempBoard = simulatePlacement(board, position, pieceId);
      const remainingPieces = availablePieces.filter(id => id !== pieceId);

      // Check for immediate Quarto (including 2x2 squares if advancedRules)
      if (hasQuarto(tempBoard, advancedRules)) {
        // Opponent wins - worst case
        minOpponentScore = -100000;
        break;
      }

      // Evaluate this resulting position
      const score = minimaxEval(
        tempBoard,
        remainingPieces,
        null, // No piece selected yet
        'selecting', // Next will be opponent selecting for us
        depth - 1,
        -Infinity,
        Infinity,
        false, // AI is minimizing (opponent's best move)
        advancedRules
      );

      minOpponentScore = Math.min(minOpponentScore, score);
    }

    // We want the piece that maximizes our minimum outcome
    if (minOpponentScore > bestMove.score) {
      bestMove = {
        type: 'select',
        pieceId,
        score: minOpponentScore,
      };
    }
  }

  return bestMove;
}

/**
 * Places the selected piece at the best position.
 * Uses minimax to find the position that maximizes AI's advantage.
 */
export function placePiece(
  board: Board,
  pieceId: number,
  availablePieces: number[],
  depth: number,
  advancedRules = false
): AIMove {
  const emptyPositions = getEmptyPositions(board);

  if (emptyPositions.length === 0) {
    throw new Error('No empty positions');
  }

  // Check for immediate winning move (including 2x2 squares if advancedRules)
  for (const position of emptyPositions) {
    const tempBoard = simulatePlacement(board, position, pieceId);
    if (hasQuarto(tempBoard, advancedRules)) {
      return {
        type: 'place',
        position,
        score: 100000,
      };
    }
  }

  // For very shallow depth, use simple heuristic
  if (depth <= 1) {
    return placePieceHeuristic(board, pieceId, availablePieces, emptyPositions);
  }

  let bestMove: AIMove = {
    type: 'place',
    position: emptyPositions[0],
    score: -Infinity,
  };

  const remainingPieces = availablePieces.filter(id => id !== pieceId);

  for (const position of emptyPositions) {
    const tempBoard = simulatePlacement(board, position, pieceId);

    // After placing, we select a piece to give to opponent
    const score = minimaxEval(
      tempBoard,
      remainingPieces,
      null, // Will need to select a piece
      'selecting', // Next phase
      depth - 1,
      -Infinity,
      Infinity,
      true, // AI is maximizing
      advancedRules
    );

    if (score > bestMove.score) {
      bestMove = {
        type: 'place',
        position,
        score,
      };
    }
  }

  return bestMove;
}

/**
 * Simple heuristic placement for shallow search.
 */
function placePieceHeuristic(
  board: Board,
  pieceId: number,
  availablePieces: number[],
  emptyPositions: number[]
): AIMove {
  let bestPosition = emptyPositions[0];
  let bestScore = -Infinity;

  for (const position of emptyPositions) {
    const tempBoard = simulatePlacement(board, position, pieceId);
    const remainingPieces = availablePieces.filter(id => id !== pieceId);
    const score = evaluateBoard(tempBoard, remainingPieces, true);

    if (score > bestScore) {
      bestScore = score;
      bestPosition = position;
    }
  }

  return {
    type: 'place',
    position: bestPosition,
    score: bestScore,
  };
}

/**
 * Minimax evaluation with alpha-beta pruning.
 */
function minimaxEval(
  board: Board,
  availablePieces: number[],
  selectedPiece: number | null,
  phase: 'selecting' | 'placing',
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  advancedRules = false
): number {
  // Terminal conditions (including 2x2 squares if advancedRules)
  if (hasQuarto(board, advancedRules)) {
    return isMaximizing ? -100000 : 100000;
  }

  if (isBoardFull(board)) {
    return 0; // Draw
  }

  if (depth === 0) {
    return evaluateBoard(board, availablePieces, isMaximizing);
  }

  if (phase === 'selecting') {
    // Selecting a piece to give to opponent
    if (isMaximizing) {
      // AI selecting piece for opponent - minimize opponent's advantage
      let maxEval = -Infinity;

      for (const pieceId of availablePieces) {
        // After selecting, opponent will place
        const evalScore = minimaxEval(
          board,
          availablePieces,
          pieceId,
          'placing',
          depth - 1,
          alpha,
          beta,
          false, // Opponent's turn to place
          advancedRules
        );

        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break; // Beta cutoff
      }

      return maxEval;
    } else {
      // Opponent selecting piece for AI
      let minEval = Infinity;

      for (const pieceId of availablePieces) {
        const evalScore = minimaxEval(
          board,
          availablePieces,
          pieceId,
          'placing',
          depth - 1,
          alpha,
          beta,
          true, // AI's turn to place
          advancedRules
        );

        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break; // Alpha cutoff
      }

      return minEval;
    }
  } else {
    // Placing phase
    if (selectedPiece === null) {
      return evaluateBoard(board, availablePieces, isMaximizing);
    }

    const emptyPositions = getEmptyPositions(board);
    const remainingPieces = availablePieces.filter(id => id !== selectedPiece);

    if (isMaximizing) {
      let maxEval = -Infinity;

      for (const position of emptyPositions) {
        const tempBoard = simulatePlacement(board, position, selectedPiece);

        // Check for immediate win (including 2x2 squares if advancedRules)
        if (hasQuarto(tempBoard, advancedRules)) {
          return 100000;
        }

        const evalScore = minimaxEval(
          tempBoard,
          remainingPieces,
          null,
          'selecting',
          depth - 1,
          alpha,
          beta,
          true, // AI selects next
          advancedRules
        );

        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }

      return maxEval;
    } else {
      let minEval = Infinity;

      for (const position of emptyPositions) {
        const tempBoard = simulatePlacement(board, position, selectedPiece);

        // Check for immediate loss (including 2x2 squares if advancedRules)
        if (hasQuarto(tempBoard, advancedRules)) {
          return -100000;
        }

        const evalScore = minimaxEval(
          tempBoard,
          remainingPieces,
          null,
          'selecting',
          depth - 1,
          alpha,
          beta,
          false, // Opponent selects next
          advancedRules
        );

        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }

      return minEval;
    }
  }
}

/**
 * Creates a new board with a piece placed at the given position.
 */
function simulatePlacement(board: Board, position: number, pieceId: number): Board {
  return {
    positions: board.positions.map((p, i) => (i === position ? pieceId : p)),
  };
}

/**
 * Gets a random move (for easy difficulty variation).
 */
export function getRandomMove(
  board: Board,
  availablePieces: number[],
  _selectedPiece: number | null,
  phase: 'selecting' | 'placing'
): AIMove {
  if (phase === 'selecting') {
    const randomIndex = Math.floor(Math.random() * availablePieces.length);
    return {
      type: 'select',
      pieceId: availablePieces[randomIndex],
      score: 0,
    };
  } else {
    const emptyPositions = getEmptyPositions(board);
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    return {
      type: 'place',
      position: emptyPositions[randomIndex],
      score: 0,
    };
  }
}

/**
 * Blends AI move with random move based on difficulty.
 * Easy: 60% random, Medium: 20% random, Hard: 0% random
 */
export function getAIMoveWithRandomness(
  board: Board,
  availablePieces: number[],
  selectedPiece: number | null,
  phase: 'selecting' | 'placing',
  difficulty: AIDifficulty,
  advancedRules = false
): AIMove {
  const randomChance = {
    easy: 0.6,
    medium: 0.2,
    hard: 0,
  };

  if (Math.random() < randomChance[difficulty]) {
    return getRandomMove(board, availablePieces, selectedPiece, phase);
  }

  return getAIMove(board, availablePieces, selectedPiece, phase, difficulty, advancedRules);
}
