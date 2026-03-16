'use client';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-transparent text-neon-cyan">
      <motion.h2 
        className="text-2xl md:text-4xl font-display pixel-text text-center"
        animate={{ opacity: [1, 0, 1] }} 
        transition={{ duration: 1, repeat: Infinity }}
      >
        ANALYZING COMMITS...
      </motion.h2>
      <div className="w-64 h-6 border-4 border-neon-cyan p-1 pixel-border">
        <motion.div 
          className="h-full bg-neon-cyan"
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 2, ease: "linear", repeat: Infinity }}
        />
      </div>
    </div>
  );
}
