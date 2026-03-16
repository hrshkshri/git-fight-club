# GIT FIGHT CLUB
## Project Documentation & Specification

---

## 1. Project Overview

Git Fight Club is a web-based gaming platform where two GitHub developers battle each other in a retro arcade-style combat arena. The system analyzes historical GitHub account data to determine winners, then visualizes the battle with pixel art animations, sound effects, voice lines, and dramatic Mortal Combat-inspired visuals.

### Core Vision

- Users enter two GitHub usernames
- Backend analyzes historical data to determine winner
- Frontend displays dramatic turn-based pixel art battle
- Winner is revealed with celebration animations

---

## 2. Game Mechanics

### Scoring Parameters

The backend evaluates both GitHub accounts across multiple dimensions to calculate a **power level** and determine the winner:

| Parameter | Description | Weight |
|-----------|-------------|--------|
| Commit Frequency | Total commits in past 6 months | 25% |
| Public Repos | Public repository activity (weighted higher than private) | 30% |
| Consistency | Commit streaks, daily activity patterns | 20% |
| Code Quality | PR reviews, code complexity, test coverage | 15% |
| Influence | Stars, forks, followers earned | 10% |

### Turn-Based Combat Flow

1. Player A executes a move (commit, public repo power, streak bonus, etc.)
2. Damage is applied to Player B
3. Player B executes a counter-move
4. Sequence continues for ~6-8 exchanges
5. Winner declared (predetermined by backend scoring)

### Move Examples

| Move | Based On | Damage Range |
|------|----------|--------------|
| Commit Combo | Raw commit count | 10-20 dmg |
| Public Repo Power | Public repo contribution ratio | 15-25 dmg |
| Streak Shield | Active commit streak length | 8-15 dmg |
| Code Quality Strike | PR review quality, test coverage | 12-22 dmg |

---

## 3. UI/UX Design Specification

### Visual Aesthetic

- **Style**: Retro pixel art (NES Contra 8-bit style)
- **Background**: Grid background with neon green lines
- **Colors**: Bold primaries - Cyan, Red, Yellow, Magenta
- **Fonts**: Monospace fonts (VT323, Press Start 2P for titles)
- **Elements**: Color-coded health bars and UI elements

### Screen Flow

#### Screen 1: Setup
- Input fields for two GitHub usernames
- "ANALYZE & PREPARE FOR BATTLE" button
- Minimal, clean layout

#### Screen 2: Analysis Loading
- Progress bar with loading text
- Dramatic music/SFX plays
- ~3-5 seconds duration

#### Screen 3: Pre-Fight Intro
- "GET READY" text with flashing animation
- Both players displayed with power levels
- Orchestral sting sound plays
- Auto-transitions to battle after 3-4 seconds

#### Screen 4: Battle Arena
- Pixel art fighters on left/right sides
- Health bars above each fighter
- Turn-by-turn combat animations
- Combat log showing moves + damage
- Screen shake on impact
- Sound effects for each move

#### Screen 5: Victory Screen
- Winner announced with celebration animation
- Victory fanfare plays
- Final scores displayed
- "Start New Battle" button

### Sensory Experience

#### Sound Effects (8-bit Synthesized)
- Punch/impact sounds
- Explosion sounds for high-damage moves
- Victory fanfare (ascending note sequence)
- Defeat sound (descending notes)
- Background music during analysis/fight

#### Voice Lines (8-bit TTS)
- "GET READY" at intro
- Move names announced (e.g., "COMMIT COMBO!")
- "FINISH HIM!" when opponent health is low
- "[USERNAME] WINS!" at end

#### Visual Effects
- Screen shake on damaging moves
- Health bar drain animation
- Damage numbers floating up from impact point
- Flash white on impact
- Combo text ("CRITICAL HIT!", "PERFECT!")
- Victory confetti animation

---

## 4. Technology Stack

### Frontend
- **React 18 + TypeScript** — Interactive UI, animations
- **Tailwind CSS + Custom CSS** — Retro pixel art theme
- **Framer Motion** — Smooth combat sequences
- **Web Audio API (native)** — 8-bit sound synthesis
- **Lucide React** — Icons
- **Axios** — HTTP requests

### Backend
- **Node.js + Express** — API server, battle logic
- **TypeScript** — Type-safe code
- **Mongoose** — MongoDB ODM
- **Octokit** — GitHub API client
- **CORS** — Cross-origin request handling
- **dotenv** — Environment variables

### Database
- **MongoDB Atlas** — Cloud database (free tier available)
- **Collections**: Battle, User, Leaderboard

### External APIs
- **GitHub API (Octokit)** — Fetch user commit data, repos, followers

### Deployment
- **Frontend**: Vercel (auto-deploy on git push)
- **Backend**: Railway or Render (simple, git-based deploys)
- **Database**: MongoDB Atlas (free M0 cluster)

---

## 5. Backend Logic

### Data Collection

- Fetch GitHub user data (commits, repos, followers)
- Analyze last 6 months of activity
- Calculate separate scores for public vs. private repos
- Determine active streaks and consistency patterns

### Scoring Algorithm

```
Power Level = (commits × 0.25) + (public_ratio × 0.30) + (consistency × 0.20) + (quality × 0.15) + (influence × 0.10)
```

- Higher power level = stronger opening moves
- Winner determined before animation begins
- Both accounts get independent scores

### Battle Sequence Generation

- Generate 6-8 turn exchanges
- Select moves based on each account's scoring breakdown
- Assign damage values (weighted to favor winner overall)
- Ensure winner defeats loser by end of sequence
- Battle sequence is deterministic and replayable

---

## 6. API Endpoints

### POST /api/battle
**Create a new battle**
- **Request Body**:
  ```json
  {
    "player1Username": "harsh_dev",
    "player2Username": "other_dev"
  }
  ```
- **Response**:
  ```json
  {
    "battleId": "123abc",
    "player1": { "username": "harsh_dev", "powerLevel": 8.5, "maxHp": 100 },
    "player2": { "username": "other_dev", "powerLevel": 7.2, "maxHp": 100 },
    "battleSequence": [...],
    "winner": 1,
    "createdAt": "2024-01-01T12:00:00Z"
  }
  ```

### GET /api/battle/:id
**Get battle data**
- **Response**: Full battle details (see above)

### GET /api/leaderboard
**Get top winners**
- **Query Parameters**: 
  - `limit`: number of results (default: 10)
  - `timeframe`: "all", "week", "month" (default: "all")
- **Response**:
  ```json
  {
    "leaderboard": [
      {
        "rank": 1,
        "username": "harsh_dev",
        "wins": 42,
        "averagePowerLevel": 8.5,
        "lastBattle": "2024-01-15T10:30:00Z"
      }
    ]
  }
  ```

---

## 7. Future Features (Phase 2+)

- Tournament mode (8+ players bracket)
- User profiles + match history
- Custom power-ups (temporary boosts)
- Multiplayer live battles
- Mobile app (React Native)
- Streaming integration (Twitch overlay)
- Achievement badges (build streaks, code quality, etc.)
- Replay system (watch past battles)
- Skill-based matchmaking
- Global rankings by language/region

---

## 8. Development Milestones

### Phase 1: Backend & Setup (2 weeks)
**Tasks**:
- Backend: GitHub data collection
- Backend: Scoring algorithm
- Frontend: UI screens 1-2 (setup, loading)
- Database: Schema design & setup

**Deliverables**:
- Working API for battle creation
- Scoring system tested with real GitHub data
- Basic setup screens working

### Phase 2: Battle Arena & Animations (2 weeks)
**Tasks**:
- Frontend: Battle arena (screen 4)
- Pixel art fighters & animations
- Web Audio synthesis for SFX
- Combat log UI
- Screen shake effects

**Deliverables**:
- Smooth turn-based combat animations
- All sound effects working
- Victory/defeat conditions

### Phase 3: Polish & Launch (1 week)
**Tasks**:
- Victory screen with confetti
- Leaderboard page
- Testing & bug fixes
- Deploy to production
- Documentation

**Deliverables**:
- Fully working game
- Live on Vercel + Railway
- Shareable battle links

---

## 9. Technical Notes

### GitHub API Rate Limiting
- Unauthenticated: 60 requests/hour
- With Personal Access Token: 5,000 requests/hour
- **Solution**: Cache user data for 24 hours to minimize API calls
- Get token: GitHub Settings → Developer Settings → Personal Access Tokens

### Web Audio API
- Use oscillators + gain nodes for retro 8-bit sound
- Pre-synthesize common sounds to avoid latency
- Implement sound toggle for accessibility
- Test across browsers (iOS Safari has audio restrictions)

### Animation Performance
- Use CSS transforms (translate, scale) for smooth 60fps animations
- Avoid repaints and layout thrashing
- Consider `will-change` CSS property for animated elements
- Test on lower-end devices

### State Management
- Use React Context or Zustand for game state
- Keep battle sequence deterministic for replaying matches
- Store turn order, HP, damage dealt in global state

### Security Considerations
- Never expose GitHub token in frontend code (use env variables)
- Validate usernames before API calls (prevent injection)
- Rate-limit battle creation endpoint (prevent spam)
- CORS configuration: only allow requests from your frontend domain

---

## 10. Getting Started

### Quick Setup Checklist
- [ ] Create GitHub Personal Access Token
- [ ] Create MongoDB Atlas account & cluster
- [ ] Set up environment variables
- [ ] Clone both frontend & backend repos
- [ ] Install dependencies
- [ ] Start development servers
- [ ] Test initial API call
- [ ] Design pixel art characters

### Useful Resources
- **React Docs**: https://react.dev
- **GitHub API (Octokit)**: https://octokit.github.io/rest.js/
- **Mongoose Docs**: https://mongoosejs.com/
- **Framer Motion**: https://www.framer.com/motion/
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 11. File Structure Reference

### Frontend
```
git-fight-club/
├── src/
│   ├── components/
│   │   ├── BattleArena.tsx
│   │   ├── SetupScreen.tsx
│   │   ├── VictoryScreen.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── PreFightIntro.tsx
│   ├── hooks/
│   │   ├── useAudio.ts
│   │   └── useBattle.ts
│   ├── types/
│   │   └── battle.ts
│   ├── utils/
│   │   ├── api.ts
│   │   └── animations.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── public/
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Backend
```
git-fight-club-server/
├── src/
│   ├── routes/
│   │   ├── battle.ts
│   │   ├── leaderboard.ts
│   │   └── health.ts
│   ├── models/
│   │   ├── Battle.ts
│   │   └── User.ts
│   ├── controllers/
│   │   ├── battleController.ts
│   │   └── leaderboardController.ts
│   ├── utils/
│   │   ├── scoring.ts
│   │   ├── github.ts
│   │   └── battle.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── app.ts
│   └── server.ts
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 12. Success Metrics

By end of Phase 3, you should have:
- ✅ Functional backend scoring system
- ✅ Real-time battle animations
- ✅ 8-bit sound effects
- ✅ Working GitHub API integration
- ✅ MongoDB leaderboard
- ✅ Deployed to production
- ✅ Shareable battle links
- ✅ Mobile responsive

---

**Built with ❤️ for developers who love code, games, and competition!**
