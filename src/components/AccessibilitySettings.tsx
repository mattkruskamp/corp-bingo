import React from 'react';
import { AccessibilitySettings } from '../types/theme';

interface AccessibilitySettingsProps {
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

export const AccessibilitySettingsPanel: React.FC<AccessibilitySettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div role="group" aria-labelledby="accessibility-settings-title" className="p-4">
      <h3 id="accessibility-settings-title" className="text-lg font-bold mb-2">
        Accessibility Settings
      </h3>
      <div className="mb-2">
        <label>
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => onSettingsChange({ ...settings, highContrast: e.target.checked })}
          />
          High Contrast Mode
        </label>
      </div>
      <div className="mb-2">
        <label>
          Font Size:
          <input
            type="range"
            min={0.75}
            max={1.5}
            step={0.05}
            value={settings.fontScale}
            onChange={(e) => onSettingsChange({ ...settings, fontScale: Number(e.target.value) })}
          />
          <span className="ml-2">{Math.round(settings.fontScale * 100)}%</span>
        </label>
      </div>
      <div className="mb-2">
        <label>
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => onSettingsChange({ ...settings, reducedMotion: e.target.checked })}
          />
          Reduced Motion
        </label>
      </div>
      <div className="mb-2">
        <label>
          <input
            type="checkbox"
            checked={settings.focusIndicator}
            onChange={(e) => onSettingsChange({ ...settings, focusIndicator: e.target.checked })}
          />
          Enhanced Focus Indicators
        </label>
      </div>
    </div>
  );
};
