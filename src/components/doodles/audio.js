// High-Fidelity Synthesized Camera & Photography Audio Engine for ArjuVisuals.co
// Authentic camera capture shutter sounds, zero knocking/thudding bass, Web Audio API,
// user gesture unlock, master compressor/limiter, and studio-grade tactile sound effects.

let audioCtx = null;
let masterCompressor = null;
let masterGain = null;
let isAudioMuted = false;
let isAudioUnlocked = false;

// Check localStorage for saved mute preference
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("arju_doodle_muted");
    if (saved !== null) {
      isAudioMuted = saved === "true";
    }
  } catch {
    // ignore
  }
}

export function getIsMuted() {
  return isAudioMuted;
}

export function setMuted(muted) {
  isAudioMuted = Boolean(muted);
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("arju_doodle_muted", String(isAudioMuted));
    }
  } catch {
    // ignore
  }
  return isAudioMuted;
}

export function toggleMute() {
  return setMuted(!isAudioMuted);
}

// Seamless one-time user-gesture unlock for AudioContext
function unlockAudio() {
  if (isAudioUnlocked) return;
  const ctx = getAudioContext(false);
  if (ctx && ctx.state === "suspended") {
    ctx.resume().then(() => {
      isAudioUnlocked = true;
    }).catch(() => {});
  } else if (ctx && ctx.state === "running") {
    isAudioUnlocked = true;
  }
}

if (typeof window !== "undefined") {
  const handleFirstInteraction = () => {
    unlockAudio();
    window.removeEventListener("pointerdown", handleFirstInteraction);
    window.removeEventListener("keydown", handleFirstInteraction);
    window.removeEventListener("touchstart", handleFirstInteraction);
  };
  window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });
  window.addEventListener("keydown", handleFirstInteraction, { passive: true });
  window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
}

function getAudioContext(autoResume = true) {
  if (typeof window === "undefined" || isAudioMuted) return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    try {
      audioCtx = new AudioContextClass();

      // Master Compressor & Limiter to eliminate clipping, pops, and distortion
      masterCompressor = audioCtx.createDynamicsCompressor();
      masterCompressor.threshold.setValueAtTime(-14, audioCtx.currentTime);
      masterCompressor.knee.setValueAtTime(24, audioCtx.currentTime);
      masterCompressor.ratio.setValueAtTime(8, audioCtx.currentTime);
      masterCompressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
      masterCompressor.release.setValueAtTime(0.15, audioCtx.currentTime);

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

      masterCompressor.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    } catch {
      return null;
    }
  }

  if (autoResume && audioCtx.state === "suspended") {
    audioCtx.resume().then(() => {
      isAudioUnlocked = true;
    }).catch(() => {});
  }

  return audioCtx;
}

function getDestination(ctx) {
  return masterCompressor || ctx.destination;
}

// 1. Authentic Photography Capture Sound ("TSH-KLICK!")
// Fast high-frequency mechanical focal-plane shutter (no low-frequency thud or knocking)
export function playShutterSound() {
  try {
    const ctx = getAudioContext(true);
    if (!ctx || ctx.state !== "running") return;

    const dest = getDestination(ctx);
    const now = ctx.currentTime;

    // --- 1A. First Curtain Trip / Snick (0 to 12ms) ---
    // High-frequency noise snap (high-pass at 2800Hz, bandpass at 5200Hz)
    const snapBufferSize = Math.floor(ctx.sampleRate * 0.015); // 15ms
    const snapBuffer = ctx.createBuffer(1, snapBufferSize, ctx.sampleRate);
    const snapData = snapBuffer.getChannelData(0);
    for (let i = 0; i < snapBufferSize; i++) {
      snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (snapBufferSize * 0.2));
    }

    const snapNoise = ctx.createBufferSource();
    snapNoise.buffer = snapBuffer;

    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = "highpass";
    snapFilter.frequency.setValueAtTime(2600, now);

    const snapBand = ctx.createBiquadFilter();
    snapBand.type = "bandpass";
    snapBand.frequency.setValueAtTime(5200, now);
    snapBand.Q.setValueAtTime(2.2, now);

    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0.26, now);
    snapGain.gain.linearRampToValueAtTime(0.0001, now + 0.014);

    snapNoise.connect(snapFilter);
    snapFilter.connect(snapBand);
    snapBand.connect(snapGain);
    snapGain.connect(dest);
    snapNoise.start(now);

    // High-pitched metallic leaf click (drops quickly from 4800Hz to 2400Hz — stays high, zero bass)
    const snapOsc = ctx.createOscillator();
    const snapOscGain = ctx.createGain();
    snapOsc.type = "triangle";
    snapOsc.frequency.setValueAtTime(4800, now);
    snapOsc.frequency.exponentialRampToValueAtTime(2200, now + 0.012);

    snapOscGain.gain.setValueAtTime(0.18, now);
    snapOscGain.gain.linearRampToValueAtTime(0.0001, now + 0.012);

    snapOsc.connect(snapOscGain);
    snapOscGain.connect(dest);
    snapOsc.start(now);
    snapOsc.stop(now + 0.014);

    // --- 1B. Shutter Curtain Transit Whisper (10ms to 36ms) ---
    // Delicate high-frequency airy shimmer of polished curtain blades sliding
    const whisperSize = Math.floor(ctx.sampleRate * 0.026);
    const whisperBuffer = ctx.createBuffer(1, whisperSize, ctx.sampleRate);
    const whisperData = whisperBuffer.getChannelData(0);
    for (let i = 0; i < whisperSize; i++) {
      whisperData[i] = (Math.random() * 2 - 1) * (1 - i / whisperSize);
    }
    const whisperNoise = ctx.createBufferSource();
    whisperNoise.buffer = whisperBuffer;

    const whisperFilter = ctx.createBiquadFilter();
    whisperFilter.type = "bandpass";
    whisperFilter.frequency.setValueAtTime(6200, now + 0.008);
    whisperFilter.Q.setValueAtTime(3.0, now + 0.008);

    const whisperGain = ctx.createGain();
    whisperGain.gain.setValueAtTime(0.0001, now);
    whisperGain.gain.setValueAtTime(0.08, now + 0.008);
    whisperGain.gain.linearRampToValueAtTime(0.0001, now + 0.034);

    whisperNoise.connect(whisperFilter);
    whisperFilter.connect(whisperGain);
    whisperGain.connect(dest);
    whisperNoise.start(now + 0.008);

    // --- 1C. Second Curtain Catch / Iconic Crisp "CLICK!" (38ms to 58ms) ---
    const clickTime = now + 0.038;

    const clickBufferSize = Math.floor(ctx.sampleRate * 0.018);
    const clickBuffer = ctx.createBuffer(1, clickBufferSize, ctx.sampleRate);
    const clickData = clickBuffer.getChannelData(0);
    for (let i = 0; i < clickBufferSize; i++) {
      clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickBufferSize * 0.25));
    }
    const clickNoise = ctx.createBufferSource();
    clickNoise.buffer = clickBuffer;

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = "highpass";
    clickFilter.frequency.setValueAtTime(3200, clickTime);

    const clickBand = ctx.createBiquadFilter();
    clickBand.type = "bandpass";
    clickBand.frequency.setValueAtTime(4600, clickTime);
    clickBand.Q.setValueAtTime(3.5, clickTime);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.setValueAtTime(0.3, clickTime);
    clickGain.gain.linearRampToValueAtTime(0.0001, clickTime + 0.016);

    clickNoise.connect(clickFilter);
    clickFilter.connect(clickBand);
    clickBand.connect(clickGain);
    clickGain.connect(dest);
    clickNoise.start(clickTime);

    // Crisp high metallic catch resonance
    const clickOsc = ctx.createOscillator();
    const clickOscGain = ctx.createGain();
    clickOsc.type = "sine";
    clickOsc.frequency.setValueAtTime(3600, clickTime);
    clickOsc.frequency.exponentialRampToValueAtTime(2400, clickTime + 0.015);

    clickOscGain.gain.setValueAtTime(0.0001, now);
    clickOscGain.gain.setValueAtTime(0.2, clickTime);
    clickOscGain.gain.linearRampToValueAtTime(0.0001, clickTime + 0.016);

    clickOsc.connect(clickOscGain);
    clickOscGain.connect(dest);
    clickOsc.start(clickTime);
    clickOsc.stop(clickTime + 0.02);
  } catch {
    // safely ignore
  }
}

// 2. Camera with Flash Shutter Sound: Crisp capture + subtle high-voltage electronic flash pop
export function playFlashShutterSound() {
  try {
    playShutterSound();
    const ctx = getAudioContext(true);
    if (!ctx || ctx.state !== "running") return;
    const dest = getDestination(ctx);
    const now = ctx.currentTime;

    // Subtle high-frequency flash ionization "tzz" pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(5200, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.02);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // ignore
  }
}

// 3. Playful Bird Chirp ("Smile for the birdie!")
export function playChirpSound() {
  try {
    const ctx = getAudioContext(true);
    if (!ctx || ctx.state !== "running") return;

    const dest = getDestination(ctx);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2100, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.11);

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.13);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.14);
  } catch {
    // ignore
  }
}

// 4. Electronic Autofocus Double-Beep: "BEEP-BEEP" (Camera lock)
export function playFocusBeepSound() {
  try {
    const ctx = getAudioContext(true);
    if (!ctx || ctx.state !== "running") return;

    const dest = getDestination(ctx);
    const now = ctx.currentTime;

    const playBeep = (startTime) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2450, startTime);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.setValueAtTime(0.075, startTime);
      gain.gain.linearRampToValueAtTime(0.0001, startTime + 0.04);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(startTime);
      osc.stop(startTime + 0.045);
    };

    playBeep(now);
    playBeep(now + 0.068);
  } catch {
    // ignore
  }
}

// 5. Mechanical Film Winder Ratchet Click
export function playFilmAdvanceSound() {
  try {
    const ctx = getAudioContext(true);
    if (!ctx || ctx.state !== "running") return;

    const dest = getDestination(ctx);
    const now = ctx.currentTime;

    for (let i = 0; i < 4; i++) {
      const clickTime = now + i * 0.038;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1800 + i * 140, clickTime);
      osc.frequency.exponentialRampToValueAtTime(800, clickTime + 0.015);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.setValueAtTime(0.09, clickTime);
      gain.gain.linearRampToValueAtTime(0.0001, clickTime + 0.015);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(clickTime);
      osc.stop(clickTime + 0.018);
    }
  } catch {
    // ignore
  }
}

// 6. Warm Bubble Pop
export function playPopSound() {
  try {
    const ctx = getAudioContext(true);
    if (!ctx || ctx.state !== "running") return;

    const dest = getDestination(ctx);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.07);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.078);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.082);
  } catch {
    // ignore
  }
}

// 7. Delicate Star Twinkle Chime (Arpeggiated)
export function playTwinkleSound() {
  try {
    const ctx = getAudioContext(true);
    if (!ctx || ctx.state !== "running") return;

    const dest = getDestination(ctx);
    const now = ctx.currentTime;

    const notes = [1760, 2637, 3520]; // A6, E7, A7
    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.038;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.setValueAtTime(0.065, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.19);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(noteTime);
      osc.stop(noteTime + 0.2);
    });
  } catch {
    // ignore
  }
}

// 8. Tactile Camera Mode Dial Click (Crisp mechanical detent)
let lastDialTime = 0;
export function playDialTickSound() {
  try {
    const nowStamp = Date.now();
    if (nowStamp - lastDialTime < 120) return;
    lastDialTime = nowStamp;

    const ctx = getAudioContext(false);
    if (!ctx || ctx.state !== "running") return;

    const dest = getDestination(ctx);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.012);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.012);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.015);
  } catch {
    // ignore
  }
}

// 9. Film Roll Celebration Fanfare (Major 7th Chord Arpeggio)
export function playCelebrationSound() {
  try {
    const ctx = getAudioContext(true);
    if (!ctx || ctx.state !== "running") return;

    const dest = getDestination(ctx);
    const now = ctx.currentTime;

    const chord = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
    chord.forEach((freq, idx) => {
      const noteTime = now + idx * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.setValueAtTime(0.1, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.42);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  } catch {
    // ignore
  }
}
