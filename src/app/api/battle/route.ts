import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Battle } from '@/lib/models/Battle';
import { calculatePowerLevel, calculateMaxHp } from '@/lib/services/scoring';
import { generateBattleSequence } from '@/lib/services/battle';
import { fetchGitHubUser } from '@/lib/services/github';

// POST /api/battle - Create new battle
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const bodyText = await request.text();
    const { player1Username, player2Username } = JSON.parse(bodyText);

    if (!player1Username || !player2Username) {
      return NextResponse.json(
        { error: 'Both usernames required' },
        { status: 400 }
      );
    }

    // Fetch GitHub data for both players
    const [user1Data, user2Data] = await Promise.all([
      fetchGitHubUser(player1Username),
      fetchGitHubUser(player2Username)
    ]);

    // Calculate power levels and scaled HP
    const powerLevel1 = calculatePowerLevel(user1Data);
    const powerLevel2 = calculatePowerLevel(user2Data);
    const maxHp1 = calculateMaxHp(powerLevel1);
    const maxHp2 = calculateMaxHp(powerLevel2);

    // Determine winner (strictly greater; ties go to player2 to avoid P1 bias)
    const winner = powerLevel1 > powerLevel2 ? 1 : 2;

    // Generate battle sequence with scaled HP
    const battleSequence = generateBattleSequence(
      { username: player1Username, powerLevel: powerLevel1, maxHp: maxHp1 },
      { username: player2Username, powerLevel: powerLevel2, maxHp: maxHp2 },
      winner
    );

    // Save to MongoDB
    const battle = new Battle({
      player1: {
        username: player1Username,
        powerLevel: powerLevel1,
        maxHp: maxHp1,
        finalHp: Math.max(0, maxHp1 - battleSequence
          .filter(t => t.player === 2)
          .reduce((sum, t) => sum + t.damage, 0)),
        stats: {
          commits: Math.round(user1Data.estimatedCommits),
          repos: user1Data.publicRepos,
          followers: user1Data.followers
        }
      },
      player2: {
        username: player2Username,
        powerLevel: powerLevel2,
        maxHp: maxHp2,
        finalHp: Math.max(0, maxHp2 - battleSequence
          .filter(t => t.player === 1)
          .reduce((sum, t) => sum + t.damage, 0)),
        stats: {
          commits: Math.round(user2Data.estimatedCommits),
          repos: user2Data.publicRepos,
          followers: user2Data.followers
        }
      },
      battleSequence,
      winner
    });

    await battle.save();

    return NextResponse.json({
      battleId: battle._id,
      player1: battle.player1,
      player2: battle.player2,
      battleSequence: battle.battleSequence,
      winner: battle.winner
    });
  } catch (error: any) {
    console.error('Battle creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create battle' },
      { status: 500 }
    );
  }
}

// GET /api/battle?id=xxx - Get battle by ID
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Battle ID required' },
        { status: 400 }
      );
    }

    const battle = await Battle.findById(id);

    if (!battle) {
      return NextResponse.json(
        { error: 'Battle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(battle);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch battle' },
      { status: 500 }
    );
  }
}
