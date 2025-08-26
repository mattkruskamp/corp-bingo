// Strict 5x5 grid type for bingo card
export type Grid5x5 = import('./bingo').BingoSpace[][];
// Shared index type for 5x5 grid
export type Index5 = 0 | 1 | 2 | 3 | 4;

// Bingo game core types
export * from './bingo';
// Game enums
export * from './enums';
// Winning pattern types
export * from './patterns';
// Phrase management types
export * from './phrases';

// Theme system types
export * from './theme';

// Enhanced statistics types
export * from './statistics';
