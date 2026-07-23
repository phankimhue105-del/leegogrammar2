interface NoteInfo {
  freq: number;
  slideEndFreq?: number;
  start: number;
  dur: number;
  type: 'sine' | 'triangle';
  gain: number;
}

// Helper to generate a Base64 WAV Data URI for a given list of notes (polyphonic synthesis)
function generateMelodyWav(notes: NoteInfo[], totalDuration: number): string {
  if (typeof window === 'undefined') return '';
  const sampleRate = 11025;
  const numSamples = Math.floor(sampleRate * totalDuration);
  const fileSize = 44 + numSamples;
  const buffer = new Uint8Array(fileSize);
  
  // RIFF Header
  buffer[0] = 0x52; // 'R'
  buffer[1] = 0x49; // 'I'
  buffer[2] = 0x46; // 'F'
  buffer[3] = 0x46; // 'F'
  
  const size = fileSize - 8;
  buffer[4] = size & 0xff;
  buffer[5] = (size >> 8) & 0xff;
  buffer[6] = (size >> 16) & 0xff;
  buffer[7] = (size >> 24) & 0xff;
  
  buffer[8] = 0x57;  // 'W'
  buffer[9] = 0x41;  // 'A'
  buffer[10] = 0x56; // 'V'
  buffer[11] = 0x45; // 'E'
  
  // fmt chunk
  buffer[12] = 0x66; // 'f'
  buffer[13] = 0x6d; // 'm'
  buffer[14] = 0x74; // 't'
  buffer[15] = 0x20; // ' '
  
  buffer[16] = 16; buffer[17] = 0; buffer[18] = 0; buffer[19] = 0; // fmt size
  buffer[20] = 1; buffer[21] = 0; // PCM format
  buffer[22] = 1; buffer[23] = 0; // Mono channel
  
  buffer[24] = sampleRate & 0xff;
  buffer[25] = (sampleRate >> 8) & 0xff;
  buffer[26] = (sampleRate >> 16) & 0xff;
  buffer[27] = (sampleRate >> 24) & 0xff;
  
  buffer[28] = sampleRate & 0xff;
  buffer[29] = (sampleRate >> 8) & 0xff;
  buffer[30] = (sampleRate >> 16) & 0xff;
  buffer[31] = (sampleRate >> 24) & 0xff;
  
  buffer[32] = 1; buffer[33] = 0; // Block align
  buffer[34] = 8; buffer[35] = 0; // 8-bit unsigned PCM
  
  // data chunk
  buffer[36] = 0x64; // 'd'
  buffer[37] = 0x61; // 'a'
  buffer[38] = 0x74; // 't'
  buffer[39] = 0x61; // 'a'
  
  buffer[40] = numSamples & 0xff;
  buffer[41] = (numSamples >> 8) & 0xff;
  buffer[42] = (numSamples >> 16) & 0xff;
  buffer[43] = (numSamples >> 24) & 0xff;
  
  // Render samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let combinedVal = 0;
    
    for (const note of notes) {
      if (t >= note.start && t < note.start + note.dur) {
        const nt = t - note.start;
        let sample = 0;
        
        if (note.slideEndFreq) {
          const slope = (note.slideEndFreq - note.freq) / note.dur;
          const phase = 2 * Math.PI * (note.freq * nt + 0.5 * slope * nt * nt);
          if (note.type === 'triangle') {
            const normPhase = (phase / (2 * Math.PI)) % 1.0;
            sample = normPhase < 0.5 ? (4 * normPhase - 1) : (3 - 4 * normPhase);
          } else {
            sample = Math.sin(phase);
          }
        } else {
          if (note.type === 'sine') {
            sample = Math.sin(2 * Math.PI * note.freq * nt);
          } else if (note.type === 'triangle') {
            const period = 1 / note.freq;
            const progress = (nt % period) / period;
            sample = progress < 0.5 ? (4 * progress - 1) : (3 - 4 * progress);
          }
        }
        
        // Anti-click fade envelopes
        const fadeOut = Math.min(0.05, note.dur * 0.2);
        if (note.dur - nt < fadeOut) {
          sample *= (note.dur - nt) / fadeOut;
        }
        const fadeIn = 0.01;
        if (nt < fadeIn) {
          sample *= nt / fadeIn;
        }
        
        combinedVal += sample * note.gain;
      }
    }
    
    const val = Math.floor((combinedVal + 1) * 127.5);
    buffer[44 + i] = Math.min(255, Math.max(0, val));
  }
  
  let binary = '';
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

// Pre-render sound WAV data URIs on startup to prevent latency
const SELECTION_WAV = generateMelodyWav([{ freq: 600, start: 0, dur: 0.05, type: 'sine', gain: 0.08 }], 0.05);

const CORRECT_WAV = generateMelodyWav([
  { freq: 587.33, start: 0, dur: 0.25, type: 'sine', gain: 0.12 },
  { freq: 880.00, start: 0.08, dur: 0.35, type: 'sine', gain: 0.12 }
], 0.43);

const INCORRECT_WAV = generateMelodyWav([
  { freq: 220, slideEndFreq: 140, start: 0, dur: 0.4, type: 'triangle', gain: 0.15 }
], 0.4);

const SUCCESS_WAV = generateMelodyWav([
  { freq: 523.25, start: 0.0, dur: 0.4, type: 'sine', gain: 0.15 },
  { freq: 659.25, start: 0.08, dur: 0.4, type: 'sine', gain: 0.15 },
  { freq: 783.99, start: 0.16, dur: 0.5, type: 'sine', gain: 0.15 },
  { freq: 1046.50, start: 0.24, dur: 0.6, type: 'sine', gain: 0.15 }
], 0.84);

const VICTORY_WAV = generateMelodyWav([
  { freq: 523.25, start: 0.0, dur: 0.3, type: 'triangle', gain: 0.2 },
  { freq: 659.25, start: 0.06, dur: 0.3, type: 'triangle', gain: 0.2 },
  { freq: 783.99, start: 0.12, dur: 0.3, type: 'triangle', gain: 0.2 },
  { freq: 1046.50, start: 0.18, dur: 0.4, type: 'triangle', gain: 0.2 },
  { freq: 1318.51, start: 0.24, dur: 0.4, type: 'triangle', gain: 0.2 },
  { freq: 1567.98, start: 0.30, dur: 0.6, type: 'triangle', gain: 0.2 }
], 0.90);

// Single pre-instantiated HTML5 Audio elements for the application
let selectionAudio: HTMLAudioElement | null = null;
let correctAudio: HTMLAudioElement | null = null;
let incorrectAudio: HTMLAudioElement | null = null;
let successAudio: HTMLAudioElement | null = null;
let victoryAudio: HTMLAudioElement | null = null;

function getAudioElements() {
  if (typeof window === 'undefined') return [];
  if (!selectionAudio) {
    selectionAudio = new Audio(SELECTION_WAV);
    correctAudio = new Audio(CORRECT_WAV);
    incorrectAudio = new Audio(INCORRECT_WAV);
    successAudio = new Audio(SUCCESS_WAV);
    victoryAudio = new Audio(VICTORY_WAV);
  }
  return [selectionAudio, correctAudio, incorrectAudio, successAudio, victoryAudio];
}

// Unlocks and primes all HTML5 Audio elements on first gesture
let isUnlocked = false;
export function unlockAudio() {
  if (typeof window === 'undefined') return;
  if (isUnlocked) return;
  isUnlocked = true;

  const audios = getAudioElements();
  audios.forEach(audio => {
    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(err => {
          console.warn("[HTML5 Audio] Unlocked failed:", err);
          isUnlocked = false; // Retry on next event
        });
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    } catch (e) {
      console.warn("[HTML5 Audio] Unlock error:", e);
      isUnlocked = false;
    }
  });
}

// Register capturing event listeners on window to capture the very first user interaction
const unlockEvents = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];
let isInitialized = false;

export function initAudio() {
  if (typeof window === 'undefined') return;
  if (isInitialized) return;
  isInitialized = true;

  const handleUnlock = () => {
    unlockAudio();
    if (isUnlocked) {
      unlockEvents.forEach(evt => {
        window.removeEventListener(evt, handleUnlock, true);
      });
      console.log("[HTML5 Audio] Prime unlock success. Listeners removed.");
    }
  };

  unlockEvents.forEach(evt => {
    window.addEventListener(evt, handleUnlock, true);
  });
  
  // Pre-load/instantiate elements immediately
  getAudioElements();
  console.log("[HTML5 Audio] Initialization complete.");
}

// Helper to safely play primed audio instances with optional delay
function safePlay(audio: HTMLAudioElement | null, delaySeconds: number = 0) {
  if (!audio) return;
  
  const play = () => {
    try {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.warn("[HTML5 Audio] Play blocked:", err);
      });
    } catch (e) {
      console.warn("[HTML5 Audio] Play error:", e);
    }
  };
  
  if (delaySeconds > 0) {
    setTimeout(play, delaySeconds * 1000);
  } else {
    play();
  }
}

export function playSuccessSound(delaySeconds: number = 0) {
  getAudioElements();
  safePlay(successAudio, delaySeconds);
}

export function playVictorySound(delaySeconds: number = 0) {
  getAudioElements();
  safePlay(victoryAudio, delaySeconds);
}

export function playSelectionSound(delaySeconds: number = 0) {
  getAudioElements();
  safePlay(selectionAudio, delaySeconds);
}

export function playCorrectSound(delaySeconds: number = 0) {
  getAudioElements();
  safePlay(correctAudio, delaySeconds);
}

export function playIncorrectSound(delaySeconds: number = 0) {
  getAudioElements();
  safePlay(incorrectAudio, delaySeconds);
}
