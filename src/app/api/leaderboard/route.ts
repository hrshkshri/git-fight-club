import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Battle } from '@/lib/models/Battle';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Count wins for each player
    const leaderboard = await Battle.aggregate([
      {
        $group: {
          _id: { $cond: [{ $eq: ['$winner', 1] }, '$player1.username', '$player2.username'] },
          wins: { $sum: 1 }
        }
      },
      { $sort: { wins: -1 } },
      { $limit: limit }
    ]);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
