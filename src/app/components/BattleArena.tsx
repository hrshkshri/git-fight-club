'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HealthBar from './HealthBar';
import CombatLog from './CombatLog';
import VictoryScreen from './VictoryScreen';
import useAudio from '@/lib/hooks/useAudio';

interface Battle {
  player1: { username: string; powerLevel: number; maxHp: number; finalHp: number };
  player2: { username: string; powerLevel: number; maxHp: number; finalHp: number };
  battleSequence: Array<{ turn: number; player: 1 | 2; move: string; damage: number }>;
  winner: 1 | 2;
}

export default function BattleArena({ battle }: { battle: Battle }) {
  const [currentTurn, setCurrentTurn] = useState(-1);
  const [p1Hp, setP1Hp] = useState(battle.player1.maxHp);
  const [p2Hp, setP2Hp] = useState(battle.player2.maxHp);
  const [gameState, setGameState] = useState<'intro' | 'battle' | 'victory'>('intro');
  const [screenShake, setScreenShake] = useState(false);
  const [combatLog, setCombatLog] = useState<Array<{ player: 1 | 2; move: string; damage: number }>>([]);
  const [activeAttacker, setActiveAttacker] = useState<1 | 2 | null>(null);

  const { playSound, soundEnabled, toggleSound, initAudio } = useAudio();

  useEffect(() => {
    if (gameState !== 'battle') return;

    // Start playing the sequence next turn
    const nextTurn = currentTurn + 1;
    
    if (nextTurn < battle.battleSequence.length) {
      const timer = setTimeout(() => {
        const turn = battle.battleSequence[nextTurn];
        const damage = turn.damage;

        setActiveAttacker(turn.player);

        // Play sound effect based on text
        playSound(turn.move.includes('Power') || turn.move.includes('Strike') || turn.move.includes('Slam') ? 'explosion' : 'punch');

        // Screen shake
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 200);

        // Apply damage visually
        if (turn.player === 1) {
          setP2Hp(prev => Math.max(0, prev - damage));
        } else {
          setP1Hp(prev => Math.max(0, prev - damage));
        }

        // Add to log
        setCombatLog(prev => [...prev, { player: turn.player, move: turn.move, damage }]);

        // Advance turn counter
        setCurrentTurn(nextTurn);
        
        // Reset attacker animation state
        setTimeout(() => setActiveAttacker(null), 500); 

      }, 2000); // 2 second delay between turns
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setGameState('victory');
        playSound('victory');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentTurn, battle.battleSequence, playSound]);

  useEffect(() => {
    if (gameState === 'intro') {
      const timer = setTimeout(() => setGameState('battle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  if (gameState === 'victory') {
    return <VictoryScreen battle={battle} />;
  }

  if (gameState === 'intro') {
    return (
      <motion.div
        className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center space-y-12 absolute inset-0 z-[100] p-4 font-display text-center m-0"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={() => {
          // Force audio context initialization on user interaction (fixes Safari/Chrome autoplay policy)
          initAudio();
        }}
      >
        <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black pixel-text text-neon-magenta neon-glow">GET READY</h2>
        <div className="text-xl sm:text-2xl md:text-4xl flex flex-col items-center gap-6 mt-12 bg-gray-900 border-4 border-white pixel-border p-8 w-full max-w-2xl mx-auto">
            <span className="text-neon-cyan truncate max-w-full text-center px-4">{battle.player1.username}</span> 
            <span className="text-neon-yellow italic drop-shadow-[0_0_10px_yellow]">VS</span> 
            <span className="text-red-500 truncate max-w-full text-center px-4">{battle.player2.username}</span>
        </div>
        <p className="text-gray-500 animate-pulse mt-8 text-sm">Click anywhere to start audio...</p>
      </motion.div>
    );
  }

  const shakeStyle = screenShake
    ? { transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)` }
    : { transform: 'translate(0px, 0px)' };

  return (
    <div className="min-h-screen w-full bg-transparent text-white font-mono flex flex-col transition-transform duration-75 relative" style={shakeStyle}>
      {/* Sound Toggle */}
      <button
        onClick={toggleSound}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-black border-2 border-white pixel-border text-xs md:text-sm hover:bg-white hover:text-black transition-colors font-display"
      >
        AUDIO: {soundEnabled ? 'ON' : 'OFF'}
      </button>

      {/* Battle Header */}
      <div className="flex justify-between items-start pt-16 px-4 md:px-12 w-full max-w-7xl mx-auto">
        {/* Player 1 */}
        <div className="space-y-3 w-5/12 text-left">
          <h3 className="text-xl sm:text-2xl md:text-4xl text-neon-cyan font-display truncate py-2 lg:px-4 bg-black/50 border-white inline-block">{battle.player1.username}</h3>
          <HealthBar value={p1Hp} max={battle.player1.maxHp} color="cyan" />
          <p className="text-sm md:text-base opacity-80 pt-2 font-display text-neon-cyan">POWER: {battle.player1.powerLevel}</p>
        </div>

        {/* VS Indicator */}
        <motion.div 
            className="text-3xl md:text-6xl font-black text-neon-yellow font-display self-center italic pixel-text w-2/12 text-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
        >
            VS
        </motion.div>

        {/* Player 2 */}
        <div className="space-y-3 w-5/12 text-right flex flex-col items-end">
          <h3 className="text-xl sm:text-2xl md:text-4xl text-red-500 font-display truncate py-2 lg:px-4 bg-black/50 border-white inline-block">{battle.player2.username}</h3>
          <HealthBar value={p2Hp} max={battle.player2.maxHp} color="red" />
          <p className="text-sm md:text-base opacity-80 pt-2 font-display text-red-500">POWER: {battle.player2.powerLevel}</p>
        </div>
      </div>

      {/* Arena Sprites Area */}
      <div className="flex-1 flex justify-between items-center px-4 md:px-32 relative mt-4 md:mt-12 max-w-5xl mx-auto w-full">
          {/* Mock Sprite 1 */}
          <motion.div 
             className="w-24 h-32 md:w-48 md:h-64 bg-neon-cyan border-4 border-white pixel-border shadow-[0_0_30px_#00ffff]"
             animate={activeAttacker === 1 ? { x: [0, 100, 0], scale: [1, 1.2, 1] } : { y: [0, -10, 0] }}
             transition={activeAttacker === 1 ? { duration: 0.3 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Mock Sprite 2 */}
          <motion.div 
             className="w-24 h-32 md:w-48 md:h-64 bg-red-600 border-4 border-white pixel-border shadow-[0_0_30px_#ff0000]"
             animate={activeAttacker === 2 ? { x: [0, -100, 0], scale: [1, 1.2, 1] } : { y: [0, -10, 0], transition: { delay: 0.5 } }}
             transition={activeAttacker === 2 ? { duration: 0.3 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
      </div>

      {/* Combat Log Drawer */}
      <div className="pb-8 px-4 w-full">
        <CombatLog log={combatLog} />
      </div>
    </div>
  );
}
