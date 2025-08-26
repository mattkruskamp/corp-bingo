import type { PhraseList } from '../types/phrases';
import type { BingoCard, BingoSpace } from '../types/bingo';
import type { Grid5x5, Index5 } from '../types/index';
import { SpaceType } from '../types/enums';
import { selectRandomPhrases } from './phraseSelection';
import { createBingoSpace, createFreeSpace, generateCardId } from './cardHelpers';
import { samplePhrases } from '../data/samplePhrases';

/**
 * Generates a new BingoCard using the provided phrase list or defaults.
 * @param customPhraseList Optional custom phrase list. Defaults to samplePhrases.
 */
export function generateBingoCard(customPhraseList?: PhraseList): BingoCard {
  const phraseList = customPhraseList || samplePhrases;
  // Validate phrase count
  const flatPhrases = phraseList.categories.flatMap((cat) => cat.phrases);
  if (flatPhrases.length < 24) {
    throw new Error(
      'Not enough phrases: at least 24 unique phrases are required to generate a bingo card.',
    );
  }
  const phrases = selectRandomPhrases(phraseList, 24);
  let phraseIdx = 0;
  const grid: Grid5x5 = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => {
      if (row === 2 && col === 2) {
        return createFreeSpace(2 as Index5, 2 as Index5);
      }
      const phrase = phrases[phraseIdx++].text;
      return createBingoSpace(phrase, row as Index5, col as Index5);
    }),
  ) as Grid5x5;

  return {
    id: generateCardId(),
    grid,
    createdAt: Date.now(),
  };
}
