import React, { useState } from 'react';
import { importPhraseList } from '../utils/exportManager';
import type { PhraseList, PhraseItem, PhraseCategory } from '../types/phrases';

interface PhraseManagerProps {
  phraseList: PhraseList;
  onPhraseListChange: (newList: PhraseList) => void;
}

const PhraseManager: React.FC<PhraseManagerProps> = ({ phraseList, onPhraseListChange }) => {
  const [newPhrase, setNewPhrase] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);

  const handleAddPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    const phraseText = newPhrase.trim();
    if (phraseText.length < 3 || phraseText.length > 32) {
      setError('Phrase must be 3-32 characters.');
      return;
    }
    const categoryName = newCategory.trim() || selectedCategory;
    if (!categoryName) {
      setError('Select or enter a category.');
      return;
    }
    // Check for duplicate (case-insensitive, normalized)
    const norm = (s: string) => s.trim().toLowerCase();
    const cat = phraseList.categories.find((c) => c.name === categoryName);
    if (cat && cat.phrases.some((p) => norm(p.text) === norm(phraseText))) {
      setError('Duplicate phrase in category.');
      return;
    }
    // Add phrase
    const phraseItem = {
      id: Date.now().toString(),
      text: phraseText,
      category: categoryName,
      frequency: 1,
    };
    let updatedList = { ...phraseList };
    if (cat) {
      updatedList = {
        ...updatedList,
        categories: updatedList.categories.map((c) =>
          c.name === categoryName ? { ...c, phrases: [...c.phrases, phraseItem] } : c,
        ),
      };
    } else {
      updatedList = {
        ...updatedList,
        categories: [
          ...updatedList.categories,
          {
            name: categoryName,
            phrases: [phraseItem],
          },
        ],
      };
    }
    setNewPhrase('');
    setNewCategory('');
    setSelectedCategory(categoryName);
    setError('');
    onPhraseListChange(updatedList);
  };

  const handleDeletePhrase = (catName: string, phraseId: string) => {
    if (!window.confirm('Delete this phrase?')) return;
    const updatedList = {
      ...phraseList,
      categories: phraseList.categories.map((c) =>
        c.name === catName ? { ...c, phrases: c.phrases.filter((p) => p.id !== phraseId) } : c,
      ),
    };
    onPhraseListChange(updatedList);
  };

  // Phrase import handler
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setError('');
    try {
      const importedList: PhraseList = await importPhraseList(file);
      // Flatten all phrases from all categories in the imported list
      const importedPhrases: PhraseItem[] = importedList.categories.flatMap((cat) => cat.phrases);
      // Merge imported phrases as a new category
      const updatedList = {
        ...phraseList,
        categories: [
          ...phraseList.categories,
          {
            name: `Imported ${new Date().toLocaleDateString()}`,
            phrases: importedPhrases,
          },
        ],
      };
      onPhraseListChange(updatedList);
    } catch (err) {
      setError('Failed to import phrases: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  // Derived: total phrase count
  const totalPhrases = phraseList.categories.reduce((acc, cat) => acc + cat.phrases.length, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Phrase Manager</h2>
      {totalPhrases < 24 && (
        <div className="text-red-500 text-sm mb-2 text-center">
          You need at least 24 phrases to play Bingo. Add more phrases!
        </div>
      )}
      <form className="mb-4 flex flex-col gap-2" onSubmit={handleAddPhrase}>
        <input
          type="text"
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
          placeholder="Enter new phrase"
          className="border rounded px-3 py-2"
          minLength={3}
          maxLength={32}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Select Category</option>
          {phraseList.categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Or add new category"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Phrase
        </button>
        {/* <label className="block text-sm font-medium text-gray-700 mb-1">
          Import Phrases (JSON):
          <input
            type="file"
            accept="application/json"
            className="block w-full mt-1"
            onChange={handleImport}
            disabled={importing}
          />
        </label> */}
        {importing && <div className="text-blue-500 text-sm mt-1">Importing...</div>}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </form>
      <div className="max-h-64 overflow-y-auto">
        {phraseList.categories.map((cat) => (
          <div key={cat.name} className="mb-4">
            <div className="font-semibold mb-1">
              {cat.name} <span className="text-xs text-gray-500">({cat.phrases.length})</span>
            </div>
            <ul className="list-disc pl-5">
              {cat.phrases.map((phrase) => (
                <li key={phrase.id} className="flex items-center justify-between py-1">
                  <span>{phrase.text}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700 text-xs"
                    onClick={() => handleDeletePhrase(cat.name, phrase.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhraseManager;
