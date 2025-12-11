import { useEffect, useCallback, useState } from 'react';
import type { Piece } from '../types/quarto.types';

interface UseKeyboardNavigationProps {
  availablePieces: Piece[];
  phase: 'selecting' | 'placing' | null;
  disabled: boolean;
  onSelectPiece: (pieceId: number) => void;
  onPlacePiece: (position: number) => void;
  board: (number | null)[];
}

interface UseKeyboardNavigationReturn {
  focusedPieceIndex: number | null;
  focusedBoardPosition: number | null;
  isKeyboardActive: boolean;
}

export function useKeyboardNavigation({
  availablePieces,
  phase,
  disabled,
  onSelectPiece,
  onPlacePiece,
  board,
}: UseKeyboardNavigationProps): UseKeyboardNavigationReturn {
  const [focusedPieceIndex, setFocusedPieceIndex] = useState<number | null>(null);
  const [focusedBoardPosition, setFocusedBoardPosition] = useState<number | null>(null);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  // Get empty board positions for navigation
  const getEmptyPositions = useCallback(() => {
    return board
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);
  }, [board]);

  // Navigate in a 4x4 grid
  const navigateGrid = useCallback(
    (currentPos: number, direction: 'up' | 'down' | 'left' | 'right'): number => {
      const row = Math.floor(currentPos / 4);
      const col = currentPos % 4;

      let newRow = row;
      let newCol = col;

      switch (direction) {
        case 'up':
          newRow = Math.max(0, row - 1);
          break;
        case 'down':
          newRow = Math.min(3, row + 1);
          break;
        case 'left':
          newCol = Math.max(0, col - 1);
          break;
        case 'right':
          newCol = Math.min(3, col + 1);
          break;
      }

      return newRow * 4 + newCol;
    },
    []
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      // Activate keyboard mode on any navigation key
      if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(event.key)) {
        setIsKeyboardActive(true);
      }

      // Selecting phase - navigate pieces
      if (phase === 'selecting') {
        const pieceCount = availablePieces.length;
        if (pieceCount === 0) return;

        switch (event.key) {
          case 'Tab':
            event.preventDefault();
            if (event.shiftKey) {
              // Previous piece
              setFocusedPieceIndex((prev) =>
                prev === null || prev === 0 ? pieceCount - 1 : prev - 1
              );
            } else {
              // Next piece
              setFocusedPieceIndex((prev) =>
                prev === null || prev === pieceCount - 1 ? 0 : prev + 1
              );
            }
            break;

          case 'ArrowRight':
            event.preventDefault();
            setFocusedPieceIndex((prev) => {
              if (prev === null) return 0;
              // Move right in 4-piece rows
              const nextIndex = prev + 1;
              return nextIndex < pieceCount ? nextIndex : prev;
            });
            break;

          case 'ArrowLeft':
            event.preventDefault();
            setFocusedPieceIndex((prev) => {
              if (prev === null) return 0;
              return prev > 0 ? prev - 1 : prev;
            });
            break;

          case 'ArrowDown':
            event.preventDefault();
            setFocusedPieceIndex((prev) => {
              if (prev === null) return 0;
              // Move down by 4 (one row)
              const nextIndex = prev + 4;
              return nextIndex < pieceCount ? nextIndex : prev;
            });
            break;

          case 'ArrowUp':
            event.preventDefault();
            setFocusedPieceIndex((prev) => {
              if (prev === null) return 0;
              // Move up by 4 (one row)
              return prev >= 4 ? prev - 4 : prev;
            });
            break;

          case 'Enter':
          case ' ':
            event.preventDefault();
            if (focusedPieceIndex !== null && availablePieces[focusedPieceIndex]) {
              onSelectPiece(availablePieces[focusedPieceIndex].id);
              // Reset focus for placing phase
              setFocusedPieceIndex(null);
              setFocusedBoardPosition(null);
            }
            break;
        }
      }

      // Placing phase - navigate board
      if (phase === 'placing') {
        const emptyPositions = getEmptyPositions();
        if (emptyPositions.length === 0) return;

        switch (event.key) {
          case 'Tab':
            event.preventDefault();
            if (event.shiftKey) {
              // Previous empty position
              setFocusedBoardPosition((prev) => {
                if (prev === null) return emptyPositions[emptyPositions.length - 1];
                const currentIdx = emptyPositions.indexOf(prev);
                if (currentIdx === -1 || currentIdx === 0) {
                  return emptyPositions[emptyPositions.length - 1];
                }
                return emptyPositions[currentIdx - 1];
              });
            } else {
              // Next empty position
              setFocusedBoardPosition((prev) => {
                if (prev === null) return emptyPositions[0];
                const currentIdx = emptyPositions.indexOf(prev);
                if (currentIdx === -1 || currentIdx === emptyPositions.length - 1) {
                  return emptyPositions[0];
                }
                return emptyPositions[currentIdx + 1];
              });
            }
            break;

          case 'ArrowRight':
          case 'ArrowLeft':
          case 'ArrowUp':
          case 'ArrowDown':
            event.preventDefault();
            setFocusedBoardPosition((prev) => {
              const currentPos = prev ?? 0;
              const direction = event.key.replace('Arrow', '').toLowerCase() as
                | 'up'
                | 'down'
                | 'left'
                | 'right';
              return navigateGrid(currentPos, direction);
            });
            break;

          case 'Enter':
          case ' ':
            event.preventDefault();
            if (focusedBoardPosition !== null && board[focusedBoardPosition] === null) {
              onPlacePiece(focusedBoardPosition);
              // Reset focus for next selecting phase
              setFocusedBoardPosition(null);
              setFocusedPieceIndex(null);
            }
            break;
        }
      }
    },
    [
      disabled,
      phase,
      availablePieces,
      focusedPieceIndex,
      focusedBoardPosition,
      board,
      onSelectPiece,
      onPlacePiece,
      getEmptyPositions,
      navigateGrid,
    ]
  );

  // Deactivate keyboard mode on mouse click
  const handleMouseDown = useCallback(() => {
    setIsKeyboardActive(false);
    setFocusedPieceIndex(null);
    setFocusedBoardPosition(null);
  }, []);

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);

  // Reset focus when phase changes
  useEffect(() => {
    if (phase === 'selecting') {
      setFocusedBoardPosition(null);
    } else if (phase === 'placing') {
      setFocusedPieceIndex(null);
    }
  }, [phase]);

  return {
    focusedPieceIndex,
    focusedBoardPosition,
    isKeyboardActive,
  };
}

export default useKeyboardNavigation;
