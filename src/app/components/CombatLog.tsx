'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface LogEntry { player: 1 | 2; move: string; damage: number; }

export default function CombatLog({ log }: { log: LogEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [log]);

  return (
    <div style={{ width: '100%', maxWidth: 860, margin: '0 auto', fontFamily: "'Press Start 2P', monospace" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ width: 6, height: 6, background: '#00ff00', boxShadow: '0 0 6px #00ff00' }} />
        <span style={{ fontSize: 7, color: '#00ff0066', letterSpacing: '0.2em' }}>BATTLE LOG</span>
        <div style={{ flex: 1, height: 1, background: '#00ff0022' }} />
        <span style={{ fontSize: 7, color: '#ffffff22' }}>{log.length} MOVES</span>
      </div>

      {/* Log body */}
      <div
        ref={ref}
        style={{
          height: 112, overflowY: 'auto', scrollBehavior: 'smooth',
          background: '#030303',
          border: '1px solid #141414',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9)',
        }}
      >
        {log.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.span
              style={{ fontSize: 7, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em' }}
              animate={{ opacity: [0.15, 0.6, 0.15] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AWAITING FIRST STRIKE...
            </motion.span>
          </div>
        ) : (
          <AnimatePresence>
            {log.map((entry, i) => {
              const isP1 = entry.player === 1;
              const col = isP1 ? '#4488ff' : '#ff4444';
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: isP1 ? -12 : 12, background: isP1 ? 'rgba(0,80,255,0.12)' : 'rgba(255,50,50,0.12)' }}
                  animate={{ opacity: 1, x: 0, background: 'transparent' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 10px',
                    borderBottom: '1px solid #0f0f0f',
                    flexDirection: isP1 ? 'row' : 'row-reverse',
                  }}
                >
                  <span style={{ fontSize: 6, color: col, border: `1px solid ${col}44`, padding: '1px 4px', background: `${col}10`, flexShrink: 0 }}>
                    P{entry.player}
                  </span>
                  <span style={{ fontSize: 9, color: col, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.move}
                  </span>
                  <span style={{ fontSize: 8, color: '#ffcc00', textShadow: '0 0 6px #ffcc00', flexShrink: 0 }}>
                    -{entry.damage}HP
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
