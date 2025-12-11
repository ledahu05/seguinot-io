import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import type { Board, AIDifficulty } from '../types/quarto.types';
import { setAIThinking, applyAIMove } from '../store/quartoSlice';
import { computeAIMoveAsync, getAIDelayForDifficulty } from '../ai/worker';

interface UseAIProps {
  enabled: boolean;
  isAITurn: boolean;
  board: Board | null;
  availablePieces: number[];
  selectedPiece: number | null;
  phase: 'selecting' | 'placing' | null;
  difficulty: AIDifficulty;
  gameStatus: 'playing' | 'finished' | 'waiting' | null;
}

interface UseAIReturn {
  isComputing: boolean;
  triggerAIMove: () => void;
}

/**
 * Hook for managing AI opponent behavior.
 * Automatically triggers AI moves when it's the AI's turn.
 */
export function useAI({
  enabled,
  isAITurn,
  board,
  availablePieces,
  selectedPiece,
  phase,
  difficulty,
  gameStatus,
}: UseAIProps): UseAIReturn {
  const dispatch = useDispatch<AppDispatch>();
  const isComputingRef = useRef(false);
  const abortRef = useRef(false);

  const triggerAIMove = useCallback(async () => {
    // Reset abort flag at the very start of each new attempt
    // This ensures previous cleanup doesn't block new moves
    abortRef.current = false;

    if (!enabled || !isAITurn || !board || !phase || gameStatus !== 'playing') {
      return;
    }

    if (isComputingRef.current) {
      return;
    }

    isComputingRef.current = true;
    dispatch(setAIThinking(true));

    try {
      // Get delay based on difficulty
      const minDelay = getAIDelayForDifficulty(difficulty);

      // Compute the AI's move
      const move = await computeAIMoveAsync(
        board,
        availablePieces,
        selectedPiece,
        phase,
        difficulty,
        minDelay
      );

      // Check if we should abort (game state changed)
      if (abortRef.current) {
        return;
      }

      // Apply the move - win detection now happens automatically in the reducer
      if (move.type === 'select' && move.pieceId !== undefined) {
        dispatch(applyAIMove({ type: 'select', pieceId: move.pieceId }));
      } else if (move.type === 'place' && move.position !== undefined) {
        dispatch(applyAIMove({ type: 'place', position: move.position }));
      }
    } catch (error) {
      console.error('[useAI] AI move computation failed:', error);
    } finally {
      isComputingRef.current = false;
      dispatch(setAIThinking(false));
    }
  }, [
    enabled,
    isAITurn,
    board,
    availablePieces,
    selectedPiece,
    phase,
    difficulty,
    gameStatus,
    dispatch,
  ]);

  // Automatically trigger AI move when it's AI's turn
  useEffect(() => {
    if (enabled && isAITurn && gameStatus === 'playing' && !isComputingRef.current) {
      // Small delay before AI starts thinking (feels more natural)
      const timer = setTimeout(() => {
        triggerAIMove();
      }, 200);

      return () => {
        clearTimeout(timer);
        // Only set abort if we haven't started computing yet
        // Once computing starts, we let it finish
        if (!isComputingRef.current) {
          abortRef.current = true;
        }
      };
    }
  }, [enabled, isAITurn, phase, gameStatus, triggerAIMove]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  return {
    isComputing: isComputingRef.current,
    triggerAIMove,
  };
}

export default useAI;
