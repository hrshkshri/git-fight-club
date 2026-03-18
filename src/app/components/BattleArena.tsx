'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Deterministic stars
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i, left: (i * 37 + 11) % 97, top: (i * 23 + 7) % 62,
  size: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
  dur: 1.4 + (i % 5) * 0.4,
  delay: parseFloat(((i * 0.27) % 2.5).toFixed(2)),
}));

// Deterministic city buildings
const BUILDINGS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: (i / 22) * 100,
  width: 3.5 + (i % 5) * 1.2,
  height: 18 + (i % 8) * 7,
  windows: Array.from({ length: 5 }, (_, j) => ({
    id: j, lit: (i * 3 + j * 7) % 4 !== 0,
    dur: 2 + (i + j) % 4, delay: parseFloat(((i * 0.4 + j * 0.25) % 2.5).toFixed(2)),
  })),
}));

export default function BattleArena({ battle }: { battle: Battle }) {
  const [currentTurn, setCurrentTurn] = useState(-1);
  const [p1Hp, setP1Hp] = useState(battle.player1.maxHp);
  const [p2Hp, setP2Hp] = useState(battle.player2.maxHp);
  const [gameState, setGameState] = useState<'intro' | 'battle' | 'victory'>('intro');
  const [screenShake, setScreenShake] = useState(false);
  const [combatLog, setCombatLog] = useState<Array<{ player: 1 | 2; move: string; damage: number }>>([]);
  const [activeAttacker, setActiveAttacker] = useState<1 | 2 | null>(null);
  const [activeDefender, setActiveDefender] = useState<1 | 2 | null>(null);
  const [popup, setPopup] = useState<{ attacker: 1 | 2; move: string; damage: number; key: number } | null>(null);

  const { playSound, soundEnabled, toggleSound, initAudio } = useAudio();

  const totalPow = (battle.player1.powerLevel + battle.player2.powerLevel) || 1;
  const p1Blocks = Math.max(1, Math.round((battle.player1.powerLevel / totalPow) * 10));
  const p2Blocks = Math.max(1, Math.round((battle.player2.powerLevel / totalPow) * 10));

  useEffect(() => {
    if (gameState !== 'battle') return;
    const next = currentTurn + 1;
    if (next < battle.battleSequence.length) {
      const t = setTimeout(() => {
        const turn = battle.battleSequence[next];
        setActiveAttacker(turn.player);
        setPopup({ attacker: turn.player, move: turn.move, damage: turn.damage, key: next });
        setTimeout(() => setActiveDefender(turn.player === 1 ? 2 : 1), 130);
        playSound(turn.move.includes('Power') || turn.move.includes('Strike') || turn.move.includes('Slam') ? 'explosion' : 'punch');
        setTimeout(() => setScreenShake(true), 130);
        setTimeout(() => setScreenShake(false), 380);
        if (turn.player === 1) setP2Hp(p => Math.max(0, p - turn.damage));
        else setP1Hp(p => Math.max(0, p - turn.damage));
        setCombatLog(prev => [...prev, { player: turn.player, move: turn.move, damage: turn.damage }]);
        setCurrentTurn(next);
        setTimeout(() => { setActiveAttacker(null); setActiveDefender(null); setPopup(null); }, 1900);
      }, 2600);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setGameState('victory'); playSound('victory'); }, 1500);
      return () => clearTimeout(t);
    }
  }, [gameState, currentTurn, battle.battleSequence, playSound]);

  useEffect(() => {
    if (gameState === 'intro') {
      const t = setTimeout(() => setGameState('battle'), 3000);
      return () => clearTimeout(t);
    }
  }, [gameState]);

  if (gameState === 'victory') return <VictoryScreen battle={battle} />;

  /* ── INTRO ── */
  if (gameState === 'intro') {
    return (
      <motion.div
        className="min-h-screen w-full bg-black flex flex-col items-center justify-center absolute inset-0 z-[100] overflow-hidden"
        onClick={initAudio}
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Split glow */}
        <div className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at right center, rgba(0,85,255,0.1) 0%, transparent 70%)' }} />
        <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at left center, rgba(255,40,40,0.1) 0%, transparent 70%)' }} />

        <motion.h2
          style={{
            fontSize: 'clamp(32px, 8vw, 80px)', fontWeight: 900, textAlign: 'center', zIndex: 10,
            color: '#fff', textShadow: '0 0 30px #ff00ff, 4px 4px 0 #ff00ff, 8px 8px 0 #0055ff',
          }}
          animate={{ scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          GET READY!
        </motion.h2>

        <motion.div
          className="relative z-10 flex gap-6 items-center mt-10"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            border: '2px solid #333',
            background: '#080808',
            padding: '24px 32px',
          }}
        >
          <div style={{ fontSize: 'clamp(10px, 2vw, 18px)', color: '#4488ff', textShadow: '0 0 15px #4488ff', maxWidth: 200, textAlign: 'center' }}>
            {battle.player1.username}
          </div>
          <motion.div
            style={{ fontSize: 32, color: '#ffff00', fontStyle: 'italic', textShadow: '0 0 20px #ffff00' }}
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          >VS</motion.div>
          <div style={{ fontSize: 'clamp(10px, 2vw, 18px)', color: '#ff4444', textShadow: '0 0 15px #ff4444', maxWidth: 200, textAlign: 'center' }}>
            {battle.player2.username}
          </div>
        </motion.div>

        <motion.p
          style={{ position: 'relative', zIndex: 10, marginTop: 28, fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em' }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          TAP TO ENABLE AUDIO
        </motion.p>
      </motion.div>
    );
  }

  /* ── ARENA HEIGHT: fixed at 100vh minus HUD ── */
  const ARENA_H = 420;
  const FLOOR_PCT = 0.30; // floor at 30% from bottom
  const FLOOR_PX = Math.round(ARENA_H * FLOOR_PCT); // ~126px

  const shakeStyle = screenShake
    ? { transform: `translate(${((currentTurn * 7) % 12) - 6}px, ${((currentTurn * 5) % 10) - 5}px)` }
    : { transform: 'translate(0,0)' };

  return (
    <div
      className="min-h-screen w-full text-white flex flex-col bg-black overflow-hidden"
      style={{ ...shakeStyle, transition: 'transform 50ms', fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* ── Audio button ── */}
      <button
        onClick={toggleSound}
        className="fixed top-3 right-3 z-[60]"
        style={{
          fontSize: 8, padding: '6px 10px', background: '#0a0a0a',
          border: '1px solid #333', color: '#666', cursor: 'pointer',
        }}
      >
        🔊 {soundEnabled ? 'ON' : 'OFF'}
      </button>

      {/* ══════════ HUD ══════════ */}
      <div style={{
        background: 'linear-gradient(to bottom, #0c0c0c, #060606)',
        borderBottom: '2px solid #1a1a1a',
        padding: '10px 16px 8px',
        zIndex: 20,
        position: 'relative',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 90px 1fr', gap: 12, alignItems: 'start' }}>

          {/* P1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <div style={{ width: 8, height: 8, background: '#4488ff', boxShadow: '0 0 6px #4488ff', flexShrink: 0 }} />
              <span style={{ fontSize: 8, color: '#4488ff', textShadow: '0 0 8px #4488ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {battle.player1.username}
              </span>
            </div>
            <HealthBar value={p1Hp} max={battle.player1.maxHp} color="cyan" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
              <span style={{ fontSize: 6, color: '#4488ff66', marginRight: 4 }}>PWR</span>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{
                  width: 7, height: 9, flexShrink: 0,
                  background: i < p1Blocks ? '#4488ff' : 'transparent',
                  border: `1px solid ${i < p1Blocks ? '#4488ff' : '#4488ff22'}`,
                  boxShadow: i < p1Blocks ? '0 0 4px #4488ff' : 'none',
                }} />
              ))}
              <span style={{ fontSize: 6, color: '#4488ff33', marginLeft: 4 }}>{battle.player1.powerLevel}</span>
            </div>
          </div>

          {/* Centre */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}>ROUND</span>
            <motion.span
              style={{ fontSize: 24, color: '#ffff00', textShadow: '0 0 12px #ffff00', lineHeight: 1 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >1</motion.span>
            {currentTurn >= 0 && (
              <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.2)' }}>
                {currentTurn + 1}/{battle.battleSequence.length}
              </span>
            )}
          </div>

          {/* P2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 8, color: '#ff4444', textShadow: '0 0 8px #ff4444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {battle.player2.username}
              </span>
              <div style={{ width: 8, height: 8, background: '#ff4444', boxShadow: '0 0 6px #ff4444', flexShrink: 0 }} />
            </div>
            <HealthBar value={p2Hp} max={battle.player2.maxHp} color="red" reverse />
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2, flexDirection: 'row-reverse' }}>
              <span style={{ fontSize: 6, color: '#ff444466', marginLeft: 4 }}>PWR</span>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{
                  width: 7, height: 9, flexShrink: 0,
                  background: i < p2Blocks ? '#ff4444' : 'transparent',
                  border: `1px solid ${i < p2Blocks ? '#ff4444' : '#ff444422'}`,
                  boxShadow: i < p2Blocks ? '0 0 4px #ff4444' : 'none',
                }} />
              ))}
              <span style={{ fontSize: 6, color: '#ff444433', marginRight: 4 }}>{battle.player2.powerLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ ARENA ══════════ */}
      <div
        className="scanlines"
        style={{
          position: 'relative',
          width: '100%',
          height: ARENA_H,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Sky */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, #03000d 0%, #07001c 40%, #00030c 100%)',
        }} />

        {/* Stars */}
        {STARS.map(s => (
          <div key={s.id} className="star" style={{
            left: `${s.left}%`, top: `${s.top}%`,
            width: s.size, height: s.size,
            '--twinkle-dur': `${s.dur}s`, '--twinkle-delay': `${s.delay}s`,
          } as React.CSSProperties} />
        ))}

        {/* City skyline */}
        <div style={{
          position: 'absolute', bottom: FLOOR_PX, left: 0, right: 0,
          height: 110, display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          {BUILDINGS.map(b => (
            <div key={b.id} style={{
              position: 'absolute', bottom: 0,
              left: `${b.left}%`, width: `${b.width}%`, height: `${b.height}%`,
              background: '#06000f', border: '1px solid #18002a',
            }}>
              {b.windows.map(w => (
                <motion.div key={w.id} style={{
                  position: 'absolute', width: 3, height: 3,
                  top: `${8 + w.id * 17}%`, left: '30%',
                  background: w.lit ? '#ffffa022' : 'transparent',
                  boxShadow: w.lit ? '0 0 3px #ffffa0' : 'none',
                }}
                  animate={w.lit ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.08 }}
                  transition={{ duration: w.dur, repeat: Infinity, delay: w.delay }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Horizon fog */}
        <div style={{
          position: 'absolute', bottom: FLOOR_PX, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to top, rgba(0,20,50,1), transparent)',
          pointerEvents: 'none',
        }} />

        {/* FLOOR NEON LINE */}
        <div style={{
          position: 'absolute', bottom: FLOOR_PX, left: 0, right: 0, height: 3,
          background: '#00ddff',
          boxShadow: '0 0 12px #00ddff, 0 0 30px #00ddff, 0 0 70px rgba(0,220,255,0.6)',
          pointerEvents: 'none',
        }} />

        {/* Perspective floor */}
        <div
          className="arena-floor"
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: FLOOR_PX, pointerEvents: 'none' }}
        />

        {/* ── PROJECTILES ── */}
        {activeAttacker === 1 && (
          <motion.div style={{
            position: 'absolute', zIndex: 10,
            top: `${((ARENA_H - FLOOR_PX) * 0.55)}px`,
            left: '16%', height: 8, width: '24%',
            borderRadius: '0 50% 50% 0',
            background: '#4488ff',
            boxShadow: '0 0 16px #4488ff, 0 0 40px rgba(0,100,255,0.8)',
            marginTop: -4,
          }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: [0, 1, 0.1], x: ['0%', '160%'], opacity: [1, 1, 0] }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
          />
        )}
        {activeAttacker === 2 && (
          <motion.div style={{
            position: 'absolute', zIndex: 10,
            top: `${((ARENA_H - FLOOR_PX) * 0.55)}px`,
            right: '16%', height: 8, width: '24%',
            borderRadius: '50% 0 0 50%',
            background: '#ff3333',
            boxShadow: '0 0 16px #ff3333, 0 0 40px rgba(255,0,0,0.8)',
            marginTop: -4,
          }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: [0, 1, 0.1], x: ['0%', '-160%'], opacity: [1, 1, 0] }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
          />
        )}

        {/* Impact burst */}
        {activeDefender && (
          <motion.div style={{
            position: 'absolute', zIndex: 20, pointerEvents: 'none',
            top: `${((ARENA_H - FLOOR_PX) * 0.3)}px`,
            [activeDefender === 1 ? 'left' : 'right']: '14%',
            width: 90, height: 90,
            background: 'radial-gradient(circle, rgba(255,255,120,0.95) 0%, rgba(255,180,0,0.5) 35%, transparent 70%)',
          }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 2, 0], opacity: [1, 0.8, 0] }}
            transition={{ duration: 0.38 }}
          />
        )}

        {/* ── CHARACTERS — standing precisely on the floor line ── */}
        {/* P1: bottom of sprite = FLOOR_PX from bottom of arena */}
        <div style={{
          position: 'absolute',
          left: '10%',
          bottom: FLOOR_PX,     /* ← sits exactly on the neon floor line */
          zIndex: 10,
        }}>
          <CharacterSprite
            isAttacking={activeAttacker === 1}
            isHit={activeDefender === 1}
            color="cyan"
            facingLeft={false}
          />
        </div>

        {/* P2: mirror */}
        <div style={{
          position: 'absolute',
          right: '10%',
          bottom: FLOOR_PX,     /* ← same floor line */
          zIndex: 10,
        }}>
          <CharacterSprite
            isAttacking={activeAttacker === 2}
            isHit={activeDefender === 2}
            color="red"
            facingLeft={true}
          />
        </div>

        {/* ══ MOVE ANNOUNCEMENT ══ */}
        <AnimatePresence>
          {popup && (
            <motion.div
              key={popup.key}
              style={{
                position: 'absolute', inset: 0, zIndex: 30,
                pointerEvents: 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Flash overlay */}
              <motion.div style={{
                position: 'absolute', inset: 0,
                background: popup.attacker === 1 ? 'rgba(0,80,255,0.07)' : 'rgba(255,30,30,0.07)',
              }}
                initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }}
              />

              {/* Attacker name */}
              <motion.div
                style={{
                  fontSize: 8, letterSpacing: '0.3em', zIndex: 10,
                  color: popup.attacker === 1 ? '#4488ff' : '#ff4444', opacity: 0.85,
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {(popup.attacker === 1 ? battle.player1.username : battle.player2.username).toUpperCase()} ATTACKS!
              </motion.div>

              {/* Move name */}
              <motion.div
                style={{
                  fontSize: 'clamp(14px, 3vw, 26px)',
                  textAlign: 'center', zIndex: 10, padding: '0 16px',
                  color: popup.attacker === 1 ? '#4488ff' : '#ff4444',
                  textShadow: popup.attacker === 1
                    ? '0 0 20px #4488ff, 0 0 50px #0055ff, 3px 3px 0 #000'
                    : '0 0 20px #ff4444, 0 0 50px #ff0000, 3px 3px 0 #000',
                }}
                initial={{ scale: 3, opacity: 0, letterSpacing: '0.8em', filter: 'blur(14px)' }}
                animate={{ scale: 1, opacity: 1, letterSpacing: '0.04em', filter: 'blur(0)' }}
                exit={{ scale: 1.5, opacity: 0, y: -20 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
              >
                {popup.move.toUpperCase()}!
              </motion.div>

              {/* Damage */}
              <motion.div
                style={{
                  fontSize: 'clamp(36px, 9vw, 72px)',
                  zIndex: 10, lineHeight: 1,
                  textShadow: '0 0 20px #ff2200, 0 0 50px #ff0000, 5px 5px 0 #000',
                }}
                initial={{ scale: 0.2, opacity: 0, y: 40 }}
                animate={{ scale: [0.2, 1.4, 1.0], opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -30 }}
                transition={{ duration: 0.42, delay: 0.18, ease: 'backOut' }}
              >
                <span style={{ color: '#ff4444' }}>-</span>
                <span style={{ color: '#fff' }}>{popup.damage}</span>
                <span style={{ color: '#ff4444', fontSize: '50%' }}> HP</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Combat log ── */}
      <div style={{ flex: 1, padding: '4px 12px 8px' }}>
        <CombatLog log={combatLog} />
      </div>
    </div>
  );
}
