import React from 'react';
import type { DetailedStatistics } from '../types/statistics';
import { exportGameStatistics } from '../utils/exportManager';

interface StatisticsPanelProps {
  statistics: DetailedStatistics;
  isVisible: boolean;
  onClose: () => void;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  statistics,
  isVisible,
  onClose,
}) => {
  const panelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (isVisible && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isVisible]);
  if (!isVisible) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      tabIndex={-1}
      ref={panelRef}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
        if (e.key === 'Tab') {
          const focusable = panelRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (!focusable || focusable.length === 0) return;
          const first = focusable[0] as HTMLElement;
          const last = focusable[focusable.length - 1] as HTMLElement;
          if (!document.activeElement) return;
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-xl relative">
        <h2 id="stats-title" className="text-xl font-bold mb-4">
          Game Statistics
        </h2>
        <button
          type="button"
          aria-label="Close statistics panel"
          className="absolute top-2 right-2 px-2 py-1 rounded focus:outline-none focus:ring"
          onClick={onClose}
        >
          
        </button>
        <div aria-describedby="stats-title">
          <div className="mb-2">Games Played: {statistics.gamesPlayed}</div>
          <div className="mb-2">Wins: {statistics.wins}</div>
          <div className="mb-2">Win Rate: {Math.round(statistics.winRate * 100)}%</div>
          <div className="mb-2">Current Streak: {statistics.winStreak.current}</div>
          <div className="mb-2">Best Streak: {statistics.winStreak.best}</div>
          <div className="mb-2">Session Start: {statistics.sessionStats.sessionStart || 'N/A'}</div>
          <div className="mb-2">Session Games Played: {statistics.sessionStats.gamesPlayed}</div>
          <div className="mb-2">Session Wins: {statistics.sessionStats.wins}</div>
          <div className="mb-2">Session Time Spent: {statistics.sessionStats.timeSpent}s</div>
          <div className="mb-2">Average Game Time: {statistics.avgGameTime}s</div>
          <div className="mb-2">Fastest Win: {statistics.performance.fastestWinTime}s</div>
          <div className="mb-2">
            Most Efficient Pattern: {statistics.performance.mostEfficientPattern}
          </div>
          <div className="mb-2">Game History:</div>
          <ul className="list-disc pl-5 text-xs">
            {statistics.gameHistory.slice(-5).map((game, idx) => (
              <li key={idx}>
                {game.timestamp}: {game.won ? 'Win' : 'Loss'}{' '}
                {game.pattern?.name ? `(${game.pattern.name})` : ''}
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          aria-label="Export statistics"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          onClick={() => {
            const data = exportGameStatistics(statistics);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bingo-statistics.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export as JSON
        </button>
      </div>
    </div>
  );
};
