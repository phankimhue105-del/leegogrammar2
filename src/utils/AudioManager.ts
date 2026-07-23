let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (sharedCtx) return sharedCtx;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContextClass) {
    sharedCtx = new AudioContextClass();
  }
  return sharedCtx;
}

// Function to unlock audio on user gesture
export function unlockAudio() {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      console.log("AudioContext resumed successfully via interaction");
    }).catch(err => {
      console.warn("Failed to resume AudioContext", err);
    });
  }

  // Play a silent buffer to fully unlock iOS audio
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
    console.warn("Failed to play silent buffer for unlock", e);
  }
}

// Setup global event listeners to unlock on first gesture
if (typeof window !== 'undefined') {
  const unlockEvents = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];
  const handleUnlock = () => {
    unlockAudio();
    unlockEvents.forEach(evt => {
      window.removeEventListener(evt, handleUnlock, true);
    });
  };
  unlockEvents.forEach(evt => {
    window.addEventListener(evt, handleUnlock, true);
  });
}

function safePlay(playFn: (ctx: AudioContext) => void) {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      try {
        playFn(ctx);
      } catch (err) {
        console.warn("Playback failed after resume", err);
      }
    }).catch(err => {
      console.warn("Could not resume context to play sound", err);
    });
  } else {
    try {
      playFn(ctx);
    } catch (err) {
      console.warn("Playback failed", err);
    }
  }
}

export function playSuccessSound() {
  safePlay((ctx) => {
    const now = ctx.currentTime;
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

export function playVictorySound() {
  safePlay((ctx) => {
    const now = ctx.currentTime;
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

export function playSelectionSound() {
  safePlay((ctx) => {
    const now = ctx.currentTime;
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

export function playCorrectSound() {
  safePlay((ctx) => {
    const now = ctx.currentTime;
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

export function playIncorrectSound() {
  safePlay((ctx) => {
    const now = ctx.currentTime;
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

