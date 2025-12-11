/**
 * Type definitions for Rules Page components
 * @module features/quarto/components/rules/data/types
 */

import type { Piece } from '../../../types/quarto.types';

// Re-export Piece for convenience
export type { Piece };

/**
 * Player identifier for turn animation
 */
export type Player = 'A' | 'B';

/**
 * Phase within a single turn
 */
export type TurnPhase = 'give' | 'receive' | 'place' | 'select';

/**
 * Represents a step in the turn demonstration animation
 */
export interface TurnAnimationStep {
  /** Which player is active */
  activePlayer: Player;

  /** Current phase of the turn */
  phase: TurnPhase;

  /** Piece ID involved in this step */
  pieceId: number;

  /** Board position (0-15) for placement, null for selection */
  position: number | null;

  /** Duration of this step in milliseconds */
  duration: number;

  /** Caption text to display */
  caption: string;
}

/**
 * Category of winning line
 */
export type WinningLineCategory = 'row' | 'column' | 'diagonal';

/**
 * Configuration for winning line overlay visualization
 */
export interface WinningLineConfig {
  /** Unique identifier */
  id: string;

  /** Display name (e.g., "Row 1", "Diagonal") */
  name: string;

  /** Category for grouping */
  category: WinningLineCategory;

  /** Board positions that form this line */
  positions: [number, number, number, number];

  /** SVG path data for overlay rendering */
  svgPath: string;
}

/**
 * Shared attribute type for winning conditions
 */
export type SharedAttribute = 'color' | 'shape' | 'top' | 'height';

/**
 * Static configuration for example winning/non-winning boards
 */
export interface ExampleBoardConfig {
  /** Unique identifier for the example */
  id: string;

  /** Display title (e.g., "Clear Win") */
  title: string;

  /** Explanation caption (e.g., "All 4 pieces are SQUARE") */
  caption: string;

  /** Whether this represents a winning configuration */
  isWin: boolean;

  /** The shared attribute if isWin is true */
  sharedAttribute?: SharedAttribute;

  /** Board state: 16-element array, piece IDs (0-15) or null for empty */
  positions: (number | null)[];

  /** Position indices to highlight (the winning line if applicable) */
  highlightLine?: number[];
}

/**
 * Configuration for each section of the rules page
 */
export interface RulesSection {
  /** Section identifier for scroll anchoring */
  id: string;

  /** Section headline */
  title: string;

  /** Section content (static text, supports markdown-like formatting) */
  content: string;

  /** Whether section has interactive elements */
  hasInteractive: boolean;
}
