'use client';
import { motion } from 'framer-motion';

interface HealthBarProps {
  value: number;
  max: number;
  color: 'cyan' | 'red';
  reverse?: boolean;
}

export default function HealthBar({ value, max, color, reverse = false }: HealthBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  let fill: string;
  let glow: string;
  let pulse = false;

  if (pct > 55) {
    fill = color === 'cyan' ? '#4488ff' : '#ff3333';
    glow = color === 'cyan' ? '#4488ff'  : '#ff3333';
  } else if (pct > 25) {
    fill = '#ffcc00';
    glow = '#ffcc00';
  } else {
    fill = '#ff2200';
    glow = '#ff2200';
    pulse = true;
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Track */}
      <div style={{
        width: '100%', height: 16,
        background: '#0a0a0a',
        border: `2px solid ${fill}44`,
        boxShadow: `0 0 6px ${glow}30`,
        position: 'relative',
        overflow: 'hidden',
        direction: reverse ? 'rtl' : 'ltr',
      }}>
        {/* Chunk separators */}
        <div className="hp-chunks absolute inset-0 z-10 pointer-events-none" />

        {/* Fill */}
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: fill,
            boxShadow: `0 0 8px ${glow}, inset 0 1px 0 rgba(255,255,255,0.25)`,
            animation: pulse ? 'pulsate 0.5s ease-in-out infinite' : undefined,
          }}
        />
      </div>
    </div>
  );
}
