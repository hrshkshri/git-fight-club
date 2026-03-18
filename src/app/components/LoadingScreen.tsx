'use client';
import { motion } from 'framer-motion';

const STEPS = [
  'FETCHING GITHUB DATA...',
  'CALCULATING POWER LEVELS...',
  'GENERATING BATTLE SEQUENCE...',
  'PREPARING THE ARENA...',
];

export default function LoadingScreen() {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center gap-8 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 title-grid opacity-40" />

      {/* Glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#00ffff]/5 blur-3xl pointer-events-none" />

      {/* Title */}
      <motion.div
        className="font-display text-[#00ffff] text-xl md:text-3xl text-center z-10"
        style={{ textShadow: '0 0 15px #00ffff' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        GIT FIGHT CLUB
      </motion.div>

      {/* Main loading text */}
      <div className="z-10 flex flex-col items-center gap-6 w-full max-w-sm px-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step}
            className="w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.45, duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-1">
              <motion.div
                className="w-2 h-2 bg-[#00ff00] shrink-0"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.45 }}
              />
              <span className="font-display text-[8px] text-[#00ff00] tracking-wider">{step}</span>
            </div>
            <motion.div
              className="w-full h-3 bg-[#0a0a0a] border border-[#00ff00]/40 overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.45, duration: 0.3, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            >
              <motion.div
                className="h-full bg-[#00ff00] shadow-[0_0_8px_#00ff00]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  delay: i * 0.45 + 0.1,
                  duration: 1.8,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Blinking ready */}
      <motion.div
        className="z-10 font-display text-[10px] text-[#ffff00] tracking-[0.3em] mt-4"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      >
        PLEASE WAIT...
      </motion.div>
    </div>
  );
}
