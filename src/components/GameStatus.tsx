import React from 'react';
import { GameStatus } from '../types/enums';
import type { WinningPattern } from '../types/patterns';

interface GameStatusProps {
  gameStatus: GameStatus;
  gamesPlayed: number;
  wins: number;
  winningPattern?: WinningPattern;
}

const GameStatusBanner: React.FC<GameStatusProps> = ({
  gameStatus,
  gamesPlayed,
  wins,
  winningPattern,
}) => {
  let statusText = '';
  let statusClass = '';
  if (gameStatus === GameStatus.WON) {
    statusText = `BINGO! You Won${winningPattern ? ` (${winningPattern.name})` : ''}`;
    statusClass = 'bg-green-500 text-white';
  } else if (gameStatus === GameStatus.PLAYING) {
    statusText = 'Game in Progress';
    statusClass = 'bg-blue-100 text-blue-900';
  } else {
    statusText = 'Game Paused';
    statusClass = 'bg-gray-200 text-gray-700';
  }

  return (
    <div
      className={`w-full py-2 px-4 rounded-lg shadow text-center font-semibold mb-2 transition-all duration-300 ${statusClass}`}
    >
      <div className="text-lg">{statusText}</div>
      <div className="text-sm mt-1">
        Games: {gamesPlayed} | Wins: {wins}
      </div>
    </div>
  );
};

export default GameStatusBanner;
