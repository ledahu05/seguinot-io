/**
 * Example board configurations for winning/non-winning demonstrations
 * @module features/quarto/components/rules/data/exampleBoards
 *
 * Piece IDs are binary encoded:
 * Bit 0: color (0=light, 1=dark)
 * Bit 1: shape (0=round, 1=square)
 * Bit 2: top (0=solid, 1=hollow)
 * Bit 3: height (0=short, 1=tall)
 *
 * Examples:
 * 0  = light, round, solid, short
 * 1  = dark, round, solid, short
 * 2  = light, square, solid, short
 * 3  = dark, square, solid, short
 * 10 = light, square, hollow, tall
 * 15 = dark, square, hollow, tall
 */

import type { ExampleBoardConfig } from './types';

export const EXAMPLE_BOARDS: ExampleBoardConfig[] = [
  {
    id: 'clear-win-shape',
    title: 'Clear Win',
    caption: 'All 4 pieces are SQUARE - different colors, heights, and tops',
    isWin: true,
    sharedAttribute: 'shape',
    positions: [
      2, 3, 6, 7, // Row 0: all square (bits: x1xx)
      null, null, null, null,
      null, null, null, null,
      null, null, null, null,
    ],
    highlightLine: [0, 1, 2, 3],
  },
  {
    id: 'subtle-win-solid',
    title: 'Subtle Win',
    caption: 'All 4 pieces are SOLID (dome top) - they look different but share one attribute!',
    isWin: true,
    sharedAttribute: 'top',
    positions: [
      0, null, null, null,  // light, round, solid, short
      null, 1, null, null,  // dark, round, solid, short
      null, null, 2, null,  // light, square, solid, short
      null, null, null, 9,  // dark, round, solid, tall
    ],
    highlightLine: [0, 5, 10, 15], // main diagonal
  },
  {
    id: 'near-miss',
    title: 'Not a Win',
    caption: 'Close! 3 pieces are TALL, but the 4th is SHORT - no shared attribute across all 4',
    isWin: false,
    positions: [
      8, 9, 10, 0, // Positions 0-2 are tall, position 3 is short
      null, null, null, null,
      null, null, null, null,
      null, null, null, null,
    ],
    highlightLine: [0, 1, 2, 3],
  },
  {
    id: 'color-win',
    title: 'Color Win',
    caption: 'All 4 pieces are DARK - column wins count too!',
    isWin: true,
    sharedAttribute: 'color',
    positions: [
      1, null, null, null,  // dark, round, solid, short
      3, null, null, null,  // dark, square, solid, short
      5, null, null, null,  // dark, round, hollow, short
      9, null, null, null,  // dark, round, solid, tall
    ],
    highlightLine: [0, 4, 8, 12], // column 0
  },
];

/**
 * Example board configurations for 2x2 square wins (advanced rules)
 */
export const EXAMPLE_SQUARE_BOARDS: ExampleBoardConfig[] = [
  {
    id: 'square-win-height',
    title: '2×2 Square Win',
    caption: 'All 4 pieces in this square are TALL (advanced rules)',
    isWin: true,
    sharedAttribute: 'height',
    positions: [
      8, 9, null, null,   // tall pieces (bit 3 = 1)
      10, 11, null, null, // tall pieces
      null, null, null, null,
      null, null, null, null,
    ],
    highlightLine: [0, 1, 4, 5], // top-left 2x2 square
  },
];
