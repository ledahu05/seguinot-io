import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import type { Board, AIDifficulty } from '../types/quarto.types';
import { setAIThinking, applyAIMove, callQuarto } from '../store/quartoSlice';
import { computeAIMoveAsync, getAIDelayForDifficulty } from '../ai/worker';
import { hasQuarto } from '../utils/winDetection';

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
    if (!enabled || !isAITurn || !board || !phase || gameStatus !== 'playing') {
      return;
    }

    if (isComputingRef.current) {
      return;
    }

    isComputingRef.current = true;
    abortRef.current = false;
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

      // Apply the move
      if (move.type === 'select' && move.pieceId !== undefined) {
        dispatch(applyAIMove({ type: 'select', pieceId: move.pieceId }));
      } else if (move.type === 'place' && move.position !== undefined) {
        dispatch(applyAIMove({ type: 'place', position: move.position }));

        // After placing, check if AI should call Quarto
        // Create temporary board to check
        const tempPositions = [...board.positions];
        tempPositions[move.position] = selectedPiece!;
        const tempBoard: Board = { positions: tempPositions };

        if (hasQuarto(tempBoard)) {
          // Small delay before calling Quarto for dramatic effect
          setTimeout(() => {
            if (!abortRef.current) {
              dispatch(callQuarto());
            }
          }, 300);
        }
      }
    } catch (error) {
      console.error('AI move computation failed:', error);
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
        abortRef.current = true;
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
