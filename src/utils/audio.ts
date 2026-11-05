/**
 * Simple Web Audio API chime synthesizer for cooking timer
 * Zero external audio files required, works offline and hermetically.
 */
export function playChimeSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    
    // Play two-tone pleasant kitchen chime (E5 -> G#5 -> B5)
    const tones = [
      { freq: 659.25, start: 0, duration: 0.35 },
      { freq: 830.61, start: 0.2, duration: 0.4 },
      { freq: 987.77, start: 0.4, duration: 0.6 },
    ];

    tones.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.2, now + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
}
