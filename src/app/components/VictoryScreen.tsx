'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function VictoryScreen({ battle }: { battle: any }) {
  const router = useRouter();
  const winnerName = battle.winner === 1 ? battle.player1.username : battle.player2.username;
  const winnerColor = battle.winner === 1 ? 'text-neon-cyan' : 'text-red-500';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-center bg-black fixed inset-0 z-[100] m-0 overflow-y-auto pt-24 pb-12">
      {/* Confetti overlay */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="space-y-4 relative"
      >
        <h1 className="text-6xl md:text-9xl font-display text-neon-yellow pixel-text neon-glow">
          K.O.
        </h1>
        <h2 className={`text-3xl md:text-5xl lg:text-7xl font-display ${winnerColor} pixel-text mt-8 px-4 break-words max-w-4xl leading-tight`}>
          {winnerName} WINS!
        </h2>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-24 text-xl font-mono mt-16 bg-gray-900 border-4 border-white pixel-border p-8 max-w-4xl w-full mx-auto justify-center">
        <div className="text-neon-cyan flex flex-col items-center space-y-4">
          <p className="font-display text-lg md:text-2xl text-center w-full break-all">P1<br/><span className="mt-2 block opacity-80">{battle.player1.username}</span></p>
          <div className="h-px w-full bg-neon-cyan opacity-50 my-2"></div>
          <p className="opacity-80">SCORE: {battle.player1.powerLevel}</p>
          <p className="opacity-80">HP: {battle.player1.finalHp}</p>
        </div>
        <div className="text-red-500 flex flex-col items-center space-y-4">
          <p className="font-display text-lg md:text-2xl text-center w-full break-all">P2<br/><span className="mt-2 block opacity-80">{battle.player2.username}</span></p>
          <div className="h-px w-full bg-red-500 opacity-50 my-2"></div>
          <p className="opacity-80">SCORE: {battle.player2.powerLevel}</p>
          <p className="opacity-80">HP: {battle.player2.finalHp}</p>
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
