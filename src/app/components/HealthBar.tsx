'use client';
import { motion } from 'framer-motion';

interface HealthBarProps {
  value: number;
  max: number;
  color: 'cyan' | 'red';
}

export default function HealthBar({ value, max, color }: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  const bgColor = color === 'cyan' ? 'bg-neon-cyan' : 'bg-red-500';
  const borderColor = color === 'cyan' ? 'border-teal-700' : 'border-red-900';

  return (
    <div className={`w-full h-8 border-4 ${borderColor} bg-gray-900 pixel-border p-1`}>
      <motion.div
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`h-full ${bgColor} shadow-[0_0_10px_currentColor]`}
      />
    </div>
  );
}
