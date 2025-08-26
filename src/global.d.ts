import type { BingoCard } from './types/bingo';
import type { Theme } from './types/theme';
import type { GameStateWithStats } from './types/statistics';

declare global {
  interface Window {
    exportCardAsImage?: (card: BingoCard, theme: Theme) => Promise<string>;
    shareGameResult?: (gameState: GameStateWithStats) => Promise<void>;
    bingoCard?: BingoCard;
    theme?: Theme;
    gameState?: GameStateWithStats;
  }
}

export {};
