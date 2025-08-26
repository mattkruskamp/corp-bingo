import type { PhraseList, PhraseItem } from '../types/phrases';

export function flattenPhraseList(phraseList: PhraseList): PhraseItem[] {
  return phraseList.categories.flatMap((cat) => cat.phrases);
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function selectRandomPhrases(phraseList: PhraseList, count: number): PhraseItem[] {
  const flat = flattenPhraseList(phraseList).filter(
    (p) => !/^free(\s+space)?$/i.test(p.text.trim()),
  );

  // De-duplicate by text
  const deduped = Array.from(new Map(flat.map((p) => [p.text, p])).values());

  if (deduped.length < count) throw new Error('Not enough unique phrases to fill the card');
  return shuffleArray(deduped).slice(0, count);
}

export function validatePhraseSelection(phrases: PhraseItem[], count: number): boolean {
  const unique = new Set(phrases.map((p) => p.text));
  return phrases.length === count && unique.size === count;
}
