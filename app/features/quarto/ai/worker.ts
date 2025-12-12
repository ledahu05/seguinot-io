/**
 * Web Worker wrapper for AI computation.
 * Runs minimax algorithm off the main thread to prevent UI blocking.
 */

import type { Board, AIDifficulty } from '../types/quarto.types';
import type { AIMove } from './minimax';
import { getAIMoveWithRandomness } from './minimax';

// Message types for worker communication
export interface AIWorkerRequest {
  type: 'compute';
  board: Board;
  availablePieces: number[];
  selectedPiece: number | null;
  phase: 'selecting' | 'placing';
  difficulty: AIDifficulty;
  advancedRules?: boolean;
}

export interface AIWorkerResponse {
  type: 'result' | 'error';
  move?: AIMove;
  error?: string;
}

/**
 * Worker message handler.
 * In a real Web Worker environment, this would be the onmessage handler.
 */
export function handleWorkerMessage(request: AIWorkerRequest): AIWorkerResponse {
  try {
    const move = getAIMoveWithRandomness(
      request.board,
      request.availablePieces,
      request.selectedPiece,
      request.phase,
      request.difficulty,
      request.advancedRules ?? false
    );

    return {
      type: 'result',
      move,
    };
  } catch (error) {
    return {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Simulates async AI computation.
 * Uses setTimeout to run computation in a non-blocking way.
 * In production, this could be replaced with actual Web Worker.
 */
export function computeAIMoveAsync(
  board: Board,
  availablePieces: number[],
  selectedPiece: number | null,
  phase: 'selecting' | 'placing',
  difficulty: AIDifficulty,
  minDelay: number = 500,
  advancedRules = false
): Promise<AIMove> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    // Use setTimeout to allow UI to remain responsive
    setTimeout(() => {
      try {
        const move = getAIMoveWithRandomness(
          board,
          availablePieces,
          selectedPiece,
          phase,
          difficulty,
          advancedRules
        );

        // Ensure minimum delay for better UX
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsed);

        setTimeout(() => resolve(move), remainingDelay);
      } catch (error) {
        console.error('[worker] Error computing move:', error);
        reject(error);
      }
    }, 0);
  });
}

/**
 * AI computation with timeout.
 * Prevents infinite computation on complex board states.
 */
export function computeAIMoveWithTimeout(
  board: Board,
  availablePieces: number[],
  selectedPiece: number | null,
  phase: 'selecting' | 'placing',
  difficulty: AIDifficulty,
  timeout: number = 5000
): Promise<AIMove> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('AI computation timed out'));
    }, timeout);

    computeAIMoveAsync(board, availablePieces, selectedPiece, phase, difficulty)
      .then(move => {
        clearTimeout(timeoutId);
        resolve(move);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Gets appropriate minimum delay based on difficulty.
 * Harder difficulties have shorter "thinking" time to feel more confident.
 */
export function getAIDelayForDifficulty(difficulty: AIDifficulty): number {
  const delays: Record<AIDifficulty, number> = {
    easy: 800,
    medium: 600,
    hard: 400,
  };
  return delays[difficulty];
}
