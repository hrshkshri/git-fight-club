'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CharacterSprite({ 
  isAttacking, 
  isHit, 
  color,
  facingLeft 
}: { 
  isAttacking: boolean;
  isHit: boolean;
  color: 'cyan' | 'red';
  facingLeft: boolean;
}) {
  const spriteSrc = color === 'cyan' ? '/sprites/p1.png' : '/sprites/p2.png';
  const shadowColor = color === 'cyan' ? 'drop-shadow-[0_0_20px_rgba(0,255,255,0.7)]' : 'drop-shadow-[0_0_20px_rgba(255,0,0,0.7)]';
  const hitFlash = isHit ? 'brightness-[3] contrast-150 rotate-[-15deg]' : '';

  return (
    <motion.div 
      className={`relative w-48 h-48 md:w-64 md:h-64 flex flex-col items-center justify-end ${facingLeft ? 'scale-x-[-1]' : ''} ${shadowColor} ${hitFlash}`}
      animate={{
        y: isAttacking ? 0 : [0, -10, 0], // Bobbing idle animation
        x: isAttacking ? (facingLeft ? -100 : 100) : 0, // Deep lunge forward
      }}
      transition={{
        y: isAttacking ? { duration: 0.1 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        x: isAttacking ? { type: "spring", stiffness: 300, damping: 15 } : { duration: 0.2 },
      }}
    >
        <Image
          src={spriteSrc}
          alt={`Player Sprite ${color}`}
          fill
          className="object-contain pixelated pointer-events-none"
          priority
        />
    </motion.div>
  );
}
