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
  const glowPrimary  = color === 'cyan' ? '#4488ff' : '#ff3333';
  const glowSecondary = color === 'cyan' ? 'rgba(0,80,255,0.5)' : 'rgba(255,40,40,0.5)';

  const baseFilter = `drop-shadow(0 0 12px ${glowPrimary}) drop-shadow(0 0 30px ${glowSecondary})`;
  const hitFilter  = `brightness(8) contrast(3) drop-shadow(0 0 20px #fff)`;

  return (
    <motion.div
      style={{
        position: 'relative',
        width: 'clamp(120px, 14vw, 200px)',
        height: 'clamp(120px, 14vw, 200px)',
        transformOrigin: 'bottom center',
        transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)',
      }}
      animate={{
        y: isAttacking ? 0 : [0, -8, 0],
        x: isAttacking
          ? (facingLeft ? -80 : 80)
          : 0,
      }}
      transition={{
        y: isAttacking
          ? { duration: 0.08 }
          : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        x: isAttacking
          ? { type: 'spring', stiffness: 350, damping: 12 }
          : { duration: 0.3 },
      }}
    >
      {/* Shadow on floor */}
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
          scaleX: isAttacking ? 1.3 : [0.8, 0.6, 0.8],
          opacity: isAttacking ? 0.6 : [0.4, 0.25, 0.4],
        }}
        transition={{ duration: 1.8, repeat: isAttacking ? 0 : Infinity, ease: 'easeInOut' }}
      />

      <Image
        src={src}
        alt={`Player ${color}`}
        fill
        className="object-contain pixelated pointer-events-none"
        style={{
          mixBlendMode: 'screen',
          filter: isHit ? hitFilter : baseFilter,
          transition: 'filter 0.08s',
        }}
        priority
      />
    </motion.div>
  );
}
