import type { BingoSpace } from '../types/bingo';
import type { Index5 } from '../types/index';
import { SpaceType } from '../types/enums';
import type { Grid5x5 } from '../types/index';
import type { BingoCard } from '../types/bingo';

export function createBingoSpace(phrase: string, row: Index5, col: Index5): BingoSpace {
  return {
    phrase,
    marked: false,
    row,
    col,
    kind: SpaceType.REGULAR,
  };
}

export function createFreeSpace(row: Index5, col: Index5): BingoSpace {
  return {
    phrase: 'FREE',
    marked: true,
    row,
    col,
    kind: SpaceType.FREE,
  };
}

export function getSpaceAt(grid: Grid5x5, row: Index5, col: Index5): BingoSpace {
  return grid[row][col];
}

export function getAllSpaces(grid: Grid5x5): BingoSpace[] {
  return grid.flat();
}

export function getSpacesByType(grid: Grid5x5, type: SpaceType): BingoSpace[] {
  return getAllSpaces(grid).filter((space) => space.kind === type);
}

export function cloneCard(card: BingoCard): BingoCard {
  return {
    id: card.id,
    grid: card.grid.map((row) => row.map((space) => ({ ...space }))) as Grid5x5,
    createdAt: card.createdAt,
  };
}

export function generateCardId(): string {
  return `card_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
