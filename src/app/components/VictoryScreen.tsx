'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function VictoryScreen({ battle }: { battle: any }) {
  const router = useRouter();
  const winnerName = battle.winner === 1 ? battle.player1.username : battle.player2.username;
  const winnerColor = battle.winner === 1 ? 'text-neon-cyan' : 'text-red-500';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-12 bg-black/90 z-50 fixed inset-0">
      {/* Confetti / Celebration could go here */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ type: "spring", duration: 1 }}
        className="space-y-4 relative"
      >
        <h1 className="text-6xl md:text-9xl font-display text-neon-yellow pixel-text neon-glow">
          K.O.
        </h1>
        <h2 className={`text-4xl md:text-7xl font-display ${winnerColor} pixel-text mt-8`}>
          {winnerName} WINS!
        </h2>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-24 text-xl font-mono mt-12 bg-gray-900 border-4 border-white pixel-border p-8">
        <div className="text-neon-cyan space-y-2">
          <p className="font-bold text-2xl">P1: {battle.player1.username}</p>
          <p className="opacity-80">Power: {battle.player1.powerLevel}</p>
          <p className="opacity-80">HP Left: {battle.player1.finalHp}</p>
        </div>
        <div className="text-red-500 space-y-2">
          <p className="font-bold text-2xl">P2: {battle.player2.username}</p>
          <p className="opacity-80">Power: {battle.player2.powerLevel}</p>
          <p className="opacity-80">HP Left: {battle.player2.finalHp}</p>
        </div>
      </div>

      <motion.button
        onClick={() => router.push('/')}
        className="mt-16 px-8 py-4 bg-white text-black font-display text-xl md:text-2xl pixel-border border-4 border-gray-400 hover:bg-neon-cyan hover:border-black transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        NEW BATTLE
      </motion.button>
    </div>
  );
}
