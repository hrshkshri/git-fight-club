'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

export default function SetupScreen() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleBattle = async () => {
    if (!player1 || !player2) {
      setError('ENTER BOTH GITHUB USERNAMES TO PROCEED.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1Username: player1,
          player2Username: player2
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'BATTLE CREATION FAILED');

      router.push(`/battle/${data.battleId}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center space-y-12 p-4"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-display text-neon-magenta neon-glow pixel-text">
          GIT FIGHT<br/>CLUB
        </h1>
        <p className="text-lg md:text-xl text-neon-cyan font-mono tracking-widest text-shadow">A BATTLE OF COMMITS</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center mt-12 w-full max-w-4xl justify-center">
        <div className="space-y-3 w-full max-w-xs">
          <label className="text-neon-cyan font-display text-xs md:text-sm block">PLAYER 1 (GITHUB)</label>
          <input
            type="text"
            placeholder="Username"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border-4 border-neon-cyan text-white pixel-border font-mono text-xl focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="text-4xl font-display text-white italic">VS</div>

        <div className="space-y-3 w-full max-w-xs">
          <label className="text-red-500 font-display text-xs md:text-sm block">PLAYER 2 (GITHUB)</label>
          <input
            type="text"
            placeholder="Username"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border-4 border-red-500 text-white pixel-border font-mono text-xl focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>

      <motion.button
        onClick={handleBattle}
        disabled={loading}
        className="mt-12 px-8 py-4 bg-neon-yellow text-black font-display text-xl md:text-2xl border-4 border-yellow-600 pixel-border hover:bg-white hover:border-black transition-all shadow-[0_0_20px_rgba(255,255,0,0.5)]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        FIGHT
      </motion.button>

      {error && <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 font-display text-center max-w-lg mt-4 bg-black/50 p-4 border-2 border-red-500"
      >
        {error}
      </motion.p>}
    </motion.div>
  );
}
