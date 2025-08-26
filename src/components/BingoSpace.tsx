import React, { useRef } from 'react';
import { SoundManager } from '../utils/soundManager';
import { SpaceType } from '../types/enums';

interface BingoSpaceProps {
  space: import('../types/bingo').BingoSpace;
  onToggle: () => void;
  isWinning?: boolean;
  soundManager?: SoundManager;
  keyboardNav?: any;
  focusManager?: any;
  screenReader?: any;
}

const BingoSpace: React.FC<BingoSpaceProps> = ({
  space,
  onToggle,
  isWinning,
  soundManager,
  keyboardNav,
  focusManager,
  screenReader,
}) => {
  const isFree = space.kind === SpaceType.FREE;
  const isMarked = space.marked;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const baseClasses =
    'flex items-center justify-center text-center font-semibold border transition-all duration-300 cursor-pointer select-none focus:outline-none';

  let colorClasses = '';
  if (isWinning) {
    colorClasses =
      'ring-4 ring-yellow-400 win-ring-transition bg-gradient-to-br from-yellow-200 to-yellow-300 win-pulse border-yellow-400 text-yellow-900';
  } else if (isFree) {
    colorClasses = 'bg-green-500 text-white border-green-700';
  } else if (isMarked) {
    colorClasses = 'bg-blue-600 text-white border-blue-800';
  } else {
    colorClasses = 'bg-white text-gray-900 border-gray-300 hover:bg-blue-100';
  }

  // Accessibility: ARIA attributes
  const ariaLabel = isFree ? 'Free Space' : space.phrase;
  const ariaPressed = !isFree ? isMarked : undefined;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (isFree) {
      screenReader?.announce('Free space');
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
      soundManager?.playSpaceClick();
      screenReader?.announce(`Space ${space.phrase} ${!space.marked ? 'marked' : 'unmarked'}`);
    }
    // Arrow key navigation
    keyboardNav?.handleKey?.(e, space.row, space.col, buttonRef);
  };

  // Sound effect on click
  const handleClick = () => {
    if (isFree) {
      screenReader?.announce('Free space');
      return;
    }
    onToggle();
    soundManager?.playSpaceClick();
    screenReader?.announce(`Space ${space.phrase} ${!space.marked ? 'marked' : 'unmarked'}`);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-describedby={isWinning ? 'winning-space' : undefined}
      tabIndex={0}
      className={`${baseClasses} ${colorClasses} focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 p-2 sm:p-4 md:p-6 rounded-lg shadow-sm text-xs sm:text-sm md:text-base h-full w-full`}
      aria-disabled={isFree ? 'true' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={() => focusManager?.onFocus(space.row, space.col, buttonRef)}
      onBlur={() => focusManager?.onBlur(space.row, space.col, buttonRef)}
    >
      {isFree ? 'FREE' : space.phrase}
      {isWinning && (
        <span id="winning-space" className="sr-only">
          Winning space
        </span>
      )}
    </button>
  );
};

export default BingoSpace;
