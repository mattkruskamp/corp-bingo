import React, { useEffect, useRef } from 'react';
import type { WinningPattern } from '../types/patterns';
import { SoundManager } from '../utils/soundManager';
import type { Theme } from '../types/theme';
import type { GameStateWithStats } from '../types/statistics';
import type { BingoCard } from '../types/bingo';

interface WinCelebrationProps {
  winningPattern: WinningPattern;
  isVisible: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  soundManager?: SoundManager;
  theme?: Theme;
  gamesWon?: number;
  winStreak?: number;
  timeToComplete?: number;
  card: BingoCard;
  exportCardAsImage: (card: BingoCard, theme: Theme) => Promise<string>;
  shareGameResult: (gameState: GameStateWithStats) => Promise<void>;
  gameState: GameStateWithStats;
}

const WinCelebration: React.FC<WinCelebrationProps> = ({
  winningPattern,
  isVisible,
  onClose,
  onPlayAgain,
  soundManager,
  theme,
  gamesWon,
  winStreak,
  timeToComplete,
  card,
  exportCardAsImage,
  shareGameResult,
  gameState,
}) => {
  const playAgainRef = useRef<HTMLButtonElement>(null);

  // Trap focus and handle Escape key
  useEffect(() => {
    if (isVisible) {
      playAgainRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
        // Trap focus inside modal
        if (e.key === 'Tab') {
          const focusable = Array.from(
            document.querySelectorAll(
              '.win-bounce button, .win-bounce [tabindex]:not([tabindex="-1"])',
            ),
          ) as HTMLElement[];
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!document.activeElement) return;
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isVisible, soundManager, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
      aria-describedby="win-desc"
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 flex flex-col items-center win-bounce`}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl font-bold focus:outline-none"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>
        <h2
          id="win-title"
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 win-pulse mb-4"
        >
          BINGO!
        </h2>
        <div id="win-desc" className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {winningPattern.name}
        </div>
        <div className="w-full flex justify-center mb-6">
          {/* Confetti effect */}
          <div className="confetti"></div>
        </div>
        <div className="mb-4 text-center">
          {gamesWon !== undefined && (
            <div>
              Games Won: <span className="font-bold">{gamesWon}</span>
            </div>
          )}
          {winStreak !== undefined && (
            <div>
              Win Streak: <span className="font-bold">{winStreak}</span>
            </div>
          )}
          {timeToComplete !== undefined && (
            <div>
              Time to Win: <span className="font-bold">{timeToComplete}s</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 w-full mt-4">
          <button
            ref={playAgainRef}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
            onClick={onPlayAgain}
          >
            Play Again
          </button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors duration-200"
            onClick={async () => {
              if (exportCardAsImage && card && theme) {
                const url = await exportCardAsImage(card, theme);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'bingo-card.png';
                link.click();
              }
            }}
          >
            Export Card as Image
          </button>
          <button
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition-colors duration-200"
            onClick={async () => {
              if (shareGameResult && gameState) {
                await shareGameResult(gameState);
                alert('Game result shared!');
              }
            }}
          >
            Share Game Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinCelebration;
