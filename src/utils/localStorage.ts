import type { PhraseList } from '../types/phrases';
import type { GameState } from '../types/bingo';

const GAME_STATE_KEY = 'bingo_game_state';
const PHRASE_LIST_KEY = 'bingo_phrase_list';

import { validateGameState } from './gameStateHelpers';

export function saveGameState(gameState: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (validateGameState(parsed)) {
      return parsed as GameState;
    }
    return null;
  } catch (e) {
    console.error('Failed to load game state:', e);
    return null;
  }
}

export function savePhraseList(phraseList: PhraseList): void {
  try {
    localStorage.setItem(PHRASE_LIST_KEY, JSON.stringify(phraseList));
  } catch (e) {
    console.error('Failed to save phrase list:', e);
  }
}

export function loadPhraseList(): PhraseList | null {
  try {
    const raw = localStorage.getItem(PHRASE_LIST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate phrase list structure
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.categories) &&
      parsed.categories.every(
        (cat: any) =>
          typeof cat.name === 'string' &&
          Array.isArray(cat.phrases) &&
          cat.phrases.every(
            (p: any) =>
              typeof p.id === 'string' &&
              typeof p.text === 'string' &&
              typeof p.category === 'string' &&
              typeof p.frequency === 'number',
          ),
      )
    ) {
      return parsed as PhraseList;
    }
    return null;
  } catch (e) {
    console.error('Failed to load phrase list:', e);
    return null;
  }
}

export function clearGameData(): void {
  localStorage.removeItem(GAME_STATE_KEY);
  localStorage.removeItem(PHRASE_LIST_KEY);
}
