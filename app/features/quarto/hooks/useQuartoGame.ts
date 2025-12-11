import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import type { AIDifficulty } from '../types/quarto.types';
import {
  startLocalGame,
  startAIGame,
  resetGame,
  selectPiece,
  placePiece,
  setHoveredPosition,
  setError,
  selectGame,
  selectUI,
  selectBoard,
  selectCurrentPlayer,
  selectAvailablePieces,
  selectSelectedPiece,
  selectWinningLines,
  selectIsGameOver,
  selectWinner,
  selectWinnerPlayer,
  selectGamePhase,
  selectGameStatus,
  selectIsAIThinking,
  selectError,
} from '../store';

export function useQuartoGame() {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const game = useSelector(selectGame);
  const ui = useSelector(selectUI);
  const board = useSelector(selectBoard);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const availablePieces = useSelector(selectAvailablePieces);
  const selectedPiece = useSelector(selectSelectedPiece);
  const winningLines = useSelector(selectWinningLines);
  const isGameOver = useSelector(selectIsGameOver);
  const winner = useSelector(selectWinner);
  const winnerPlayer = useSelector(selectWinnerPlayer);
  const phase = useSelector(selectGamePhase);
  const status = useSelector(selectGameStatus);
  const isAIThinking = useSelector(selectIsAIThinking);
  const error = useSelector(selectError);

  // Derived state
  const isDraw = winner === 'draw';
  const isPlaying = status === 'playing';
  const isWaiting = status === 'waiting';
  const winningPositions = winningLines.length > 0 ? winningLines[0].positions : null;

  // Get piece description for display
  const selectedPieceDescription = useMemo(() => {
    if (!selectedPiece) return undefined;
    const attrs = [
      selectedPiece.color,
      selectedPiece.shape,
      selectedPiece.top,
      selectedPiece.height,
    ];
    return attrs.join(', ');
  }, [selectedPiece]);

  // Actions
  const handleStartLocalGame = useCallback(
    (player1Name: string, player2Name: string) => {
      dispatch(startLocalGame({ player1Name, player2Name }));
    },
    [dispatch]
  );

  const handleStartAIGame = useCallback(
    (playerName: string, difficulty: AIDifficulty, playerGoesFirst: boolean) => {
      dispatch(startAIGame({ playerName, difficulty, playerGoesFirst }));
    },
    [dispatch]
  );

  const handleResetGame = useCallback(() => {
    dispatch(resetGame());
  }, [dispatch]);

  const handleSelectPiece = useCallback(
    (pieceId: number) => {
      if (!isPlaying || phase !== 'selecting') return;
      dispatch(selectPiece({ pieceId }));
    },
    [dispatch, isPlaying, phase]
  );

  const handlePlacePiece = useCallback(
    (position: number) => {
      if (!isPlaying || phase !== 'placing') return;
      dispatch(placePiece({ position }));
    },
    [dispatch, isPlaying, phase]
  );

  const handleHoverPosition = useCallback(
    (position: number | null) => {
      dispatch(setHoveredPosition(position));
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    // State
    game,
    board,
    currentPlayer,
    availablePieces,
    selectedPiece,
    selectedPieceDescription,
    winningPositions,
    isGameOver,
    isDraw,
    winner,
    winnerPlayer,
    phase,
    status,
    isPlaying,
    isWaiting,
    isAIThinking,
    error,
    hoveredPosition: ui.hoveredPosition,
    selectedPosition: ui.selectedPosition,

    // Actions
    startLocalGame: handleStartLocalGame,
    startAIGame: handleStartAIGame,
    resetGame: handleResetGame,
    selectPiece: handleSelectPiece,
    placePiece: handlePlacePiece,
    hoverPosition: handleHoverPosition,
    clearError: handleClearError,
  };
}

export default useQuartoGame;
