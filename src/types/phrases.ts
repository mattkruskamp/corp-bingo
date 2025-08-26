/**
 * Represents a phrase item for bingo.
 */
export interface PhraseItem {
  id: string;
  text: string;
  category: string;
  frequency: number;
}

/**
 * Represents a category of phrases.
 */
export interface PhraseCategory {
  name: string;
  phrases: PhraseItem[];
}

/**
 * List of phrases organized by category.
 */
export interface PhraseList {
  categories: PhraseCategory[];
}

/**
 * Configuration for phrase selection.
 */
export interface PhraseConfig {
  minLength: number;
  maxLength: number;
  categoryWeights: Record<string, number>;
  allowDuplicates: boolean;
}
