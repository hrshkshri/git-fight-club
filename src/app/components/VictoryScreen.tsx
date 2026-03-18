'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Deterministic falling sparks
const SPARKS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: (i * 43 + 7) % 100,
  dur: 1.4 + (i % 5) * 0.35,
  delay: parseFloat(((i * 0.18) % 2.5).toFixed(2)),
  color: ['#ffff00','#ff00ff','#00ffff','#ff4444','#00ff88','#ff8800'][i % 6],
  size: i % 4 === 0 ? 7 : i % 2 === 0 ? 5 : 3,
}));

interface StatBarProps {
  label: string;
  p1Val: number;
  p2Val: number;
  p1Color: string;
  p2Color: string;
  p1Win: boolean;
  delay: number;
  format?: (v: number) => string;
}

function StatBar({ label, p1Val, p2Val, p1Color, p2Color, p1Win, delay, format }: StatBarProps) {
  const total = (p1Val + p2Val) || 1;
  const p1Pct = Math.round((p1Val / total) * 100);
  const p2Pct = 100 - p1Pct;
  const fmt = format ?? ((v: number) => v.toLocaleString());
  const p1Better = p1Val >= p2Val;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={{ marginBottom: 10 }}
    >
      {/* Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{
          fontSize: 8, color: p1Better && p1Win ? p1Color : !p1Better && !p1Win ? p2Color : 'rgba(255,255,255,0.4)',
          letterSpacing: '0.12em',
        }}>{fmt(p1Val)}</span>
        <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em' }}>{label}</span>
        <span style={{
          fontSize: 8, color: !p1Better && !p1Win ? p2Color : p1Better && p1Win ? p1Color : 'rgba(255,255,255,0.4)',
          letterSpacing: '0.12em',
        }}>{fmt(p2Val)}</span>
      </div>

      {/* Bar */}
      <div style={{
        width: '100%', height: 12, display: 'flex', overflow: 'hidden',
        border: '1px solid #222', background: '#050505',
      }}>
        {/* P1 fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${p1Pct}%` }}
          transition={{ delay: delay + 0.1, duration: 0.7, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: p1Better ? p1Color : `${p1Color}55`,
            boxShadow: p1Better ? `0 0 8px ${p1Color}` : 'none',
          }}
        />
        {/* Gap */}
        <div style={{ width: 2, background: '#000', flexShrink: 0 }} />
        {/* P2 fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${p2Pct}%` }}
          transition={{ delay: delay + 0.1, duration: 0.7, ease: 'easeOut' }}
          style={{
            height: '100%', flex: 1,
            background: !p1Better ? p2Color : `${p2Color}55`,
            boxShadow: !p1Better ? `0 0 8px ${p2Color}` : 'none',
          }}
        />
      </div>
    </motion.div>
  );
}

export default function VictoryScreen({ battle }: { battle: any }) {
  const router = useRouter();
  const isP1Win = battle.winner === 1;

  const p1 = battle.player1;
  const p2 = battle.player2;

  const P1_COLOR = '#4488ff';
  const P2_COLOR = '#ff4444';
  const winColor  = isP1Win ? P1_COLOR : P2_COLOR;
  const loseColor = isP1Win ? P2_COLOR : P1_COLOR;
  const winner = isP1Win ? p1 : p2;
  const loser  = isP1Win ? p2 : p1;

  // Compute battle stats from sequence
  const seq = battle.battleSequence ?? [];
  const p1DmgDealt   = seq.filter((t: any) => t.player === 1).reduce((s: number, t: any) => s + t.damage, 0);
  const p2DmgDealt   = seq.filter((t: any) => t.player === 2).reduce((s: number, t: any) => s + t.damage, 0);
  const p1Hits       = seq.filter((t: any) => t.player === 1).length;
  const p2Hits       = seq.filter((t: any) => t.player === 2).length;
  const p1MaxHit     = seq.filter((t: any) => t.player === 1).reduce((m: number, t: any) => Math.max(m, t.damage), 0);
  const p2MaxHit     = seq.filter((t: any) => t.player === 2).reduce((m: number, t: any) => Math.max(m, t.damage), 0);

  const stats: StatBarProps[] = [
    { label: 'POWER LEVEL',     p1Val: p1.powerLevel,           p2Val: p2.powerLevel,           p1Color: P1_COLOR, p2Color: P2_COLOR, p1Win: isP1Win, delay: 0.5, },
    { label: 'HP REMAINING',    p1Val: p1.finalHp ?? 0,         p2Val: p2.finalHp ?? 0,         p1Color: P1_COLOR, p2Color: P2_COLOR, p1Win: isP1Win, delay: 0.57 },
    { label: 'DAMAGE DEALT',    p1Val: p1DmgDealt,              p2Val: p2DmgDealt,              p1Color: P1_COLOR, p2Color: P2_COLOR, p1Win: isP1Win, delay: 0.64 },
    { label: 'HITS LANDED',     p1Val: p1Hits,                  p2Val: p2Hits,                  p1Color: P1_COLOR, p2Color: P2_COLOR, p1Win: isP1Win, delay: 0.71 },
    { label: 'BEST STRIKE',     p1Val: p1MaxHit,                p2Val: p2MaxHit,                p1Color: P1_COLOR, p2Color: P2_COLOR, p1Win: isP1Win, delay: 0.78 },
    { label: 'EST. COMMITS',    p1Val: p1.stats?.commits ?? 0,  p2Val: p2.stats?.commits ?? 0,  p1Color: P1_COLOR, p2Color: P2_COLOR, p1Win: isP1Win, delay: 0.85 },
    { label: 'PUBLIC REPOS',    p1Val: p1.stats?.repos ?? 0,    p2Val: p2.stats?.repos ?? 0,    p1Color: P1_COLOR, p2Color: P2_COLOR, p1Win: isP1Win, delay: 0.92 },
    { label: 'FOLLOWERS',       p1Val: p1.stats?.followers ?? 0,p2Val: p2.stats?.followers ?? 0,p1Color: P1_COLOR, p2Color: P2_COLOR, p1Win: isP1Win, delay: 0.99 },
  ];

  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{
        background: '#030303',
        fontFamily: "'Press Start 2P', monospace",
        position: 'relative',
      }}
    >
      {/* Falling sparks */}
      {SPARKS.map(s => (
        <motion.div
          key={s.id}
          style={{
            position: 'fixed', top: 0, pointerEvents: 'none', zIndex: 0,
            left: `${s.x}%`, width: s.size, height: s.size, background: s.color,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: '105vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        zIndex: 0,
      }} />

      {/* Glow behind K.O. */}
      <div className="fixed pointer-events-none" style={{
        top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300,
        background: `radial-gradient(ellipse, ${winColor}15 0%, transparent 70%)`,
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 860, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* ── K.O. ── */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: 12 }}
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 14 }}
        >
          <div style={{
            fontSize: 'clamp(56px, 14vw, 120px)',
            fontWeight: 900, lineHeight: 1, color: '#ffff00',
            textShadow: '0 0 30px #ffff00, 0 0 60px #ffff00, 0 0 100px rgba(255,255,0,0.4), 8px 8px 0 #554400, 14px 14px 0 #332200',
          }}>
            K.O.
          </div>
        </motion.div>

        {/* ── Winner banner ── */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: 24 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.5em', marginBottom: 8 }}>
            ── WINNER ──
          </div>
          <div style={{
            fontSize: 'clamp(16px, 5vw, 36px)',
            color: winColor,
            textShadow: `0 0 20px ${winColor}, 0 0 50px ${winColor}, 5px 5px 0 #000`,
            wordBreak: 'break-all', lineHeight: 1.2,
          }}>
            {winner.username}
          </div>
          <motion.div
            style={{ fontSize: 8, color: winColor, opacity: 0.7, letterSpacing: '0.25em', marginTop: 8 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ★ SUPREME VICTORY ★
          </motion.div>
        </motion.div>

        {/* ── Player name headers ── */}
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 4 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div style={{
            padding: '10px 16px', fontSize: 9, textAlign: 'center',
            color: P1_COLOR, background: `${P1_COLOR}12`,
            border: `2px solid ${P1_COLOR}44`,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {isP1Win ? '★ ' : ''}{p1.username}{isP1Win ? ' ★' : ''}
          </div>
          <div style={{
            padding: '10px 16px', fontSize: 9, textAlign: 'center',
            color: P2_COLOR, background: `${P2_COLOR}12`,
            border: `2px solid ${P2_COLOR}44`,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {!isP1Win ? '★ ' : ''}{p2.username}{!isP1Win ? ' ★' : ''}
          </div>
        </motion.div>

        {/* ── Stats panel ── */}
        <motion.div
          style={{
            background: '#070707',
            border: '2px solid #1a1a1a',
            padding: '20px 20px 16px',
            marginBottom: 16,
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          {/* Column labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 7, color: `${P1_COLOR}88`, letterSpacing: '0.2em' }}>P1 ◄</span>
            <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}>STAT COMPARISON</span>
            <span style={{ fontSize: 7, color: `${P2_COLOR}88`, letterSpacing: '0.2em' }}>► P2</span>
          </div>

          {stats.map(s => (
            <StatBar key={s.label} {...s} />
          ))}
        </motion.div>

        {/* ── Developer Intel panel ── */}
        <motion.div
          style={{
            background: '#060606',
            border: '1px solid #1a1a1a',
            padding: '16px 20px',
            marginBottom: 24,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.25em', marginBottom: 14, textAlign: 'center' }}>
            ── DEVELOPER INTEL ──
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'TOTAL TURNS',   val: seq.length,     col: 'rgba(255,255,255,0.5)' },
              { label: 'WIN CONDITION', val: isP1Win ? `${p1.username} KO'd ${p2.username}` : `${p2.username} KO'd ${p1.username}`, col: winColor, small: true },
              { label: 'P1 EFFICIENCY', val: p1Hits > 0 ? `${Math.round(p1DmgDealt / p1Hits)} avg dmg` : '0 avg dmg', col: P1_COLOR },
              { label: 'P2 EFFICIENCY', val: p2Hits > 0 ? `${Math.round(p2DmgDealt / p2Hits)} avg dmg` : '0 avg dmg', col: P2_COLOR },
              { label: 'P1 COMMITS',    val: (p1.stats?.commits ?? 0).toLocaleString(), col: P1_COLOR },
              { label: 'P2 COMMITS',    val: (p2.stats?.commits ?? 0).toLocaleString(), col: P2_COLOR },
              { label: 'P1 FOLLOWERS',  val: (p1.stats?.followers ?? 0).toLocaleString(), col: P1_COLOR },
              { label: 'P2 FOLLOWERS',  val: (p2.stats?.followers ?? 0).toLocaleString(), col: P2_COLOR },
            ].map(({ label, val, col, small }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -8 : 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.06 }}
                style={{
                  padding: '10px 12px',
                  background: '#0a0a0a',
                  border: '1px solid #181818',
                }}
              >
                <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', marginBottom: 5 }}>
                  {label}
                </div>
                <div style={{
                  fontSize: small ? 7 : 11,
                  color: col,
                  textShadow: `0 0 8px ${col}`,
                  wordBreak: 'break-all',
                  lineHeight: 1.3,
                }}>
                  {val}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Buttons ── */}
        <motion.div
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          {/* New Battle */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93, y: 3 }}
            onClick={() => router.push('/')}
            style={{ cursor: 'pointer' }}
          >
            <div className="retro-btn" style={{ minWidth: 160 }}>
              <div className="retro-btn-shadow" />
              <div className="retro-btn-face" style={{ padding: '14px 20px', fontSize: 11, letterSpacing: '0.1em' }}>
                ► NEW BATTLE
              </div>
            </div>
          </motion.div>

          {/* Rematch — goes back to same battle URL for a fresh run */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93, y: 3 }}
            onClick={() => {
              const p1 = battle.player1.username;
              const p2 = battle.player2.username;
              fetch('/api/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player1Username: p1, player2Username: p2 }),
              })
                .then(r => r.json())
                .then(d => { if (d.battleId) router.push(`/battle/${d.battleId}`); });
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="retro-btn" style={{ minWidth: 160 }}>
              <div className="retro-btn-shadow" style={{ background: '#004400' }} />
              <div className="retro-btn-face" style={{ padding: '14px 20px', fontSize: 11, letterSpacing: '0.1em', background: '#00ff88', color: '#000' }}>
                ↺ REMATCH
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Insert coin */}
        <motion.p
          style={{ textAlign: 'center', marginTop: 20, fontSize: 7, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.3em' }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          PRESS START TO CONTINUE
        </motion.p>
      </div>
    </div>
  );
}
