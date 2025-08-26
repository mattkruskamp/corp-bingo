// Enhanced statistics types for Bingo Game
import type { GameState } from './bingo';
import type { WinningPattern } from './patterns';

export interface WinStreak {
  current: number;
  best: number;
  startDate: string;
}

export interface PatternStats {
  rows: number[]; // [row0, row1, ...]
  columns: number[]; // [col0, col1, ...]
  diagonals: { main: number; anti: number };
  corners: number;
  fullCard: number;
}

export interface SessionStats {
  sessionStart: string;
  gamesPlayed: number;
  wins: number;
  timeSpent: number; // seconds
}

export interface GameHistory {
  id: string;
  timestamp: string;
  won: boolean;
  pattern?: WinningPattern;
  timeToComplete: number;
  cardConfig: string;
}

export interface PerformanceMetrics {
  avgSpacesMarked: number;
  fastestWinTime: number;
  mostEfficientPattern: string;
}

export interface DetailedStatistics {
  gamesPlayed: number;
  wins: number;
  winRate: number;
  winStreak: WinStreak;
  patternStats: PatternStats;
  sessionStats: SessionStats;
  gameHistory: GameHistory[];
  performance: PerformanceMetrics;
  avgGameTime: number;
}

export interface GameStateWithStats extends GameState {
  statistics: DetailedStatistics;
  gameStartTime?: number;
}
