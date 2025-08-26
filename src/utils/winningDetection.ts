import { winningPatterns } from '../data/winningPatterns';
import { getSpaceAt } from './cardHelpers';
import type { Grid5x5 } from '../types/index';
import type { WinningPattern, PatternDefinition, Position } from '../types/patterns';

/**
 * Checks if a given winning pattern is complete (all positions marked).
 * @param pattern The pattern definition to check
 * @param grid The bingo grid to evaluate
 * @returns True if all positions in the pattern are marked
 */
export function isPatternComplete(pattern: WinningPattern, grid: Grid5x5): boolean {
  return pattern.positions.every((pos: Position) => {
    const space = getSpaceAt(grid, pos.row, pos.col);
    return space && space.marked;
  });
}

/**
 * Evaluates all winning patterns against the current grid state.
 * Returns the first matching pattern found, or null if no patterns match.
 * @param grid The bingo grid to evaluate
 * @returns The WinningPattern object if a win is detected, otherwise null
 */
export function checkWinningPatterns(grid: Grid5x5): WinningPattern | null {
  for (const pattern of winningPatterns) {
    if (isPatternComplete(pattern, grid)) {
      return pattern;
    }
  }
  return null;
}
