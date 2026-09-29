// Zero-dependency futuristic sound effects and full AI Music Synthesizer using Web Audio API

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled) {
      this.initCtx();
      this.playChime();
    }
  }

  public playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio not permitted or interrupted
    }
  }

  public playChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.06, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.2);
      });
    } catch {
      // Audio not permitted
    }
  }

  public playLaser() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio not permitted
    }
  }
}

export const soundFx = new SoundEffectsManager();

// Full Web Audio Multi-Track Synthesizer Engine
export class MusicSynthesizerEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private timerId: any = null;
  private currentStep: number = 0;
  private bpm: number = 120;
  private genre: string = 'Cyberpunk Synthwave';

  private initAudio() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(60, Math.min(200, newBpm));
  }

  public setGenre(genre: string) {
    this.genre = genre;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  private playSnare(time: number) {
    if (!this.ctx || !this.masterGain) return;
    // Tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.1);
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.15);

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1000, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.16);
  }

  private playHiHat(time: number, open: boolean = false) {
    if (!this.ctx || !this.masterGain) return;
    const dur = open ? 0.2 : 0.05;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.005, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + dur);
  }

  private playBass(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, time);
    filter.frequency.exponentialRampToValueAtTime(120, time + 0.2);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  private playLead(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = this.genre.includes('8-Bit') ? 'square' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  public start() {
    this.initAudio();
    if (!this.ctx) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentStep = 0;

    const stepInterval = (60 / this.bpm) / 4; // 16th note step
    let nextStepTime = this.ctx.currentTime + 0.05;

    // Scale frequencies in C Minor / Arab Hijaz scale
    const bassScale = [65.41, 77.78, 87.31, 98.00]; // C2, Eb2, F2, G2
    const leadScale = [261.63, 311.13, 349.23, 392.00, 466.16, 523.25]; // C4, Eb4, F4, G4, Bb4, C5

    const scheduler = () => {
      if (!this.isPlaying || !this.ctx) return;

      while (nextStepTime < this.ctx.currentTime + 0.1) {
        const step = this.currentStep % 16;

        // Drums rhythm
        if (step === 0 || step === 8 || step === 14) {
          this.playKick(nextStepTime);
        }
        if (step === 4 || step === 12) {
          this.playSnare(nextStepTime);
        }
        if (step % 2 === 0) {
          this.playHiHat(nextStepTime, step === 2 || step === 10);
        }

        // Bass pattern (8th notes)
        if (step % 2 === 0) {
          const bassNote = bassScale[Math.floor(step / 4) % bassScale.length];
          this.playBass(nextStepTime, bassNote);
        }

        // Arpeggiator Lead melody
        if (step % 2 === 1 || step === 0 || step === 7) {
          const noteIndex = (step * 3) % leadScale.length;
          this.playLead(nextStepTime, leadScale[noteIndex]);
        }

        nextStepTime += stepInterval;
        this.currentStep++;
      }

      this.timerId = requestAnimationFrame(scheduler);
    };

    scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      cancelAnimationFrame(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  // Interactive Live Keyboard Note
  public playNote(freq: number, type: OscillatorType = 'sawtooth') {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2500, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.4);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Note play failed', e);
    }
  }

  // Interactive Drum Hit
  public playDrum(drumType: 'kick' | 'snare' | 'hihat' | 'clap') {
    this.initAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (drumType === 'kick') this.playKick(now);
    else if (drumType === 'snare') this.playSnare(now);
    else if (drumType === 'hihat') this.playHiHat(now, true);
    else if (drumType === 'clap') {
      this.playSnare(now);
      this.playHiHat(now + 0.02, false);
    }
  }

  // Real WAV File Exporter using OfflineAudioContext
  public async exportWavFile(bpm = 125, duration = 16): Promise<Blob> {
    const sampleRate = 44100;
    const OfflineCtx = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    if (!OfflineCtx) throw new Error('OfflineAudioContext not supported');

    const offlineCtx = new OfflineCtx(2, sampleRate * duration, sampleRate);
    const master = offlineCtx.createGain();
    master.gain.setValueAtTime(0.8, 0);
    master.connect(offlineCtx.destination);

    const stepInterval = (60 / bpm) / 4;
    const totalSteps = Math.floor(duration / stepInterval);

    const bassScale = [65.41, 77.78, 87.31, 98.00];
    const leadScale = [261.63, 311.13, 349.23, 392.00, 466.16, 523.25];

    for (let step = 0; step < totalSteps; step++) {
      const time = step * stepInterval;

      // Kick
      if (step % 16 === 0 || step % 16 === 8 || step % 16 === 14) {
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.frequency.setValueAtTime(140, time);
        osc.frequency.exponentialRampToValueAtTime(35, time + 0.18);
        gain.gain.setValueAtTime(0.9, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
        osc.connect(gain);
        gain.connect(master);
        osc.start(time);
        osc.stop(time + 0.22);
      }

      // Snare
      if (step % 16 === 4 || step % 16 === 12) {
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, time);
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
        osc.connect(gain);
        gain.connect(master);
        osc.start(time);
        osc.stop(time + 0.14);
      }

      // Hihat
      if (step % 2 === 0) {
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(7000, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
        osc.connect(gain);
        gain.connect(master);
        osc.start(time);
        osc.stop(time + 0.05);
      }

      // Bass
      if (step % 2 === 0) {
        const note = bassScale[Math.floor((step % 16) / 4) % bassScale.length];
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note, time);
        gain.gain.setValueAtTime(0.45, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + stepInterval * 1.5);
        osc.connect(gain);
        gain.connect(master);
        osc.start(time);
        osc.stop(time + stepInterval * 1.5);
      }

      // Lead
      if (step % 2 === 1 || step % 8 === 0) {
        const note = leadScale[(step * 2) % leadScale.length];
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, time);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + stepInterval * 1.2);
        osc.connect(gain);
        gain.connect(master);
        osc.start(time);
        osc.stop(time + stepInterval * 1.2);
      }
    }

    const renderedBuffer = await offlineCtx.startRendering();
    return this.bufferToWavBlob(renderedBuffer);
  }

  // Convert AudioBuffer to 16-bit stereo WAV Blob
  private bufferToWavBlob(buffer: AudioBuffer): Blob {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    const channels: Float32Array[] = [];
    let sampleRate = buffer.sampleRate;
    let offset = 0;
    let pos = 0;

    function setUint16(data: number) {
      out.setUint16(pos, data, true);
      pos += 2;
    }
    function setUint32(data: number) {
      out.setUint32(pos, data, true);
      pos += 4;
    }

    // RIFF identifier
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);  // file length - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16);         // 16 for PCM format
    setUint16(1);          // Linear PCM
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan); // byte rate
    setUint16(numOfChan * 2);              // block align
    setUint16(16);                         // 16-bit
    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset] || 0));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out.buffer], { type: 'audio/wav' });
  }

  // Vocal recitation with rhythm
  public singLyrics(lyrics: string, lang = 'ar') {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Clean lyrics brackets
    const cleanLines = lyrics
      .split('\n')
      .map((l) => l.replace(/\[.*?\]/g, '').trim())
      .filter((l) => l.length > 0)
      .slice(0, 8)
      .join('. ');

    const utterance = new SpeechSynthesisUtterance(cleanLines);
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }

  public stopSinging() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const musicEngine = new MusicSynthesizerEngine();
