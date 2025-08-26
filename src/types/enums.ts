/**
 * Game status values.
 */
export enum GameStatus {
  PLAYING = 'PLAYING',
  WON = 'WON',
  PAUSED = 'PAUSED',
}

/**
 * Types of winning patterns.
 */
export enum WinningPatternType {
  ROW = 'ROW',
  COLUMN = 'COLUMN',
  DIAGONAL = 'DIAGONAL',
  CORNERS = 'CORNERS',
}

/**
 * Types of bingo spaces.
 */
export enum SpaceType {
  REGULAR = 'REGULAR',
  FREE = 'FREE',
}
