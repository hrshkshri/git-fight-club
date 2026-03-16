'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HealthBar from './HealthBar';
import CombatLog from './CombatLog';
import VictoryScreen from './VictoryScreen';
import useAudio from '@/lib/hooks/useAudio';
import CharacterSprite from './CharacterSprite';

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
  const [activeDefender, setActiveDefender] = useState<1 | 2 | null>(null);
  const [activePopup, setActivePopup] = useState<{ attacker: 1 | 2; move: string; damage: number } | null>(null);

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
        const defender = turn.player === 1 ? 2 : 1;
        
        // Setup popups
        setActivePopup({ attacker: turn.player, move: turn.move, damage: turn.damage });
        
        // Delay defender hit reaction slightly to sync with attack lunging
        setTimeout(() => setActiveDefender(defender), 150);

        // Play sound effect based on text
        playSound(turn.move.includes('Power') || turn.move.includes('Strike') || turn.move.includes('Slam') ? 'explosion' : 'punch');

        // Screen shake
        setTimeout(() => setScreenShake(true), 150);
        setTimeout(() => setScreenShake(false), 350);

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
        
        // Reset animation states
        setTimeout(() => {
          setActiveAttacker(null);
          setActiveDefender(null);
          setActivePopup(null);
        }, 1000); 

      }, 2500); // 2.5 second delay between turns
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
      <div className="flex max-w-4xl w-full justify-between items-end px-8 md:px-24 mb-12 h-64 md:h-96 border-b-4 border-[rgba(0,255,0,0.5)] bg-gradient-to-t from-[rgba(0,255,0,0.1)] to-transparent relative overflow-hidden">
          {/* Energy Beams / Projectiles */}
          {activeAttacker === 1 && (
             <motion.div 
               className="absolute top-1/2 left-32 w-1/2 h-8 bg-neon-cyan shadow-[0_0_30px_#00ffff] rounded-r-full z-10"
               initial={{ scaleX: 0, opacity: 1, originX: 0 }}
               animate={{ scaleX: [0, 1.5, 0], x: [0, 200, 300], opacity: [1, 1, 0] }}
               transition={{ duration: 0.3, ease: 'easeOut' }}
             />
          )}

          {activeAttacker === 2 && (
             <motion.div 
               className="absolute top-1/2 right-32 w-1/2 h-8 bg-red-500 shadow-[0_0_30px_#ff0000] rounded-l-full z-10"
               initial={{ scaleX: 0, opacity: 1, originX: 1 }}
               animate={{ scaleX: [0, 1.5, 0], x: [0, -200, -300], opacity: [1, 1, 0] }}
               transition={{ duration: 0.3, ease: 'easeOut' }}
             />
          )}

          {/* Floating Combat Text for Player 1 (Attacking) or Player 2 (Defending) */}
          <div className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center pointer-events-none z-20">
            {activePopup && activePopup.attacker === 1 && (
               <motion.div 
                 initial={{ y: 50, opacity: 0, scale: 0.5 }}
                 animate={{ y: -50, opacity: [0, 1, 1, 0], scale: 1.5 }}
                 transition={{ duration: 1 }}
                 className="text-neon-cyan font-display text-xl z-50 pixel-text text-center drop-shadow-[0_0_10px_#000]"
               >
                 {activePopup.move}!
               </motion.div>
             )}
             {activePopup && activePopup.attacker === 2 && (
               <motion.div 
                 initial={{ y: 0, opacity: 0, scale: 0.5 }}
                 animate={{ y: -100, opacity: [0, 1, 1, 0], scale: 2 }}
                 transition={{ duration: 1 }}
                 className="text-red-500 font-display text-4xl z-50 pixel-text drop-shadow-[0_0_10px_#000]"
               >
                 -{activePopup.damage} HP
               </motion.div>
             )}
          </div>

          {/* Floating Combat Text for Player 2 (Attacking) or Player 1 (Defending) */}
          <div className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-center pointer-events-none z-20">
             {activePopup && activePopup.attacker === 2 && (
               <motion.div 
                 initial={{ y: 50, opacity: 0, scale: 0.5 }}
                 animate={{ y: -50, opacity: [0, 1, 1, 0], scale: 1.5 }}
                 transition={{ duration: 1 }}
                 className="text-red-500 font-display text-xl z-50 pixel-text text-center drop-shadow-[0_0_10px_#000]"
               >
                 {activePopup.move}!
               </motion.div>
             )}
             {activePopup && activePopup.attacker === 1 && (
               <motion.div 
                 initial={{ y: 0, opacity: 0, scale: 0.5 }}
                 animate={{ y: -100, opacity: [0, 1, 1, 0], scale: 2 }}
                 transition={{ duration: 1 }}
                 className="text-red-500 font-display text-4xl z-50 pixel-text drop-shadow-[0_0_10px_#000]"
               >
                 -{activePopup.damage} HP
               </motion.div>
             )}
          </div>

          {/* Player 1 Sprite */}
          <CharacterSprite 
            isAttacking={activeAttacker === 1}
            isHit={activeDefender === 1}
            color="cyan"
            facingLeft={false}
          />
          
          {/* Player 2 Sprite */}
          <CharacterSprite 
            isAttacking={activeAttacker === 2}
            isHit={activeDefender === 2}
            color="red"
            facingLeft={true}
          />
      </div>

      {/* Combat Log Drawer */}
      <div className="w-full max-w-4xl px-4 flex-1 pb-8 flex flex-col justify-end">
        <CombatLog log={combatLog} />
      </div>
    </div>
  );
}
