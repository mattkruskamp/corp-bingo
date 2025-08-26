import React, { useRef, useState } from 'react';
import type { BingoCard } from '../types/bingo';
import type { GameState } from '../types/bingo';
import type { PhraseList } from '../types/phrases';
import type { Theme } from '../types/theme';
import {
  exportCardAsImage,
  exportPhraseList,
  importPhraseList,
  shareGameResult,
} from '../utils/exportManager';

interface ExportControlsProps {
  card: BingoCard;
  gameState: GameState;
  phraseList: PhraseList;
  theme: Theme;
  onPhraseListImport?: (newList: PhraseList) => void;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  card,
  gameState,
  phraseList,
  theme,
  onPhraseListImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleExportImage = async () => {
    const dataUrl = await exportCardAsImage(card, theme);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'bingo-card.png';
    a.click();
  };

  const handleExportPhrases = () => {
    const data = exportPhraseList(phraseList);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bingo-phrases.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPhrases = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const newList = await importPhraseList(file);
      if (onPhraseListImport) onPhraseListImport(newList);
      alert('Phrase list imported!');
    } catch {
      alert('Failed to import phrase list.');
    }
  };

  const handleShareResult = async () => {
    setShareStatus(null);
    try {
      await shareGameResult(gameState);
      setShareStatus('Game result shared!');
    } catch (err) {
      // Clipboard fallback
      try {
        const summary = `Bingo Game Result: ${gameState.wins} wins, ${gameState.gamesPlayed} games played.`;
        await navigator.clipboard.writeText(summary);
        setShareStatus('Game result copied to clipboard!');
      } catch {
        setShareStatus('Failed to share game result.');
      }
    }
    setTimeout(() => setShareStatus(null), 3000);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-label="Export card as image"
        className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        onClick={handleExportImage}
      >
        Export Card as Image
      </button>
      <button
        type="button"
        aria-label="Share game result"
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        onClick={handleShareResult}
      >
        Share Game Result
      </button>
      {shareStatus && (
        <div role="status" aria-live="polite" className="text-sm text-blue-700 mt-1">
          {shareStatus}
        </div>
      )}
      <button
        type="button"
        aria-label="Export phrases"
        className="px-4 py-2 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700"
        onClick={handleExportPhrases}
      >
        Export Phrases
      </button>
      <label className="px-4 py-2 bg-gray-200 rounded shadow cursor-pointer">
        Import Phrases
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          className="sr-only"
          onChange={handleImportPhrases}
        />
      </label>
    </div>
  );
};
