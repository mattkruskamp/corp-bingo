import type { BingoCard, BingoSpace } from '../types/bingo';
import type { Grid5x5, Index5 } from '../types/index';
import { SpaceType } from '../types/enums';

export function validateGridStructure(grid: Grid5x5): boolean {
  return grid.length === 5 && grid.every((row) => row.length === 5);
}

export function validateUniqueSpaces(grid: Grid5x5): boolean {
  const phrases = grid
    .flat()
    .filter((s) => s.kind === SpaceType.REGULAR)
    .map((s) => s.phrase);
  const unique = new Set(phrases);
  return phrases.length === unique.size;
}

export function validateFreeSpace(grid: Grid5x5): boolean {
  const center = grid[2][2];
  return center.kind === SpaceType.FREE && center.phrase === 'FREE' && center.marked;
}

export function validateSpacePositions(grid: Grid5x5): boolean {
  return grid.every((row, rIdx) =>
    row.every((space, cIdx) => space.row === rIdx && space.col === cIdx),
  );
}

export function validateBingoCard(card: BingoCard): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!validateGridStructure(card.grid)) errors.push('Grid is not 5x5');
  if (!validateUniqueSpaces(card.grid)) errors.push('Duplicate phrases found');
  if (!validateFreeSpace(card.grid)) errors.push('Center space is not a valid FREE space');
  if (!validateSpacePositions(card.grid)) errors.push('Space positions are incorrect');
  return { valid: errors.length === 0, errors };
}

export function isValidCard(card: BingoCard): boolean {
  return validateBingoCard(card).valid;
}
