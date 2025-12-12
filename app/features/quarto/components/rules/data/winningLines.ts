/**
 * Winning line configurations for board overlay visualization
 * @module features/quarto/components/rules/data/winningLines
 */

import type { WinningLineConfig } from './types';

/**
 * SVG viewBox is 100x100 units, board cells are at positions:
 * Row 0: y=12.5, Row 1: y=37.5, Row 2: y=62.5, Row 3: y=87.5
 * Col 0: x=12.5, Col 1: x=37.5, Col 2: x=62.5, Col 3: x=87.5
 */

export const WINNING_LINES_CONFIG: WinningLineConfig[] = [
  // Rows (horizontal)
  {
    id: 'row-0',
    name: 'Row 1',
    category: 'row',
    positions: [0, 1, 2, 3],
    svgPath: 'M 5 12.5 L 95 12.5',
  },
  {
    id: 'row-1',
    name: 'Row 2',
    category: 'row',
    positions: [4, 5, 6, 7],
    svgPath: 'M 5 37.5 L 95 37.5',
  },
  {
    id: 'row-2',
    name: 'Row 3',
    category: 'row',
    positions: [8, 9, 10, 11],
    svgPath: 'M 5 62.5 L 95 62.5',
  },
  {
    id: 'row-3',
    name: 'Row 4',
    category: 'row',
    positions: [12, 13, 14, 15],
    svgPath: 'M 5 87.5 L 95 87.5',
  },

  // Columns (vertical)
  {
    id: 'col-0',
    name: 'Column 1',
    category: 'column',
    positions: [0, 4, 8, 12],
    svgPath: 'M 12.5 5 L 12.5 95',
  },
  {
    id: 'col-1',
    name: 'Column 2',
    category: 'column',
    positions: [1, 5, 9, 13],
    svgPath: 'M 37.5 5 L 37.5 95',
  },
  {
    id: 'col-2',
    name: 'Column 3',
    category: 'column',
    positions: [2, 6, 10, 14],
    svgPath: 'M 62.5 5 L 62.5 95',
  },
  {
    id: 'col-3',
    name: 'Column 4',
    category: 'column',
    positions: [3, 7, 11, 15],
    svgPath: 'M 87.5 5 L 87.5 95',
  },

  // Diagonals
  {
    id: 'diag-main',
    name: 'Main Diagonal',
    category: 'diagonal',
    positions: [0, 5, 10, 15],
    svgPath: 'M 5 5 L 95 95',
  },
  {
    id: 'diag-anti',
    name: 'Anti Diagonal',
    category: 'diagonal',
    positions: [3, 6, 9, 12],
    svgPath: 'M 95 5 L 5 95',
  },
];

/**
 * 2x2 Square winning configurations for advanced rules overlay
 * SVG viewBox is 100x100 units
 * Each square is a rectangle around 4 adjacent cells
 */
export const WINNING_SQUARES_CONFIG: WinningLineConfig[] = [
  // Row 0-1 squares
  {
    id: 'sq-00',
    name: 'Square 1',
    category: 'square',
    positions: [0, 1, 4, 5],
    svgPath: 'M 2 2 L 48 2 L 48 48 L 2 48 Z',
  },
  {
    id: 'sq-01',
    name: 'Square 2',
    category: 'square',
    positions: [1, 2, 5, 6],
    svgPath: 'M 27 2 L 73 2 L 73 48 L 27 48 Z',
  },
  {
    id: 'sq-02',
    name: 'Square 3',
    category: 'square',
    positions: [2, 3, 6, 7],
    svgPath: 'M 52 2 L 98 2 L 98 48 L 52 48 Z',
  },
  // Row 1-2 squares
  {
    id: 'sq-10',
    name: 'Square 4',
    category: 'square',
    positions: [4, 5, 8, 9],
    svgPath: 'M 2 27 L 48 27 L 48 73 L 2 73 Z',
  },
  {
    id: 'sq-11',
    name: 'Square 5',
    category: 'square',
    positions: [5, 6, 9, 10],
    svgPath: 'M 27 27 L 73 27 L 73 73 L 27 73 Z',
  },
  {
    id: 'sq-12',
    name: 'Square 6',
    category: 'square',
    positions: [6, 7, 10, 11],
    svgPath: 'M 52 27 L 98 27 L 98 73 L 52 73 Z',
  },
  // Row 2-3 squares
  {
    id: 'sq-20',
    name: 'Square 7',
    category: 'square',
    positions: [8, 9, 12, 13],
    svgPath: 'M 2 52 L 48 52 L 48 98 L 2 98 Z',
  },
  {
    id: 'sq-21',
    name: 'Square 8',
    category: 'square',
    positions: [9, 10, 13, 14],
    svgPath: 'M 27 52 L 73 52 L 73 98 L 27 98 Z',
  },
  {
    id: 'sq-22',
    name: 'Square 9',
    category: 'square',
    positions: [10, 11, 14, 15],
    svgPath: 'M 52 52 L 98 52 L 98 98 L 52 98 Z',
  },
];
