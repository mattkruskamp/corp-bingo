// Export createEmptyGrid for test usage
export function createEmptyGrid(): Grid5x5 {
  return createGridWithMarkedSpaces([]);
}
import type { BingoCard, BingoSpace } from '../types/bingo';
import type { WinningPattern, PatternDefinition, Position } from '../types/patterns';
import { winningPatterns } from '../data/winningPatterns';
import { createFreeSpace, createBingoSpace } from './cardHelpers';
import type { Grid5x5 } from '../types/index';

export function createGridWithMarkedSpaces(markedPositions: Position[]): Grid5x5 {
  const grid: BingoSpace[][] = [];
  for (let row = 0; row < 5; row++) {
    const rowArr: BingoSpace[] = [];
    for (let col = 0; col < 5; col++) {
      const r = row as import('../types/index').Index5;
      const c = col as import('../types/index').Index5;
      if (r === 2 && c === 2) {
        rowArr.push(createFreeSpace(r, c));
      } else {
        const marked = markedPositions.some((pos) => pos.row === r && pos.col === c);
        const space = createBingoSpace(`Space ${r},${c}`, r, c);
        if (marked) space.marked = true;
        rowArr.push(space);
      }
    }
    grid.push(rowArr);
  }
  return grid as Grid5x5;
}

export function markPattern(pattern: PatternDefinition): Grid5x5 {
  // PatternDefinition is WinningPattern[]
  // Use the first pattern for test purposes
  return createGridWithMarkedSpaces(pattern[0].positions);
}

export function createTestCard(pattern?: PatternDefinition): BingoCard {
  const grid = pattern ? markPattern(pattern) : createGridWithMarkedSpaces([]);
  return {
    id: 'test-card',
    grid,
    createdAt: Date.now(),
  };
}

export function createRowWinScenario(rowIndex: number): Grid5x5 {
  const positions = Array.from({ length: 5 }, (_, col) => ({
    row: rowIndex as import('../types/index').Index5,
    col: col as import('../types/index').Index5,
  }));
  return createGridWithMarkedSpaces(positions);
}

export function createColumnWinScenario(colIndex: number): Grid5x5 {
  const positions = Array.from({ length: 5 }, (_, row) => ({
    row: row as import('../types/index').Index5,
    col: colIndex as import('../types/index').Index5,
  }));
  return createGridWithMarkedSpaces(positions);
}

export function createDiagonalWinScenario(type: 'main' | 'anti'): Grid5x5 {
  const positions =
    type === 'main'
      ? Array.from({ length: 5 }, (__, i) => ({
          row: i as import('../types/index').Index5,
          col: i as import('../types/index').Index5,
        }))
      : Array.from({ length: 5 }, (__, i) => ({
          row: i as import('../types/index').Index5,
          col: (4 - i) as import('../types/index').Index5,
        }));
  return createGridWithMarkedSpaces(positions);
}

export function createCornersWinScenario(): Grid5x5 {
  const positions = [
    { row: 0 as import('../types/index').Index5, col: 0 as import('../types/index').Index5 },
    { row: 0 as import('../types/index').Index5, col: 4 as import('../types/index').Index5 },
    { row: 4 as import('../types/index').Index5, col: 0 as import('../types/index').Index5 },
    { row: 4 as import('../types/index').Index5, col: 4 as import('../types/index').Index5 },
  ];
  return createGridWithMarkedSpaces(positions);
}

export function createNearWinScenario(pattern: PatternDefinition): Grid5x5 {
  // Use the first pattern for test purposes
  const positions = pattern[0].positions.slice(0, 4); // Only 4 out of 5 marked
  return createGridWithMarkedSpaces(positions);
}

export function createMultiplePatternScenario(): Grid5x5 {
  // Mark row 0 and column 0
  const rowPositions = Array.from({ length: 5 }, (_, col) => ({
    row: 0 as import('../types/index').Index5,
    col: col as import('../types/index').Index5,
  }));
  const colPositions = Array.from({ length: 5 }, (_, row) => ({
    row: row as import('../types/index').Index5,
    col: 0 as import('../types/index').Index5,
  }));
  return createGridWithMarkedSpaces([...rowPositions, ...colPositions]);
}
