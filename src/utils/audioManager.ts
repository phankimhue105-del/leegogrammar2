// Shared, single AudioContext instance
let sharedCtx: AudioContext | null = null;

// Only instantiates the AudioContext class inside user interaction gesture callback
function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (sharedCtx) return sharedCtx;
  
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContextClass) {
    try {
      sharedCtx = new AudioContextClass();
      console.log("AudioContext created successfully.");
    } catch (e) {
      console.warn("Failed to create AudioContext:", e);
    }
  }
  return sharedCtx;
}

// Global unlock event list
const unlockEvents = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];
let isInitialized = false;

// Remove event listeners once context is running
function removeUnlockListeners() {
  if (typeof window === 'undefined') return;
  unlockEvents.forEach(evt => {
    window.removeEventListener(evt, handleUnlock, true);
  });
  console.log("Unlock event listeners removed because AudioContext is running.");
}

const handleUnlock = () => {
  unlockAudio();
};

// Explicit initialization function to attach window capturing gesture listeners
export function initAudio() {
  if (typeof window === 'undefined') return;
  if (isInitialized) return;
  isInitialized = true;

  unlockEvents.forEach(evt => {
    window.addEventListener(evt, handleUnlock, true);
  });
  console.log("AudioManager initialized and touch capturing registered.");
  
  // Try to unlock immediately if already within a gesture
  unlockAudio();
}

// Function to unlock audio on first interaction
export function unlockAudio() {
  const ctx = getOrCreateAudioContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    const resumePromise = ctx.resume();
    if (resumePromise && typeof resumePromise.then === 'function') {
      resumePromise.then(() => {
        if (ctx.state === 'running') {
          removeUnlockListeners();
        }
      }).catch(err => {
        console.warn("Failed to resume AudioContext on gesture:", err);
      });
    } else {
      // Fallback for older browsers where resume() does not return a Promise
      setTimeout(() => {
        if (ctx.state === 'running') {
          removeUnlockListeners();
        }
      }, 100);
    }
  } else if (ctx.state === 'running') {
    removeUnlockListeners();
  }

  // Play a silent buffer to satisfy iOS Safari user-gesture requirements
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
    if (source.stop) {
      source.stop(0);
    }
  } catch (e) {
    console.warn("Failed to play silent buffer for unlock:", e);
  }
}

// Helper to safely play audio nodes synchronously on the shared AudioContext
function safePlay(playFn: (ctx: AudioContext) => void) {
  const ctx = getOrCreateAudioContext();
  if (!ctx) return;
  
  // Synchronously resume context in case it is suspended (allowed under user gesture)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(err => console.warn("Failed to resume:", err));
  }
  
  // Play sound synchronously to keep user gesture trust
  try {
    playFn(ctx);
  } catch (err) {
    console.warn("Audio playback failed:", err);
  }
}

export function playSuccessSound(delaySeconds: number = 0) {
  safePlay((ctx) => {
    const now = ctx.currentTime + delaySeconds;
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    playNote(523.25, now, 0.4);        // C5
    playNote(659.25, now + 0.08, 0.4);  // E5
    playNote(783.99, now + 0.16, 0.5);  // G5
    playNote(1046.50, now + 0.24, 0.6); // C6
  });
}

export function playVictorySound(delaySeconds: number = 0) {
  safePlay((ctx) => {
    const now = ctx.currentTime + delaySeconds;
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    playNote(523.25, now, 0.3);
    playNote(659.25, now + 0.06, 0.3);
    playNote(783.99, now + 0.12, 0.3);
    playNote(1046.50, now + 0.18, 0.4);
    playNote(1318.51, now + 0.24, 0.4);
    playNote(1567.98, now + 0.30, 0.6);
  });
}

export function playSelectionSound(delaySeconds: number = 0) {
  safePlay((ctx) => {
    const now = ctx.currentTime + delaySeconds;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  });
}

export function playCorrectSound(delaySeconds: number = 0) {
  safePlay((ctx) => {
    const now = ctx.currentTime + delaySeconds;
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    playNote(587.33, now, 0.25);
    playNote(880.00, now + 0.08, 0.35);
  });
}

export function playIncorrectSound(delaySeconds: number = 0) {
  safePlay((ctx) => {
    const now = ctx.currentTime + delaySeconds;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.4);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  });
}
