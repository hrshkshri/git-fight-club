'use client';

import { useRef, useState, useEffect } from 'react';

export default function useAudio() {
  const contextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Initialize user context precisely once on user interaction context where possible
    contextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }, []);

  const playSound = (type: 'punch' | 'explosion' | 'victory' | 'defeat') => {
    if (!soundEnabled || !contextRef.current) return;

    // Reactivate suspended audio context if needed
    if (contextRef.current.state === 'suspended') {
      contextRef.current.resume();
    }

    const ctx = contextRef.current;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'punch':
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'explosion':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.3);

        // create noise
        const noiseGen = ctx.createBufferSource();
        const bufferSize = ctx.sampleRate * 0.3; 
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        noiseGen.buffer = buffer;
        
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 1000;
        
        noiseGen.connect(noiseFilter);
        noiseFilter.connect(gain);
        
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc.start(now);
        noiseGen.start(now);
        osc.stop(now + 0.3);
        noiseGen.stop(now + 0.3);
        break;

      case 'victory':
        // Arpeggio up
        const victoryNotes = [392.00, 523.25, 659.25, 783.99, 1046.50];
        victoryNotes.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'square';
          o.frequency.value = freq;
          o.connect(g);
          g.connect(ctx.destination);
          g.gain.setValueAtTime(0.3, now + i * 0.12);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.3);
          o.start(now + i * 0.12);
          o.stop(now + i * 0.12 + 0.3);
        });
        break;

      case 'defeat':
        // Descending tones
        const defeatNotes = [440, 392, 349.23, 329.63, 293.66];
        defeatNotes.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sawtooth';
          o.frequency.value = freq;
          o.connect(g);
          g.connect(ctx.destination);
          g.gain.setValueAtTime(0.4, now + i * 0.2);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.4);
          o.start(now + i * 0.2);
          o.stop(now + i * 0.2 + 0.4);
        });
        break;
    }
  };

  return {
    playSound,
    soundEnabled,
    toggleSound: () => {
      if (contextRef.current?.state === 'suspended') {
        contextRef.current.resume();
      }
      setSoundEnabled(!soundEnabled);
    }
  };
}
