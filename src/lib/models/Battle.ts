import mongoose from 'mongoose';

export interface IBattle {
  player1: {
    username: string;
    powerLevel: number;
    maxHp: number;
    finalHp: number;
  };
  player2: {
    username: string;
    powerLevel: number;
    maxHp: number;
    finalHp: number;
  };
  battleSequence: Array<{
    turn: number;
    player: 1 | 2;
    move: string;
    damage: number;
  }>;
  winner: 1 | 2;
  createdAt: Date;
}

const battleSchema = new mongoose.Schema<IBattle>({
  player1: {
    username: { type: String, required: true },
    powerLevel: { type: Number, required: true },
    maxHp: { type: Number, default: 100 },
    finalHp: { type: Number }
  },
  player2: {
    username: { type: String, required: true },
    powerLevel: { type: Number, required: true },
    maxHp: { type: Number, default: 100 },
    finalHp: { type: Number }
  },
  battleSequence: [
    {
      turn: Number,
      player: { type: Number, enum: [1, 2] },
      move: String,
      damage: Number
    }
  ],
  winner: { type: Number, enum: [1, 2] },
  createdAt: { type: Date, default: Date.now }
});

export const Battle = mongoose.models.Battle || mongoose.model<IBattle>('Battle', battleSchema);
