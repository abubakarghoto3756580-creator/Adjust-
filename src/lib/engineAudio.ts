/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Web Audio Engine Sound Synthesizer
export function playEngineRev() {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  const ctx = new AudioContextClass();
  
  // 1. Create main oscillators for cylinders
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const subOsc = ctx.createOscillator();

  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';
  subOsc.type = 'triangle';

  // 2. Base Idle Frequency around 75-80 Hz (simulating ~800 RPM)
  osc1.frequency.setValueAtTime(75, ctx.currentTime);
  osc2.frequency.setValueAtTime(75.5, ctx.currentTime); // slightly detuned for chorus grit
  subOsc.frequency.setValueAtTime(37.5, ctx.currentTime); // sub rumble

  // 3. Cylinder firing amplitude modulation (Tremolo)
  const tremolo = ctx.createOscillator();
  tremolo.type = 'sine';
  tremolo.frequency.setValueAtTime(14, ctx.currentTime); // 14Hz mod represents engine vibration

  const tremoloGain = ctx.createGain();
  tremoloGain.gain.setValueAtTime(0.15, ctx.currentTime);

  tremolo.connect(tremoloGain);

  // 4. Low Pass Filter to make it deep, throaty, and remove high-end sizzle
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(260, ctx.currentTime);
  filter.Q.setValueAtTime(3, ctx.currentTime);

  // 5. Main gain node & compressor for loudness
  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(0, ctx.currentTime); // start silent

  // Connect nodes
  osc1.connect(filter);
  osc2.connect(filter);
  subOsc.connect(filter);

  // Modulate filter frequency slightly with tremolo for intake modulation
  tremoloGain.connect(filter.frequency);

  filter.connect(mainGain);
  mainGain.connect(ctx.destination);

  // Start oscillators
  osc1.start(0);
  osc2.start(0);
  subOsc.start(0);
  tremolo.start(0);

  const now = ctx.currentTime;

  // --- ENGINE ENVELOPE DYNAMICS ---
  // A. Ignition / Starter Motor (Rapid spark sound)
  mainGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
  
  // Pitch rises briefly during start up
  osc1.frequency.exponentialRampToValueAtTime(120, now + 0.2);
  osc2.frequency.exponentialRampToValueAtTime(121, now + 0.2);
  subOsc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
  filter.frequency.exponentialRampToValueAtTime(380, now + 0.2);

  // B. Fall back to idle rumble
  mainGain.gain.setValueAtTime(0.3, now + 0.4);
  osc1.frequency.exponentialRampToValueAtTime(70, now + 0.5);
  osc2.frequency.exponentialRampToValueAtTime(70.5, now + 0.5);
  subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.5);
  filter.frequency.exponentialRampToValueAtTime(180, now + 0.5);

  // C. THE BIG REV (Accelerate up to ~7200 RPM, high pitch, wide filter)
  const revTime = now + 1.1;
  osc1.frequency.exponentialRampToValueAtTime(360, revTime); // big pitch sweep
  osc2.frequency.exponentialRampToValueAtTime(363, revTime);
  subOsc.frequency.exponentialRampToValueAtTime(180, revTime);
  filter.frequency.exponentialRampToValueAtTime(950, revTime); // open up intake filter
  mainGain.gain.linearRampToValueAtTime(0.65, revTime); // louder as it revs
  tremolo.frequency.exponentialRampToValueAtTime(45, revTime); // faster combustion vibration

  // D. Redline bounce (rapid rev limiter flutter at max RPM)
  const rNow = revTime;
  for (let i = 0; i < 4; i++) {
    const bTime = rNow + i * 0.12;
    mainGain.gain.setValueAtTime(0.65, bTime);
    mainGain.gain.linearRampToValueAtTime(0.1, bTime + 0.05); // cutoff fuel
    osc1.frequency.setValueAtTime(360, bTime);
    osc1.frequency.linearRampToValueAtTime(340, bTime + 0.05);
  }

  // E. Exhaust Pop and Burble on Deceleration
  const popTime = rNow + 0.48;
  mainGain.gain.setValueAtTime(0.55, popTime);
  // deceleration drop
  osc1.frequency.exponentialRampToValueAtTime(65, popTime + 1.0);
  osc2.frequency.exponentialRampToValueAtTime(65.5, popTime + 1.0);
  subOsc.frequency.exponentialRampToValueAtTime(32, popTime + 1.0);
  filter.frequency.exponentialRampToValueAtTime(140, popTime + 1.0);
  tremolo.frequency.exponentialRampToValueAtTime(12, popTime + 1.0);

  // Fade out completely at the end
  mainGain.gain.setValueAtTime(0.25, popTime + 1.2);
  mainGain.gain.exponentialRampToValueAtTime(0.0001, popTime + 2.0);

  // Stop oscillators after playback is complete
  osc1.stop(popTime + 2.1);
  osc2.stop(popTime + 2.1);
  subOsc.stop(popTime + 2.1);
  tremolo.stop(popTime + 2.1);
}
