import type { GameState, BingoCard } from '../types/bingo';
import type { GameStateWithStats } from '../types/statistics';
import { SpaceType } from '../types/enums';
import type { PhraseList } from '../types/phrases';
import type { WinningPattern } from '../types/patterns';
import { GameStatus } from '../types/enums';
import { generateBingoCard } from './cardGeneration';

export function createInitialGameState(phraseList?: PhraseList): GameState {
  const card = generateBingoCard(phraseList);
  return {
    status: GameStatus.PLAYING,
    card,
    gamesPlayed: 1,
    wins: 0,
    winningPattern: undefined,
  };
}

export function resetCardInGameState(gameState: GameState): GameState {
  const newGrid = gameState.card.grid.map((row, rIdx) =>
    row.map((space, cIdx) => {
      if (space.kind === 'FREE') return { ...space, marked: true };
      return { ...space, marked: false };
    }),
  ) as import('../types/index').Grid5x5;
  return {
    ...gameState,
    status: GameStatus.PLAYING,
    card: { ...gameState.card, grid: newGrid },
    winningPattern: undefined,
  };
}

export function markSpaceInGameState(gameState: GameState, row: number, col: number): GameState {
  const grid = gameState.card.grid.map((r, rIdx) =>
    r.map((space, cIdx) => {
      if (rIdx === row && cIdx === col && space.kind !== 'FREE') {
        return { ...space, marked: !space.marked };
      }
      return space;
    }),
  ) as import('../types/index').Grid5x5;
  return {
    ...gameState,
    card: { ...gameState.card, grid },
  };
}

// Accept GameStateWithStats for statistics property
export function recordWinInGameState(
  gameState: GameStateWithStats,
  pattern: WinningPattern,
): GameStateWithStats {
  const now = Date.now();
  const timeToComplete = gameState.gameStartTime
    ? Math.floor((now - gameState.gameStartTime) / 1000)
    : 0;
  const stats = { ...gameState.statistics };
  // Update statistics
  stats.wins += 1;
  stats.gamesPlayed = gameState.gamesPlayed;
  stats.winRate = stats.gamesPlayed > 0 ? stats.wins / stats.gamesPlayed : 0;
  // Update streaks
  if (stats.winStreak.current === 0) {
    stats.winStreak.startDate = new Date().toISOString();
  }
  stats.winStreak.current += 1;
  if (stats.winStreak.current > stats.winStreak.best) {
    stats.winStreak.best = stats.winStreak.current;
  }
  // Update game history
  stats.gameHistory.push({
    id: gameState.card.id,
    timestamp: new Date().toISOString(),
    won: true,
    pattern,
    timeToComplete,
    cardConfig: JSON.stringify(gameState.card),
  });
  // Update averages
  const totalTime = stats.gameHistory.reduce(
    (acc: number, g: { timeToComplete?: number }) => acc + (g.timeToComplete || 0),
    0,
  );
  stats.avgGameTime = stats.gameHistory.length > 0 ? totalTime / stats.gameHistory.length : 0;
  stats.performance.fastestWinTime = Math.min(
    ...stats.gameHistory.map((g: { timeToComplete?: number }) => g.timeToComplete || Infinity),
  );
  stats.performance.avgSpacesMarked = 0; // TODO: Compute if needed
  stats.performance.mostEfficientPattern = pattern.name;
  // Session stats
  stats.sessionStats.wins += 1;
  stats.sessionStats.gamesPlayed = stats.gamesPlayed;
  stats.sessionStats.timeSpent += timeToComplete;
  return {
    ...gameState,
    status: GameStatus.WON,
    wins: gameState.wins + 1,
    winningPattern: pattern,
    statistics: stats,
    gameStartTime: undefined,
  };
}

export function startNewGameFromState(
  gameState: GameState | GameStateWithStats,
  phraseList?: PhraseList,
): GameState | GameStateWithStats {
  const card = generateBingoCard(phraseList);
  let statistics =
    'statistics' in gameState && gameState.statistics ? { ...gameState.statistics } : undefined;
  if (statistics) {
    statistics.gamesPlayed += 1;
    statistics.sessionStats.gamesPlayed += 1;
  }
  return {
    ...gameState,
    status: GameStatus.PLAYING,
    card,
    gamesPlayed: gameState.gamesPlayed + 1,
    wins: gameState.wins,
    winningPattern: undefined,
    ...(statistics ? { statistics } : {}),
  };
}

export function validateGameState(state: any): state is GameState {
  // Check top-level fields
  if (!state || typeof state !== 'object') return false;
  const validStatus = Object.values(GameStatus).includes(state.status);
  if (!validStatus) return false;
  if (!state.card || typeof state.card !== 'object') return false;
  if (!Number.isFinite(state.gamesPlayed) || state.gamesPlayed < 0) return false;
  if (!Number.isFinite(state.wins) || state.wins < 0) return false;
  // Check grid shape and BingoSpace fields
  const grid = state.card.grid;
  if (!Array.isArray(grid) || grid.length !== 5) return false;
  for (let r = 0; r < 5; r++) {
    if (!Array.isArray(grid[r]) || grid[r].length !== 5) return false;
    for (let c = 0; c < 5; c++) {
      const space = grid[r][c];
      if (!space || typeof space !== 'object') return false;
      if (typeof space.phrase !== 'string') return false;
      if (typeof space.marked !== 'boolean') return false;
      if (typeof space.row !== 'number' || space.row < 0 || space.row > 4) return false;
      if (typeof space.col !== 'number' || space.col < 0 || space.col > 4) return false;
      if (!(space.kind === SpaceType.FREE || space.kind === SpaceType.REGULAR)) return false;
    }
  }
  // Check FREE space at [2,2]
  const freeSpace = grid[2][2];
  if (!freeSpace || freeSpace.kind !== 'FREE' || freeSpace.phrase.toUpperCase() !== 'FREE')
    return false;
  return true;
}

export function deepCloneGameState(gameState: GameState): GameState {
  return JSON.parse(JSON.stringify(gameState));
}
