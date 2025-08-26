import type { PatternDefinition, WinningPattern, Position } from '../types/patterns';
import { WinningPatternType } from '../types/enums';

// Helper to create row/column patterns
const makeRow = (row: number): Position[] =>
  Array.from({ length: 5 }, (_, col) => ({
    row: row as import('../types/index').Index5,
    col: col as import('../types/index').Index5,
  }));
const makeCol = (col: number): Position[] =>
  Array.from({ length: 5 }, (_, row) => ({
    row: row as import('../types/index').Index5,
    col: col as import('../types/index').Index5,
  }));

export const winningPatterns: PatternDefinition = [
  // Rows
  ...Array.from({ length: 5 }, (_, i) => ({
    type: WinningPatternType.ROW,
    positions: makeRow(i),
    name: `Row ${i + 1}`,
  })),
  // Columns
  ...Array.from({ length: 5 }, (_, i) => ({
    type: WinningPatternType.COLUMN,
    positions: makeCol(i),
    name: `Column ${i + 1}`,
  })),
  // Main diagonal
  {
    type: WinningPatternType.DIAGONAL,
    positions: Array.from({ length: 5 }, (__, i) => ({
      row: i as import('../types/index').Index5,
      col: i as import('../types/index').Index5,
    })),
    name: 'Main Diagonal',
  },
  // Anti-diagonal
  {
    type: WinningPatternType.DIAGONAL,
    positions: Array.from({ length: 5 }, (__, i) => ({
      row: i as import('../types/index').Index5,
      col: (4 - i) as import('../types/index').Index5,
    })),
    name: 'Anti Diagonal',
  },
  // Corners
  {
    type: WinningPatternType.CORNERS,
    positions: [
      { row: 0 as import('../types/index').Index5, col: 0 as import('../types/index').Index5 },
      { row: 0 as import('../types/index').Index5, col: 4 as import('../types/index').Index5 },
      { row: 4 as import('../types/index').Index5, col: 0 as import('../types/index').Index5 },
      { row: 4 as import('../types/index').Index5, col: 4 as import('../types/index').Index5 },
    ],
    name: 'Corners',
  },
];
