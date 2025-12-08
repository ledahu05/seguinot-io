// AI module exports
export { evaluateBoard, evaluateLine, evaluatePieceGive, getBestPieceToGive } from './evaluation';
export { getAIMove, getAIMoveWithRandomness, getRandomMove } from './minimax';
export type { AIMove, MinimaxResult } from './minimax';
export { computeAIMoveAsync, computeAIMoveWithTimeout, getAIDelayForDifficulty } from './worker';
export type { AIWorkerRequest, AIWorkerResponse } from './worker';
