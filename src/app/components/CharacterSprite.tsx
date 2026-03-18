'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Props {
  isAttacking: boolean;
  isHit: boolean;
  color: 'cyan' | 'red';
  facingLeft: boolean;
}

export default function CharacterSprite({ isAttacking, isHit, color, facingLeft }: Props) {
  const src = color === 'cyan' ? '/sprites/p1.png' : '/sprites/p2.png';
  const glowPrimary   = color === 'cyan' ? '#4488ff' : '#ff3333';
  const glowSecondary = color === 'cyan' ? 'rgba(0,80,255,0.5)' : 'rgba(255,40,40,0.5)';

  const baseFilter = `drop-shadow(0 0 12px ${glowPrimary}) drop-shadow(0 0 30px ${glowSecondary})`;
  const hitFilter  = `brightness(8) contrast(3) drop-shadow(0 0 20px #fff)`;

  // Walking: step forward (+18), hold, step back (-6), hold — like a fighter circling
  // stagger back on hit
  const idleX  = [0, 18, 18, 0, -6, -6, 0];
  const hitX   = [0, -28, -18, 0];          // knocked back
  const attackX = facingLeft ? -90 : 90;    // lunge toward opponent

  const currentX = isAttacking ? attackX : isHit ? hitX : idleX;
  const xTransition = isAttacking
    ? { type: 'spring' as const, stiffness: 400, damping: 14 }
    : isHit
    ? { duration: 0.35, ease: 'easeOut' as const }
    : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const };

  // Idle y-bob; crouch-dip on attack; bounce up on hit
  const currentY = isAttacking ? [0, -4, 0] : isHit ? [0, 5, -8, 0] : [0, -10, 0];
  const yTransition = isAttacking
    ? { duration: 0.18, repeat: 1, repeatType: 'reverse' as const }
    : isHit
    ? { duration: 0.32 }
    : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <motion.div
      style={{
        position: 'relative',
        width: 'clamp(120px, 14vw, 200px)',
        height: 'clamp(120px, 14vw, 200px)',
        transformOrigin: 'bottom center',
        transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
      }}
      animate={{ x: currentX, y: currentY }}
      transition={{ x: xTransition, y: yTransition }}
    >
      {/* Floor shadow */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: -6,
          left: '15%',
          right: '15%',
          height: 8,
          borderRadius: '50%',
          background: glowPrimary,
          filter: 'blur(6px)',
          opacity: 0.4,
        }}
        animate={{
          scaleX: isAttacking ? 1.5 : [0.8, 0.55, 0.8],
          opacity: isAttacking ? 0.7 : [0.4, 0.22, 0.4],
        }}
        transition={{ duration: 1.6, repeat: isAttacking ? 0 : Infinity, ease: 'easeInOut' }}
      />

      <Image
        src={src}
        alt={`Player ${color}`}
        fill
        unoptimized
        placeholder="empty"
        className="object-contain pixelated pointer-events-none"
        style={{
          filter: isHit ? hitFilter : baseFilter,
          transition: 'filter 0.08s',
        }}
        priority
      />
    </motion.div>
  );
}
