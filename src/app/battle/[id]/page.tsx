'use client';
import { useEffect, useState } from 'react';
import BattleArena from '@/app/components/BattleArena';
import LoadingScreen from '@/app/components/LoadingScreen';

import { use } from 'react';

interface BattleData {
  player1: { username: string; powerLevel: number; maxHp: number; finalHp: number };
  player2: { username: string; powerLevel: number; maxHp: number; finalHp: number };
  battleSequence: Array<{ turn: number; player: 1 | 2; move: string; damage: number }>;
  winner: 1 | 2;
}

export default function BattlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [battle, setBattle] = useState<BattleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/battle?id=${resolvedParams.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Battle not found. Make sure the ID is correct.');
        return res.json();
      })
      .then(setBattle)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  if (loading) return <LoadingScreen />;
  
  if (error || !battle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-display text-xl p-8 text-center uppercase tracking-widest pixel-border border-4 border-red-500 m-8">
        ERROR: {error || 'SYSTEM FAILURE... BATTLE DATA CORRUPTED.'}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden">
      <BattleArena battle={battle} />
    </main>
  );
}
