interface Player {
  username: string;
  powerLevel: number;
  maxHp: number;
}

export interface Turn {
  turn: number;
  player: 1 | 2;
  move: string;
  damage: number;
}

const MOVES = [
  "Commit Combo",
  "Public Repo Power",
  "Streak Shield Smash",
  "Code Quality Strike",
  "Fork Flurry",
  "Merge Conflict",
  "Force Push",
  "Rebase Rampage",
  "Open Source Slam",
  "PR Approval Punch"
];

export function generateBattleSequence(player1: Player, player2: Player, winner: 1 | 2): Turn[] {
  const sequence: Turn[] = [];
  let hp1 = player1.maxHp;
  let hp2 = player2.maxHp;
  
  // Target 6 to 8 turns of battle
  const numTurns = 6 + Math.floor(Math.random() * 3); 
  let turnCount = 1;
  let currentPlayer: 1 | 2 = 1;

  while (turnCount <= numTurns && hp1 > 0 && hp2 > 0) {
    const isLastTurn = turnCount === numTurns;
    let activePlayer = currentPlayer;
    
    // On the final turn, ensure the winner is the one dealing the final blow
    if (isLastTurn) {
        activePlayer = winner;
    }
    
    const defender: 1 | 2 = activePlayer === 1 ? 2 : 1;
    let damage = 0;
    
    if (isLastTurn) {
      // The final blow, deal exactly their remaining HP
      damage = defender === 1 ? hp1 : hp2;
    } else {
      const power = activePlayer === 1 ? player1.powerLevel : player2.powerLevel;
      const attackerMaxHp = activePlayer === 1 ? player1.maxHp : player2.maxHp;
      // Base damage: ~12-14% of attacker's maxHp, scaled by power level
      const baseDamage = Math.round(attackerMaxHp * (0.10 + (power / 100) * 0.06));
      // Small variance: ±3 pts — keeps power gap decisive
      damage = baseDamage + Math.floor(Math.random() * 6) - 2;
      
      // Prevent premature death unless it's the winner
      if (defender === 1 && hp1 - damage <= 0) {
        if (winner === 2) damage = hp1; // Early victory condition
        else damage = hp1 - 5; // Let them barely survive
      } else if (defender === 2 && hp2 - damage <= 0) {
        if (winner === 1) damage = hp2; // Early victory condition
        else damage = hp2 - 5; // Let them barely survive
      }
    }

    if (defender === 1) hp1 -= damage;
    else hp2 -= damage;

    const moveName = MOVES[Math.floor(Math.random() * MOVES.length)];

    sequence.push({
      turn: turnCount,
      player: activePlayer,
      move: moveName + (isLastTurn ? " (FINISH HIM!)" : ""),
      damage
    });

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    turnCount++;
  }

  return sequence;
}
