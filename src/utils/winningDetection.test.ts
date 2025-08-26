import { describe, it, expect } from 'vitest';

import { winningPatterns } from '../data/winningPatterns';
import { checkWinningPatterns } from './winningDetection';
import {
  createRowWinScenario,
  createColumnWinScenario,
  createDiagonalWinScenario,
  createCornersWinScenario,
  createNearWinScenario,
  createMultiplePatternScenario,
  createEmptyGrid,
  createGridWithMarkedSpaces,
} from './testHelpers';

// Row wins
for (let i = 0; i < 5; i++) {
  describe(`Row ${i + 1} win`, () => {
    it(`should detect row ${i + 1} win when all spaces in row ${i + 1} are marked`, () => {
      const grid = createRowWinScenario(i);
      const pattern = checkWinningPatterns(grid);
      expect(pattern).not.toBeNull();
      expect(pattern?.name.toLowerCase()).toContain('row');
    });
  });
}

// Column wins
for (let i = 0; i < 5; i++) {
  describe(`Column ${i + 1} win`, () => {
    it(`should detect column ${i + 1} win when all spaces in column ${i + 1} are marked`, () => {
      const grid = createColumnWinScenario(i);
      const pattern = checkWinningPatterns(grid);
      expect(pattern).not.toBeNull();
      expect(pattern?.name.toLowerCase()).toContain('column');
    });
  });
}

describe('Diagonal wins', () => {
  it('should detect main diagonal win', () => {
    const grid = createDiagonalWinScenario('main');
    const pattern = checkWinningPatterns(grid);
    expect(pattern).not.toBeNull();
    expect(pattern?.name.toLowerCase()).toContain('diagonal');
  });
  it('should detect anti-diagonal win', () => {
    const grid = createDiagonalWinScenario('anti');
    const pattern = checkWinningPatterns(grid);
    expect(pattern).not.toBeNull();
    expect(pattern?.name.toLowerCase()).toContain('diagonal');
  });
});

describe('Corners win', () => {
  it('should detect corners win', () => {
    const grid = createCornersWinScenario();
    const pattern = checkWinningPatterns(grid);
    expect(pattern).not.toBeNull();
    expect(pattern?.name.toLowerCase()).toContain('corner');
  });
});

describe('Edge cases', () => {
  it('should return null for empty grid', () => {
    const grid = createEmptyGrid();
    const pattern = checkWinningPatterns(grid);
    expect(pattern).toBeNull();
  });
  it('should return null for near win (4 out of 5 spaces marked)', () => {
    const patternDef = winningPatterns[0];
    const grid = createNearWinScenario([patternDef]);
    const result = checkWinningPatterns(grid);
    expect(result).toBeNull();
  });
  it('should return null for near win with center included (main diagonal)', () => {
    const mainDiag = winningPatterns.find((p) => p.name.toLowerCase().includes('main diagonal'));
    if (mainDiag) {
      // Mark only 4 out of 5, including center
      const positions = mainDiag.positions.filter((pos) => !(pos.row === 0 && pos.col === 0));
      const grid = createGridWithMarkedSpaces(positions);
      const result = checkWinningPatterns(grid);
      expect(result).toBeNull();
    }
  });
  it('should return first match for multiple patterns', () => {
    const grid = createMultiplePatternScenario();
    const pattern = checkWinningPatterns(grid);
    expect(pattern).not.toBeNull();
  });
});

describe('FREE space handling', () => {
  it('should treat FREE space as marked for patterns that include center', () => {
    const grid = createDiagonalWinScenario('main');
    const pattern = checkWinningPatterns(grid);
    expect(pattern).not.toBeNull();
    expect(pattern?.positions.some((pos) => pos.row === 2 && pos.col === 2)).toBe(true);
  });
});
