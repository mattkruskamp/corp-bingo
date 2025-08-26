import React from 'react';
import { SoundManager } from '../utils/soundManager';

interface SoundControlsProps {
  soundManager: SoundManager;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export const SoundControls: React.FC<SoundControlsProps> = ({
  soundManager,
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
        aria-pressed={isMuted}
        className="px-2 py-1 rounded focus:outline-none focus:ring"
        onClick={onMuteToggle}
      >
        {isMuted ? <span aria-hidden="true">🔇</span> : <span aria-hidden="true">🔊</span>}
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(volume * 100)}
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(volume * 100)}
        onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
        className="w-24"
      />
      <span className="text-xs">{Math.round(volume * 100)}%</span>
      <button
        type="button"
        aria-label="Test sound"
        className="px-2 py-1 rounded focus:outline-none focus:ring"
        onClick={() => {
          soundManager.ensureUnlocked();
          soundManager.playSpaceClick();
        }}
      >
        <span aria-hidden="true">🔈</span>
      </button>
    </div>
  );
};
