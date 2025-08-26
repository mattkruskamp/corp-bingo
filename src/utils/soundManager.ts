// Provides sound effects, volume/mute controls, persistence, and fallback

export type SoundType = 'spaceClick' | 'win' | 'newGame' | 'reset' | 'ambient';

interface SoundManagerOptions {
  volume?: number;
  muted?: boolean;
}

const SOUND_STORAGE_KEY = 'bingo-sound-preferences';

import click from '../assets/sounds/click.mp3';
import win from '../assets/sounds/win.mp3';
import newGame from '../assets/sounds/newGame.mp3';
import reset from '../assets/sounds/reset.mp3';

const soundFiles: Record<SoundType, string> = {
  spaceClick: click,
  win,
  newGame,
  reset,
  ambient: '',
};

export class SoundManager {
  private audioCtx: AudioContext | null = null;
  private sounds: Partial<Record<SoundType, AudioBuffer>> = {};
  private volume: number = 1;
  private muted: boolean = false;
  private fallbackAudio: Partial<Record<SoundType, HTMLAudioElement>> = {};

  constructor(options?: SoundManagerOptions) {
    this.volume = options?.volume ?? 1;
    this.muted = options?.muted ?? false;
    this.init();
  }

  ensureUnlocked() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private init() {
    if (window.AudioContext) {
      this.audioCtx = new window.AudioContext();
      this.preloadSounds();
    } else {
      this.setupFallbackAudio();
    }
    this.loadPreferences();
  }

  private async preloadSounds() {
    for (const type of Object.keys(soundFiles) as SoundType[]) {
      const url = soundFiles[type];
      if (!url) continue;
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        if (this.audioCtx) {
          this.sounds[type] = await this.audioCtx.decodeAudioData(arrayBuffer);
        }
      } catch {
        // Fallback will be used
      }
    }
  }

  private setupFallbackAudio() {
    for (const type of Object.keys(soundFiles) as SoundType[]) {
      const url = soundFiles[type];
      if (!url) continue;
      this.fallbackAudio[type] = new window.Audio(url);
    }
  }

  private loadPreferences() {
    try {
      const prefs = localStorage.getItem(SOUND_STORAGE_KEY);
      if (prefs) {
        const { volume, muted } = JSON.parse(prefs);
        this.volume = volume ?? 1;
        this.muted = muted ?? false;
      }
    } catch {
      // Ignore errors loading preferences
    }
  }

  private savePreferences() {
    localStorage.setItem(
      SOUND_STORAGE_KEY,
      JSON.stringify({ volume: this.volume, muted: this.muted }),
    );
  }

  setVolume(level: number) {
    this.volume = Math.max(0, Math.min(1, level));
    this.savePreferences();
    // Update fallback audio elements
    Object.values(this.fallbackAudio).forEach((audio) => {
      if (audio) audio.volume = this.volume;
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    this.savePreferences();
    // Update fallback audio elements
    Object.values(this.fallbackAudio).forEach((audio) => {
      if (audio) audio.muted = this.muted;
    });
  }

  play(type: SoundType) {
    if (this.muted || this.volume === 0) return;
    if (this.audioCtx && this.sounds[type]) {
      const source = this.audioCtx.createBufferSource();
      source.buffer = this.sounds[type]!;
      const gain = this.audioCtx.createGain();
      gain.gain.value = this.volume;
      source.connect(gain).connect(this.audioCtx.destination);
      source.start(0);
    } else if (this.fallbackAudio[type]) {
      const audio = this.fallbackAudio[type]!;
      audio.volume = this.volume;
      audio.currentTime = 0;
      audio.play();
    }
  }

  playSpaceClick() {
    this.play('spaceClick');
  }
  playWin() {
    this.play('win');
  }
  playNewGame() {
    this.play('newGame');
  }
  playReset() {
    this.play('reset');
  }
  playAmbient() {
    this.play('ambient');
  }

  getVolume() {
    return this.volume;
  }
  isMuted() {
    return this.muted;
  }
}
