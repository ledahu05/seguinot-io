/**
 * Turn Animation Hook - State machine for turn demo animation
 * @module features/quarto/hooks/useTurnAnimation
 */

import { useState, useCallback } from 'react';
import { TURN_ANIMATION_STEPS } from '../components/rules/data/turnAnimationSteps';
import type { TurnAnimationStep } from '../components/rules/data/types';

export interface TurnAnimationState {
  /** Current step index in the animation sequence */
  currentStepIndex: number;

  /** Total number of steps */
  totalSteps: number;

  /** Current animation step data */
  currentStep: TurnAnimationStep;

  /** Board state: 16-element array, piece IDs or null */
  boardState: (number | null)[];

  /** Currently held piece (being given/placed) */
  heldPiece: number | null;

  /** Piece IDs that have been placed on the board (for dimming in pool) */
  usedPieceIds: number[];

  /** Currently active/selected piece ID */
  activePieceId: number | null;
}

export interface TurnAnimationControls {
  /** Go to next step */
  nextStep: () => void;

  /** Go to previous step */
  previousStep: () => void;

  /** Reset to beginning */
  restart: () => void;

  /** Jump to specific step */
  goToStep: (index: number) => void;
}

/**
 * Calculate board state at a given step index
 */
function calculateBoardState(stepIndex: number): (number | null)[] {
  const board: (number | null)[] = Array(16).fill(null);

  // Apply all placement steps up to and including the current index
  for (let i = 0; i <= stepIndex; i++) {
    const step = TURN_ANIMATION_STEPS[i];
    if (step.phase === 'place' && step.position !== null) {
      board[step.position] = step.pieceId;
    }
  }

  return board;
}

/**
 * Calculate held piece at a given step (piece being received or placed)
 */
function calculateHeldPiece(stepIndex: number): number | null {
  const step = TURN_ANIMATION_STEPS[stepIndex];

  // During 'receive' or 'place' phase, the piece is being held
  if (step.phase === 'receive' || step.phase === 'place') {
    return step.pieceId;
  }

  // During 'select' phase, no piece is held yet
  return null;
}

/**
 * Calculate which pieces have been used (placed on board) up to current step
 */
function calculateUsedPieceIds(stepIndex: number): number[] {
  const usedIds: number[] = [];

  // Collect all pieces that were placed in previous steps (not current)
  for (let i = 0; i < stepIndex; i++) {
    const step = TURN_ANIMATION_STEPS[i];
    if (step.phase === 'place' && !usedIds.includes(step.pieceId)) {
      usedIds.push(step.pieceId);
    }
  }

  return usedIds;
}

/**
 * Get the currently active piece ID (being selected or placed)
 */
function calculateActivePieceId(stepIndex: number): number | null {
  const step = TURN_ANIMATION_STEPS[stepIndex];
  return step.pieceId;
}

/**
 * Hook for managing turn animation state (manual step-through)
 */
export function useTurnAnimation(): TurnAnimationState & TurnAnimationControls {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const totalSteps = TURN_ANIMATION_STEPS.length;
  const currentStep = TURN_ANIMATION_STEPS[currentStepIndex];
  const boardState = calculateBoardState(currentStepIndex);
  const heldPiece = calculateHeldPiece(currentStepIndex);
  const usedPieceIds = calculateUsedPieceIds(currentStepIndex);
  const activePieceId = calculateActivePieceId(currentStepIndex);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TURN_ANIMATION_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  const restart = useCallback(() => {
    setCurrentStepIndex(0);
  }, []);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < TURN_ANIMATION_STEPS.length) {
      setCurrentStepIndex(index);
    }
  }, []);

  return {
    currentStepIndex,
    totalSteps,
    currentStep,
    boardState,
    heldPiece,
    usedPieceIds,
    activePieceId,
    nextStep,
    previousStep,
    restart,
    goToStep,
  };
}

export default useTurnAnimation;
