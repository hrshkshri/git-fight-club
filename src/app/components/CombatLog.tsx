'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface LogEntry {
  player: 1 | 2;
  move: string;
  damage: number;
}

export default function CombatLog({ log }: { log: LogEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-2xl h-48 bg-black/80 border-4 border-white pixel-border p-4 overflow-y-auto font-mono text-sm md:text-base mt-8 mx-auto"
      style={{ scrollBehavior: 'smooth' }}
    >
      <AnimatePresence>
        {log.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: entry.player === 1 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-2 flex items-center gap-2 ${entry.player === 1 ? 'text-neon-cyan flex-row' : 'text-red-400 flex-row-reverse'}`}
          >
            <span className="opacity-50 text-xs text-gray-400">[{i + 1}]</span> 
            <span className="font-bold"> P{entry.player}:</span> 
            <span>{entry.move}</span>
            <span className="text-neon-yellow font-bold"> -{entry.damage} HP</span>
          </motion.div>
        ))}
      </AnimatePresence>
      {log.length === 0 && (
        <div className="text-center text-gray-500 opacity-50 h-full flex items-center justify-center">
          AWAITING COMBAT INITIATION...
        </div>
      )}
    </div>
  );
}
