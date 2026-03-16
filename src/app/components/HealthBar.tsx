'use client';
import { motion } from 'framer-motion';

interface HealthBarProps {
  value: number;
  max: number;
  color: 'cyan' | 'red';
}

export default function HealthBar({ value, max, color }: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  
  // Dynamic coloring based on health percentage like a real fighting game
  let bgColor = color === 'cyan' ? 'bg-neon-cyan' : 'bg-red-500';
  let shadow = color === 'cyan' ? 'shadow-[0_0_10px_#00ffff]' : 'shadow-[0_0_10px_#ff0000]';

  if (percentage <= 25) {
    bgColor = 'bg-red-600';
    shadow = 'shadow-[0_0_15px_#dc2626] animate-pulse';
  } else if (percentage <= 50) {
    bgColor = 'bg-yellow-400';
    shadow = 'shadow-[0_0_10px_#facc15]';
  } else if (percentage <= 75) {
    bgColor = 'bg-green-400';
    shadow = 'shadow-[0_0_10px_#4ade80]';
  }
  
  const borderColor = color === 'cyan' ? 'border-teal-700' : 'border-red-900';

  return (
    <div className={`w-full h-8 border-4 ${borderColor} bg-gray-900 pixel-border p-1 relative overflow-hidden`}>
      <motion.div
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`h-full ${bgColor} ${shadow}`}
      />
    </div>
  );
}
