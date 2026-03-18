'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import LoadingScreen from './LoadingScreen';

const TICKER = '★ GIT FIGHT CLUB ★  BATTLE OF COMMITS ★  WHO IS THE STRONGEST DEV? ★  PROVE YOUR POWER ★  ';

// Deterministic background particles — never random
const PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: (i * 43 + 7) % 100,
  y: (i * 31 + 11) % 100,
  size: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
  dur: 1.5 + (i % 6) * 0.4,
  delay: parseFloat(((i * 0.23) % 3).toFixed(2)),
}));

export default function SetupScreen() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const p2Ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleBattle = async () => {
    if (!player1.trim() || !player2.trim()) {
      setError('ENTER BOTH GITHUB USERNAMES!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player1Username: player1.trim(), player2Username: player2.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'BATTLE CREATION FAILED');
      router.push(`/battle/${data.battleId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'SYSTEM ERROR');
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen w-full overflow-hidden bg-black flex flex-col" style={{ fontFamily: "'Press Start 2P', monospace" }}>

      {/* ── TOP TICKER ── */}
      <div className="relative z-20 w-full shrink-0 overflow-hidden"
        style={{ background: '#050505', borderBottom: '2px solid #0044cc', height: 32 }}>
        <div className="marquee whitespace-nowrap flex items-center h-full"
          style={{ fontSize: 9, color: '#4488ff', letterSpacing: '0.15em' }}>
          {TICKER}{TICKER}{TICKER}
        </div>
      </div>

      {/* ── MAIN 3-COLUMN LAYOUT ── */}
      <div className="relative flex flex-1 overflow-hidden">

        {/* ══════════════════════════════
            LEFT — PLAYER 1 (BLUE)
            ══════════════════════════════ */}
        <motion.div
          className="relative flex flex-col overflow-hidden"
          style={{ width: '38%', background: 'linear-gradient(160deg, #00020f 0%, #000820 50%, #000510 100%)' }}
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Blue edge glow */}
          <div className="absolute inset-y-0 right-0 w-1 pointer-events-none"
            style={{ background: '#0055ff', boxShadow: '0 0 20px #0055ff, 0 0 60px rgba(0,85,255,0.5)' }} />
          {/* Left ambient glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(0,60,200,0.18) 0%, transparent 65%)' }} />

          {/* Scanlines */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
          }} />

          {/* Stars */}
          {PARTICLES.slice(0, 25).map(p => (
            <div key={p.id} className="star" style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              '--twinkle-dur': `${p.dur}s`,
              '--twinkle-delay': `${p.delay}s`,
            } as React.CSSProperties} />
          ))}

          {/* P1 Label */}
          <div className="relative z-10 px-6 pt-5 pb-2 flex items-center gap-3">
            <div style={{ width: 10, height: 10, background: '#4488ff', boxShadow: '0 0 10px #4488ff' }} />
            <span style={{ fontSize: 9, color: '#4488ff', letterSpacing: '0.25em' }}>PLAYER 1</span>
            <div className="flex-1 h-px" style={{ background: '#0055ff44' }} />
            <span style={{ fontSize: 8, color: '#0055ff66' }}>P1</span>
          </div>

          {/* Character display area */}
          <div className="relative flex-1 flex items-end justify-center overflow-hidden" style={{ minHeight: 260 }}>
            {/* Ground glow */}
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,85,255,0.15), transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: '#0055ff', boxShadow: '0 0 12px #0055ff' }} />

            {/* Sprite */}
            <motion.div
              className="relative float"
              style={{ width: 200, height: 200 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/sprites/p1.png"
                alt="Player 1"
                fill
                className="object-contain pixelated"
                style={{
                  filter: 'drop-shadow(0 0 16px #4488ff) drop-shadow(0 0 40px rgba(0,85,255,0.6))',
                  mixBlendMode: 'screen',
                }}
                priority
              />
            </motion.div>
          </div>

          {/* Input area */}
          <div className="relative z-10 p-5 flex flex-col gap-3"
            style={{ borderTop: '1px solid #0055ff33', background: 'rgba(0,4,20,0.8)' }}>
            <label style={{ fontSize: 8, color: '#4488ff88', letterSpacing: '0.2em' }}>
              GITHUB USERNAME
            </label>
            <input
              type="text"
              placeholder="e.g. torvalds"
              value={player1}
              onChange={e => setPlayer1(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && p2Ref.current?.focus()}
              autoComplete="off"
              className="neon-input w-full"
              style={{ padding: '10px 14px', fontSize: 11 }}
            />
            <div className="flex gap-1 flex-wrap">
              {['COMMITS', 'REPOS', 'FOLLOWERS', 'ACCOUNT AGE'].map(t => (
                <span key={t} style={{ fontSize: 6, color: '#0055ff66', border: '1px solid #0055ff22', padding: '2px 4px' }}>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════
            CENTER — VS + FIGHT
            ══════════════════════════════ */}
        <div className="relative flex flex-col items-center justify-between shrink-0 z-10 overflow-hidden"
          style={{ width: '24%', background: '#030303' }}>

          {/* Vertical neon lines */}
          <div className="absolute inset-y-0 left-0 w-px pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #0055ff, transparent)' }} />
          <div className="absolute inset-y-0 right-0 w-px pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #ff3333, transparent)' }} />

          {/* Background grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />

          {/* Top: title */}
          <div className="relative z-10 text-center px-4 pt-6">
            <div className="relative inline-block">
              <h1
                className="glitch-1"
                style={{
                  fontSize: 'clamp(10px, 2vw, 18px)',
                  lineHeight: 1.5,
                  color: '#fff',
                  textShadow: '3px 3px 0 #ff00ff, 6px 6px 0 #0055ff',
                }}
              >
                GIT<br />FIGHT<br />CLUB
              </h1>
              <span className="glitch-2" style={{ fontSize: 'clamp(10px, 2vw, 18px)', lineHeight: 1.5 }}>
                GIT<br />FIGHT<br />CLUB
              </span>
            </div>

            <motion.div
              style={{ fontSize: 7, color: '#00ff0088', letterSpacing: '0.2em', marginTop: 8 }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              BATTLE OF<br />COMMITS
            </motion.div>
          </div>

          {/* Middle: VS */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Divider */}
            <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, #0055ff, #8800ff, #ff3333)' }} />

            <motion.div
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 900,
                fontStyle: 'italic',
                color: '#ffff00',
                textShadow: '0 0 20px #ffff00, 0 0 50px #ffff00, 5px 5px 0 #554400',
                lineHeight: 1,
              }}
            >
              VS
            </motion.div>

            {/* Divider */}
            <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, #ff3333, #8800ff, #0055ff)' }} />

            {/* FIGHT BUTTON */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93, y: 4 }}
              onClick={handleBattle}
              style={{ cursor: 'pointer' }}
            >
              <div className="retro-btn" style={{ width: 'clamp(100px, 14vw, 160px)' }}>
                <div className="retro-btn-shadow" style={{ borderColor: '#000' }} />
                <div className="retro-btn-face" style={{
                  padding: '12px 8px',
                  fontSize: 'clamp(9px, 1.5vw, 13px)',
                  letterSpacing: '0.1em',
                }}>
                  ► FIGHT ◄
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom: insert coin */}
          <div className="relative z-10 pb-6 flex flex-col items-center gap-2">
            <motion.p
              style={{ fontSize: 7, color: '#ffffff33', letterSpacing: '0.15em', textAlign: 'center' }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            >
              INSERT COIN<br />TO CONTINUE
            </motion.p>
          </div>
        </div>

        {/* ══════════════════════════════
            RIGHT — PLAYER 2 (RED)
            ══════════════════════════════ */}
        <motion.div
          className="relative flex flex-col overflow-hidden"
          style={{ width: '38%', background: 'linear-gradient(200deg, #0f0000 0%, #200000 50%, #100000 100%)' }}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Red edge glow */}
          <div className="absolute inset-y-0 left-0 w-1 pointer-events-none"
            style={{ background: '#ff3333', boxShadow: '0 0 20px #ff3333, 0 0 60px rgba(255,51,51,0.5)' }} />
          {/* Right ambient glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(200,0,0,0.18) 0%, transparent 65%)' }} />

          {/* Scanlines */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
          }} />

          {/* Stars */}
          {PARTICLES.slice(25).map(p => (
            <div key={p.id} className="star" style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              '--twinkle-dur': `${p.dur}s`,
              '--twinkle-delay': `${p.delay}s`,
            } as React.CSSProperties} />
          ))}

          {/* P2 Label */}
          <div className="relative z-10 px-6 pt-5 pb-2 flex items-center gap-3">
            <span style={{ fontSize: 8, color: '#ff333366' }}>P2</span>
            <div className="flex-1 h-px" style={{ background: '#ff333344' }} />
            <span style={{ fontSize: 9, color: '#ff6666', letterSpacing: '0.25em' }}>PLAYER 2</span>
            <div style={{ width: 10, height: 10, background: '#ff4444', boxShadow: '0 0 10px #ff4444' }} />
          </div>

          {/* Character display area */}
          <div className="relative flex-1 flex items-end justify-center overflow-hidden" style={{ minHeight: 260 }}>
            {/* Ground glow */}
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(255,40,40,0.15), transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: '#ff3333', boxShadow: '0 0 12px #ff3333' }} />

            {/* Sprite */}
            <motion.div
              className="relative"
              style={{ width: 200, height: 200, transform: 'scaleX(-1)' }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            >
              <Image
                src="/sprites/p2.png"
                alt="Player 2"
                fill
                className="object-contain pixelated"
                style={{
                  filter: 'drop-shadow(0 0 16px #ff4444) drop-shadow(0 0 40px rgba(255,60,60,0.6))',
                  mixBlendMode: 'screen',
                }}
                priority
              />
            </motion.div>
          </div>

          {/* Input area */}
          <div className="relative z-10 p-5 flex flex-col gap-3"
            style={{ borderTop: '1px solid #ff333333', background: 'rgba(20,0,0,0.8)' }}>
            <label style={{ fontSize: 8, color: '#ff444488', letterSpacing: '0.2em', textAlign: 'right' }}>
              GITHUB USERNAME
            </label>
            <input
              ref={p2Ref}
              type="text"
              placeholder="e.g. gvanrossum"
              value={player2}
              onChange={e => setPlayer2(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBattle()}
              autoComplete="off"
              className="neon-input neon-input-red w-full"
              style={{ padding: '10px 14px', fontSize: 11, textAlign: 'right', background: '#0a0000' }}
            />
            <div className="flex gap-1 flex-wrap justify-end">
              {['COMMITS', 'REPOS', 'FOLLOWERS', 'ACCOUNT AGE'].map(t => (
                <span key={t} style={{ fontSize: 6, color: '#ff333366', border: '1px solid #ff333322', padding: '2px 4px' }}>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Error toast ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-12 left-1/2 z-50"
            style={{ transform: 'translateX(-50%)' }}
          >
            <div style={{
              fontSize: 9, color: '#ff6666', background: '#0a0000',
              border: '2px solid #ff3333', padding: '10px 20px',
              boxShadow: '0 0 20px rgba(255,50,50,0.4)',
            }}>
              ⚠ {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BOTTOM TICKER ── */}
      <div className="relative z-20 w-full shrink-0 overflow-hidden"
        style={{ background: '#050505', borderTop: '2px solid #cc0000', height: 32 }}>
        <div className="marquee-reverse whitespace-nowrap flex items-center h-full"
          style={{ fontSize: 9, color: '#ff4444', letterSpacing: '0.15em' }}>
          {TICKER}{TICKER}{TICKER}
        </div>
      </div>
    </div>
  );
}
