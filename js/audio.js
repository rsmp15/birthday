// Audio & Sound Effects Controller with Web Audio API Synthesizer Fallback

export class SoundManager {
  constructor(config) {
    this.config = config;
    this.audioContext = null;
    this.isPlayingMusic = false;
    this.audioElement = new Audio();
    this.audioElement.src = config.music.url;
    this.audioElement.loop = true;
    this.audioElement.volume = 0.55;

    // Synthetic music box fallback if external audio fails or is blocked
    this.isSynthPlaying = false;
    this.synthInterval = null;

    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  toggleMusic() {
    if (this.isPlayingMusic) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
    return this.isPlayingMusic;
  }

  playMusic() {
    this.ensureContext();
    this.isPlayingMusic = true;

    // Try playing external audio element
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlayingMusic = true;
          this.updateUi(true);
        })
        .catch(err => {
          console.warn("External audio playback blocked or unavailable, using gentle synth melody", err);
          this.startSynthMelody();
          this.isPlayingMusic = true;
          this.updateUi(true);
        });
    }
  }

  pauseMusic() {
    this.isPlayingMusic = false;
    this.audioElement.pause();
    this.stopSynthMelody();
    this.updateUi(false);
  }

  updateUi(playing) {
    const musicBtn = document.getElementById('musicToggle');
    if (musicBtn) {
      if (playing) {
        musicBtn.classList.add('playing');
        musicBtn.setAttribute('title', 'Pause Music');
      } else {
        musicBtn.classList.remove('playing');
        musicBtn.setAttribute('title', 'Play Music');
      }
    }
  }

  // Romantic acoustic / music box synthesized melody (Canon in D / Happy Birthday inspired)
  startSynthMelody() {
    if (this.isSynthPlaying || !this.audioContext) return;
    this.isSynthPlaying = true;

    // Notes frequencies (C4, D4, E4, F4, G4, A4, B4, C5, D5, E5)
    const notes = [
      261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88,
      523.25, 587.33, 659.25, 587.33, 523.25, 440.00, 392.00
    ];
    let noteIdx = 0;

    this.synthInterval = setInterval(() => {
      if (!this.isPlayingMusic) return;
      const freq = notes[noteIdx % notes.length];
      noteIdx++;
      this.playChimeNote(freq, 1.2, 0.08);
    }, 480);
  }

  stopSynthMelody() {
    this.isSynthPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  playChimeNote(freq, duration = 0.8, volume = 0.1) {
    if (!this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Audio context issue
    }
  }

  // Sound effect: Unlock chime
  playUnlockSound() {
    this.ensureContext();
    if (!this.audioContext) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChimeNote(freq, 0.9, 0.12);
      }, idx * 120);
    });
  }

  // Sound effect: Candle blow whoosh
  playCandleBlowSound() {
    this.ensureContext();
    if (!this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      // White noise buffer for whoosh
      const bufferSize = this.audioContext.sampleRate * 0.8;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = this.audioContext.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.8);

      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioContext.destination);

      noise.start(now);
    } catch (e) {}
  }

  // Sound effect: Fireworks burst
  playFireworksSound() {
    this.ensureContext();
    if (!this.audioContext) return;
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start(now);
      osc.stop(now + 0.4);

      // Add high shimmer
      setTimeout(() => {
        this.playChimeNote(880 + Math.random() * 400, 0.4, 0.05);
      }, 150);
    } catch (e) {}
  }

  // Sound effect: Subtle click/tap
  playClickSound() {
    this.ensureContext();
    this.playChimeNote(784, 0.15, 0.04);
  }
}
