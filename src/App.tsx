import React, { useState, useEffect } from 'react';
import './App.css';
import type { GameState } from './types/bingo';
import type { GameStateWithStats } from './types/statistics';
import type { PhraseList } from './types/phrases';
import type { WinningPattern } from './types/patterns';
import type { Theme, AccessibilitySettings } from './types/theme';
import type { DetailedStatistics } from './types/statistics';
import { GameStatus } from './types/enums';
import {
  BingoCard,
  GameControls,
  GameStatus as GameStatusBanner,
  PhraseManager,
  ThemeToggle,
  SoundControls,
  StatisticsPanel,
  ExportControls,
  AccessibilitySettings as AccessibilitySettingsPanel,
} from './components';
import {
  saveGameState,
  loadGameState,
  savePhraseList,
  loadPhraseList,
  clearGameData,
} from './utils/localStorage';
import {
  createInitialGameState,
  resetCardInGameState,
  startNewGameFromState,
  markSpaceInGameState,
  recordWinInGameState,
} from './utils/gameStateHelpers';
import { samplePhrases } from './data/samplePhrases';
import { checkWinningPatterns } from './utils/winningDetection';
import { validateGameState } from './utils/gameStateHelpers';
import { SoundManager } from './utils/soundManager';
import { ThemeManager, loadThemePreferences } from './utils/themeManager';
import { exportCardAsImage, shareGameResult } from './utils/exportManager';
// Accessibility managers are imported only where needed, not in App.tsx

import WinCelebration from './components/WinCelebration';

function App() {
  const tm = React.useRef<ThemeManager | null>(null);
  // State: game, phrases, theme, sound, accessibility, UI panels
  const [gameState, setGameState] = useState<GameStateWithStats>(() => {
    const savedState = loadGameState();
    if (
      savedState &&
      validateGameState(savedState) &&
      typeof (savedState as any).statistics !== 'undefined' &&
      typeof (savedState as any).gameStartTime !== 'undefined'
    ) {
      return savedState as GameStateWithStats;
    }
    // Initial statistics
    const initialStats: DetailedStatistics = {
      gamesPlayed: 1,
      wins: 0,
      winRate: 0,
      winStreak: { current: 0, best: 0, startDate: new Date().toISOString() },
      patternStats: {
        rows: [0, 0, 0, 0, 0],
        columns: [0, 0, 0, 0, 0],
        diagonals: { main: 0, anti: 0 },
        corners: 0,
        fullCard: 0,
      },
      sessionStats: {
        sessionStart: new Date().toISOString(),
        gamesPlayed: 1,
        wins: 0,
        timeSpent: 0,
      },
      gameHistory: [],
      performance: { avgSpacesMarked: 0, fastestWinTime: 0, mostEfficientPattern: '' },
      avgGameTime: 0,
    };
    return {
      ...createInitialGameState(samplePhrases),
      statistics: initialStats,
      gameStartTime: Date.now(),
    };
  });
  const [customPhraseList, setCustomPhraseList] = useState<PhraseList>(() => {
    const savedPhrases = loadPhraseList();
    return savedPhrases || samplePhrases;
  });
  const [theme, setTheme] = useState<Theme>(() => loadThemePreferences());
  const [soundManager] = useState(() => {
    const sm = new SoundManager();
    sm.setVolume(0.5);
    return sm;
  });
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(soundManager.isMuted());
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(() => ({
    highContrast: false,
    reducedMotion: false,
    fontScale: 1,
    focusIndicator: true,
  }));
  const [showPhraseManager, setShowPhraseManager] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showExportControls, setShowExportControls] = useState(false);
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  // Update document title
  React.useEffect(() => {
    document.title = 'Corporate Bingo';
  }, []);

  // Derived: are there enough phrases to generate a card?
  const hasEnoughPhrases =
    customPhraseList.categories.reduce((acc, cat) => acc + cat.phrases.length, 0) >= 24;

  // Auto-save game state
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Auto-save phrase list
  useEffect(() => {
    savePhraseList(customPhraseList);
  }, [customPhraseList]);

  // Theme manager integration
  useEffect(() => {
    tm.current = new ThemeManager();
    tm.current.applyTheme(theme);
    tm.current.onThemeChange(setTheme);
    return () => {
      tm.current?.dispose();
      tm.current = null;
    };
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    tm.current?.applyTheme(newTheme);
    setTheme(newTheme);
  };

  // Accessibility settings effect
  useEffect(() => {
    document.body.style.fontSize = `${accessibilitySettings.fontScale * 100}%`;
    document.body.classList.toggle('high-contrast', accessibilitySettings.highContrast);
    document.body.classList.toggle('reduced-motion', accessibilitySettings.reducedMotion);
  }, [accessibilitySettings]);

  // Sound controls
  const handleVolumeChange = (v: number) => {
    soundManager.setVolume(v);
    setVolume(soundManager.getVolume());
  };
  const handleMuteToggle = () => {
    soundManager.toggleMute();
    setMuted(soundManager.isMuted());
  };

  // Game event handlers
  const handleNewGame = () => {
    if (!hasEnoughPhrases) return;
    soundManager.playNewGame();
    try {
      const newState = {
        ...startNewGameFromState(gameState, customPhraseList),
        statistics: gameState.statistics,
        gameStartTime: Date.now(),
      };
      setGameState(newState);
    } catch (e) {
      alert('Error starting new game: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleReset = () => {
    soundManager.playReset();
    setGameState({
      ...resetCardInGameState(gameState),
      statistics: gameState.statistics,
      gameStartTime: Date.now(),
    });
  };

  const handleSpaceToggle = (row: number, col: number) => {
    if (gameState.status === GameStatus.WON) return;
    soundManager.playSpaceClick();
    let updatedState = markSpaceInGameState(gameState, row, col) as GameStateWithStats;
    // Win detection after every space toggle
    const pattern = checkWinningPatterns(updatedState.card.grid);
    if (pattern && updatedState.status !== GameStatus.WON) {
      soundManager.playWin();
      updatedState = {
        ...recordWinInGameState(
          {
            ...updatedState,
            statistics: gameState.statistics,
            gameStartTime: gameState.gameStartTime,
          },
          pattern,
        ),
        statistics: gameState.statistics,
        gameStartTime: gameState.gameStartTime,
      };
    }
    setGameState(updatedState);
  };

  const handlePhraseListChange = (newList: PhraseList) => {
    setCustomPhraseList(newList);
  };

  // Removed duplicate handleThemeChange

  // UI panel toggles
  const togglePhraseManager = () => setShowPhraseManager((prev) => !prev);
  const toggleStatistics = () => setShowStatistics((prev) => !prev);
  const toggleExportControls = () => setShowExportControls((prev) => !prev);
  const toggleAccessibilitySettings = () => setShowAccessibilitySettings((prev) => !prev);

  // Use real statistics from gameState
  const statistics: DetailedStatistics = gameState.statistics;

  useEffect(() => {
    if (gameState.status === GameStatus.WON && gameState.winningPattern != null) {
      setShowWinModal(true);
    } else {
      setShowWinModal(false);
    }
  }, [gameState.status, gameState.winningPattern]);

  const handleWinModalClose = () => {
    setShowWinModal(false);
  };

  const handlePlayAgain = () => {
    setShowWinModal(false);
    handleNewGame();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white py-4 shadow flex flex-col items-center justify-center px-4">
        <div className="w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center mb-4">Corporate Bingo</h1>
          <GameStatusBanner
            gameStatus={gameState.status}
            gamesPlayed={gameState.gamesPlayed}
            wins={gameState.wins}
            winningPattern={gameState.winningPattern}
          />
        </div>
      </header>
      <div className="w-full flex items-center gap-2 justify-center py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <ThemeToggle currentTheme={theme} onThemeChange={handleThemeChange} />
        <SoundControls
          soundManager={soundManager}
          volume={volume}
          isMuted={muted}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={handleMuteToggle}
        />
        <button
          type="button"
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          aria-label="Show statistics"
          onClick={toggleStatistics}
        >
          📊
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          aria-label="Show export controls"
          onClick={toggleExportControls}
        >
          ⬇️
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          aria-label="Accessibility settings"
          onClick={toggleAccessibilitySettings}
        >
          ♿
        </button>
      </div>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <GameControls
          onNewGame={handleNewGame}
          onReset={handleReset}
          gameStatus={gameState.status}
          canReset={true}
          hasEnoughPhrases={hasEnoughPhrases}
        />
        {!hasEnoughPhrases && (
          <div className="text-red-500 text-sm mb-2 text-center">
            You need at least 24 phrases to start a new game.
          </div>
        )}
        <div className="w-full max-w-2xl">
          <BingoCard
            card={gameState.card}
            onSpaceToggle={handleSpaceToggle}
            winningPattern={gameState.winningPattern}
          />
        </div>
        {showPhraseManager && (
          <PhraseManager
            phraseList={customPhraseList}
            onPhraseListChange={handlePhraseListChange}
          />
        )}
        {showStatistics && (
          <StatisticsPanel
            statistics={statistics}
            isVisible={showStatistics}
            onClose={toggleStatistics}
          />
        )}
        {showExportControls && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500"
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 min-w-[320px] relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl font-bold focus:outline-none"
                aria-label="Close export controls"
                onClick={toggleExportControls}
              >
                &times;
              </button>
              <h2 id="export-modal-title" className="text-xl font-bold mb-4">
                Export & Import
              </h2>
              <ExportControls
                card={gameState.card}
                gameState={gameState}
                phraseList={customPhraseList}
                theme={theme}
              />
            </div>
          </div>
        )}
        {showAccessibilitySettings && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500"
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-modal-title"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 min-w-[320px] relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl font-bold focus:outline-none"
                aria-label="Close accessibility settings"
                onClick={toggleAccessibilitySettings}
              >
                &times;
              </button>
              <h2 id="accessibility-modal-title" className="text-xl font-bold mb-4">
                Accessibility Settings
              </h2>
              <AccessibilitySettingsPanel
                settings={accessibilitySettings}
                onSettingsChange={setAccessibilitySettings}
              />
            </div>
          </div>
        )}
        {showWinModal &&
          gameState.status === GameStatus.WON &&
          gameState.winningPattern != null && (
            <WinCelebration
              winningPattern={gameState.winningPattern as import('./types/patterns').WinningPattern}
              isVisible={true}
              onClose={handleWinModalClose}
              onPlayAgain={handlePlayAgain}
              soundManager={soundManager}
              theme={theme}
              gamesWon={statistics.wins}
              winStreak={statistics.winStreak.current}
              timeToComplete={
                statistics.gameHistory.length > 0
                  ? statistics.gameHistory[statistics.gameHistory.length - 1].timeToComplete
                  : undefined
              }
              card={gameState.card}
              exportCardAsImage={exportCardAsImage}
              shareGameResult={shareGameResult}
              gameState={gameState}
            />
          )}
      </main>
      <footer className="bg-gray-100 text-gray-500 py-2 text-center">
        &copy; 2025 mattkruskamp.me. All rights reserved.
        <br />
        Built using Traycer, CoPilot, React, Tailwind, and Vite.
      </footer>
    </div>
  );
}

export default App;
