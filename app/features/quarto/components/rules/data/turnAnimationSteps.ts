/**
 * Turn animation steps for the demo sequence
 * @module features/quarto/components/rules/data/turnAnimationSteps
 *
 * This defines a scripted 4-turn sequence demonstrating:
 * 1. Player A gives piece to Player B
 * 2. Player B places piece on board
 * 3. Player B selects piece for Player A
 * 4. Player A places piece on board
 * ... and so on
 */

import type { TurnAnimationStep } from './types';

/**
 * Animation timing constants (milliseconds)
 */
export const ANIMATION_TIMING = {
  select: 2000,
  receive: 1500,
  place: 1500,
} as const;

/**
 * Complete turn animation sequence
 * Shows 2 full turns to demonstrate the mechanic
 * Each "placement" is broken into receive + place steps
 */
export const TURN_ANIMATION_STEPS: TurnAnimationStep[] = [
  // Turn 1: Player A selects, Player B receives and places
  {
    activePlayer: 'A',
    phase: 'select',
    pieceId: 0,
    position: null,
    duration: ANIMATION_TIMING.select,
    caption: 'Player A is selecting a piece to give to Player B',
  },
  {
    activePlayer: 'B',
    phase: 'receive',
    pieceId: 0,
    position: null,
    duration: ANIMATION_TIMING.receive,
    caption: 'Player B received the piece from Player A',
  },
  {
    activePlayer: 'B',
    phase: 'place',
    pieceId: 0,
    position: 5,
    duration: ANIMATION_TIMING.place,
    caption: 'Player B is placing the piece on the board',
  },
  {
    activePlayer: 'B',
    phase: 'select',
    pieceId: 8,
    position: null,
    duration: ANIMATION_TIMING.select,
    caption: 'Player B is now selecting a piece to give to Player A',
  },

  // Turn 2: Player A receives and places, then selects
  {
    activePlayer: 'A',
    phase: 'receive',
    pieceId: 8,
    position: null,
    duration: ANIMATION_TIMING.receive,
    caption: 'Player A received the piece from Player B',
  },
  {
    activePlayer: 'A',
    phase: 'place',
    pieceId: 8,
    position: 10,
    duration: ANIMATION_TIMING.place,
    caption: 'Player A is placing the piece on the board',
  },
  {
    activePlayer: 'A',
    phase: 'select',
    pieceId: 3,
    position: null,
    duration: ANIMATION_TIMING.select,
    caption: 'Player A is now selecting a piece to give to Player B',
  },

  // Turn 3: Player B receives and places (completing the cycle)
  {
    activePlayer: 'B',
    phase: 'receive',
    pieceId: 3,
    position: null,
    duration: ANIMATION_TIMING.receive,
    caption: 'Player B received the piece from Player A',
  },
  {
    activePlayer: 'B',
    phase: 'place',
    pieceId: 3,
    position: 0,
    duration: ANIMATION_TIMING.place,
    caption: 'Player B is placing the piece on the board',
  },
];

/**
 * Total duration of the full animation sequence
 */
export const TOTAL_ANIMATION_DURATION = TURN_ANIMATION_STEPS.reduce(
  (acc, step) => acc + step.duration,
  0
);
