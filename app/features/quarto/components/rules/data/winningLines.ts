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
