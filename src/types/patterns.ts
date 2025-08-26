import type { Index5 } from './index';
/**
 * Row/column position on the bingo card.
 */
export interface Position {
  row: Index5;
  col: Index5;
}

/**
 * Represents a winning pattern.
 */
export interface WinningPattern {
  /** Type of pattern (row, column, diagonal, etc.) */
  type: WinningPatternType;
  /** Array of positions that must be marked */
  positions: Position[];
  /** Human-readable name for the pattern */
  name: string;
}

/**
 * Defines all possible winning patterns for the game.
 */
export type PatternDefinition = WinningPattern[];

// Utility types for pattern validation
export type PatternValidator = (card: BingoCard) => boolean;

// Import enums for type references
import type { WinningPatternType } from './enums';
import type { BingoCard } from './bingo';
