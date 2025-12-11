import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import {
  selectAnimationState,
  selectIsAnimationPlaying,
  selectAnimationType,
  selectWinningPositions,
  animationComplete,
} from '../store/quartoSlice';

export interface UseWinAnimationReturn {
  isAnimationPlaying: boolean;
  animationType: 'firework' | 'defeat' | null;
  duration: number;
  winningPositions: number[];
  handleAnimationComplete: () => void;
}

export function useWinAnimation(): UseWinAnimationReturn {
  const dispatch = useDispatch<AppDispatch>();
  const animation = useSelector(selectAnimationState);
  const isAnimationPlaying = useSelector(selectIsAnimationPlaying);
  const animationType = useSelector(selectAnimationType);
  const winningPositions = useSelector(selectWinningPositions);

  const handleAnimationComplete = useCallback(() => {
    dispatch(animationComplete());
  }, [dispatch]);

  // Auto-complete animation after duration
  useEffect(() => {
    if (animation.status !== 'playing') return;

    const timeout = setTimeout(() => {
      dispatch(animationComplete());
    }, animation.duration);

    return () => clearTimeout(timeout);
  }, [animation.status, animation.duration, dispatch]);

  return {
    isAnimationPlaying,
    animationType,
    duration: animation.duration,
    winningPositions,
    handleAnimationComplete,
  };
}
