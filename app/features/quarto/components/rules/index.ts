/**
 * Barrel exports for Rules Page components
 * @module features/quarto/components/rules
 */

// Components (will be added as implemented)
export { RulesPage } from './RulesPage';
export { PieceGrid } from './PieceGrid';
export { PieceTooltip } from './PieceTooltip';
export { TurnAnimation, TurnAnimationStatic } from './TurnAnimation';
export { ExampleBoard } from './ExampleBoard';
export { BoardWithOverlays } from './BoardWithOverlays';

// Types
export type {
  ExampleBoardConfig,
  RulesSection,
  TurnAnimationStep,
  WinningLineConfig,
  Player,
  TurnPhase,
  SharedAttribute,
  WinningLineCategory,
} from './data/types';

// Data
export { WINNING_LINES_CONFIG } from './data/winningLines';
export { EXAMPLE_BOARDS } from './data/exampleBoards';
export { TURN_ANIMATION_STEPS } from './data/turnAnimationSteps';
export { RULES_SECTIONS } from './data/sections';
