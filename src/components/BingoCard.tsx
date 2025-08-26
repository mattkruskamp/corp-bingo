import React from 'react';

import type { BingoCard } from '../types/bingo';
import type { WinningPattern } from '../types/patterns';

import BingoSpace from './BingoSpace';
import {
  KeyboardNavigationManager,
  ScreenReaderManager,
  FocusManager,
} from '../utils/accessibilityManager';

interface BingoCardProps {
  card: BingoCard;
  onSpaceToggle: (row: number, col: number) => void;
  winningPattern?: WinningPattern;
}

const BingoCardFull: React.FC<BingoCardProps> = ({ card, onSpaceToggle, winningPattern }) => {
  const isWinningSpace = (row: number, col: number): boolean => {
    if (!winningPattern) return false;
    return winningPattern.positions.some((pos) => pos.row === row && pos.col === col);
  };

  // Accessibility managers
  const keyboardNav = React.useRef<KeyboardNavigationManager>(new KeyboardNavigationManager());
  const focusManager = React.useRef<FocusManager>(new FocusManager());
  const screenReader = React.useRef<ScreenReaderManager>(new ScreenReaderManager());

  React.useEffect(() => {
    keyboardNav.current.attach('.grid[aria-label="Bingo Card"]');
    return () => {
      keyboardNav.current.detach();
    };
  }, []);

  React.useEffect(() => {
    screenReader.current.announce('Bingo card updated');
  }, [card]);

  return (
    <div className="w-full mx-auto p-2 sm:p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-2 text-xs text-gray-400 text-center">Card ID: {card.id}</div>

      <div
        className="grid grid-cols-5 grid-rows-5 gap-1 sm:gap-2 md:gap-3 aspect-square"
        aria-label="Bingo Card"
      >
        {card.grid.map((row, rIdx) =>
          row.map((space, cIdx) => (
            <BingoSpace
              key={`${rIdx}-${cIdx}`}
              space={space}
              onToggle={() => onSpaceToggle(rIdx, cIdx)}
              isWinning={isWinningSpace(rIdx, cIdx)}
              keyboardNav={keyboardNav.current}
              focusManager={focusManager.current}
              screenReader={screenReader.current}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default BingoCardFull;
