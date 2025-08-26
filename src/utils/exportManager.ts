import type { GameStateWithStats } from '../types/statistics';

// export function shareGameResult(gameState: GameStateWithStats): Promise<void> {
// ExportManager: handles export/share of cards, phrases, statistics
import type { BingoCard } from '../types/bingo';
import type { PhraseList } from '../types/phrases';
import type { Theme } from '../types/theme';
import type { DetailedStatistics } from '../types/statistics';
import { SpaceType } from '../types/enums';

export function exportCardAsImage(card: BingoCard, theme: Theme): Promise<string> {
  // Render card to canvas, apply theme, return data URL
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Theme colors from CSS variables (unified names)
      const getVar = (name: string, fallback: string) => {
        return getComputedStyle(document.documentElement).getPropertyValue(name) || fallback;
      };
      const bg = getVar('--bg-primary', theme === 'dark' ? '#18181b' : '#fff');
      const border = getVar('--border-color', theme === 'dark' ? '#333' : '#ccc');
      const marked = getVar('--accent-primary', theme === 'dark' ? '#2563eb' : '#3b82f6');
      const free = getVar('--accent-success', '#22c55e');
      const win = getVar('--accent-warning', '#facc15');
      const text = getVar('--text-primary', theme === 'dark' ? '#fff' : '#222');

      // Fill background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      const size = 5;
      const cell = canvas.width / size;
      ctx.strokeStyle = border;
      ctx.lineWidth = 3;
      for (let i = 0; i <= size; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell, 0);
        ctx.lineTo(i * cell, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cell);
        ctx.lineTo(canvas.width, i * cell);
        ctx.stroke();
      }

      // Draw spaces
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const space = card.grid[r][c];
          let fill = bg;
          if (space.marked) fill = marked;
          if (space.kind === SpaceType.FREE) fill = free;
          // Optionally highlight winning spaces (if present)
          // TODO: Pass winning pattern to highlight
          ctx.fillStyle = fill;
          ctx.fillRect(c * cell + 4, r * cell + 4, cell - 8, cell - 8);
          ctx.strokeStyle = border;
          ctx.strokeRect(c * cell + 4, r * cell + 4, cell - 8, cell - 8);
          // Draw phrase
          ctx.fillStyle = text;
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.save();
          ctx.translate(c * cell + cell / 2, r * cell + cell / 2);
          ctx.rotate(0);
          ctx.fillText(space.kind === 'FREE' ? 'FREE' : space.phrase, 0, 0, cell - 16);
          ctx.restore();
        }
      }
      resolve(canvas.toDataURL('image/png'));
    } catch (e) {
      reject(e);
    }
  });
}

export function exportPhraseList(phraseList: PhraseList): string {
  const data = {
    phrases: phraseList,
    created: new Date().toISOString(),
    version: 1,
  };
  return JSON.stringify(data, null, 2);
}

export function importPhraseList(file: File): Promise<PhraseList> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (!json.phrases) throw new Error('Invalid format');
        resolve(json.phrases);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function shareGameResult(gameState: any): Promise<void> {
  // Create shareable summary, use Web Share API or clipboard
  const summary = `Bingo Game Result: ${gameState.wins} wins, ${gameState.gamesPlayed} games played.`;
  if (navigator.share) {
    return navigator.share({ title: 'Bingo Game Result', text: summary });
  } else if (navigator.clipboard) {
    return navigator.clipboard.writeText(summary);
  }
  return Promise.resolve();
}

export function exportGameStatistics(stats: DetailedStatistics): string {
  return JSON.stringify(stats, null, 2);
}
