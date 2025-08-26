import React from 'react';
import { GameStatus } from '../types/enums';

interface GameControlsProps {
  onNewGame: () => void;
  onReset: () => void;
  gameStatus: GameStatus;
  canReset: boolean;
  hasEnoughPhrases?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onReset,
  gameStatus,
  canReset,
  hasEnoughPhrases = true,
}) => {
  return (
    <div className="flex gap-4 justify-center my-4">
      <button
        type="button"
        aria-label="New Game"
        onClick={onNewGame}
        disabled={!hasEnoughPhrases}
        className={`px-6 py-2 rounded-lg font-bold shadow transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          ${gameStatus === GameStatus.WON ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-blue-600 text-white hover:bg-blue-700'}
          ${!hasEnoughPhrases ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : ''}`}
      >
        New Game
      </button>
      <button
        type="button"
        aria-label="Reset Card"
        onClick={onReset}
        disabled={!canReset}
        className={`px-6 py-2 rounded-lg font-bold shadow transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          ${canReset ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
      >
        Reset
      </button>
    </div>
  );
};

export default GameControls;
