import type { SpaceType, GameStatus } from './enums';
import type { WinningPattern } from './patterns';
import type { Index5, Grid5x5 } from './index';
/**
 * Represents a bingo card (5x5 grid).
 */
export interface BingoCard {
  /** Unique card ID */
  id: string;
  /** 5x5 grid of BingoSpace objects */
  grid: Grid5x5;
  /** Timestamp of card creation */
  createdAt: number;
}
/**
 * Represents a single space on a bingo card.
 */
export interface BingoSpace {
  /** The phrase or value displayed in the space */
  phrase: string;
  /** Whether the space is marked */
  marked: boolean;
  /** Row index (0-4) */
  row: Index5;
  /** Column index (0-4) */
  col: Index5;
  /** Kind of space (regular, free) */
  kind: SpaceType;
}

/**
 * Represents the overall game state.
 */
export interface GameState {
  /** The current bingo card */
  card: BingoCard;
  /** Current game status */
  status: GameStatus;
  /** Winning pattern if game is won */
  winningPattern?: WinningPattern;
  /** Number of games played */
  gamesPlayed: number;
  /** Number of wins */
  wins: number;
}
