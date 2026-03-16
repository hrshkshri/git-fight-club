# GIT FIGHT CLUB
## Tech Stack Implementation Guide

---

## 1. Tech Stack Overview

Git Fight Club uses a modern, proven stack optimized for rapid development and scalability.

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | Interactive UI, animations |
| **Styling** | Tailwind CSS + Custom CSS | Retro pixel art theme |
| **Animations** | Framer Motion | Smooth combat sequences |
| **Audio** | Web Audio API (native) | 8-bit sound synthesis |
| **Icons** | Lucide React | UI icons |
| **HTTP Client** | Axios | API requests |
| **Backend** | Node.js + Express | API server, battle logic |
| **Language** | TypeScript | Type-safe code |
| **Database ORM** | Mongoose | MongoDB object modeling |
| **GitHub API** | Octokit | Fetch user commit data |
| **CORS** | cors middleware | Cross-origin requests |
| **Env Variables** | dotenv | Configuration management |
| **Database** | MongoDB Atlas | Cloud database |
| **Frontend Deploy** | Vercel | Auto-deploy on git push |
| **Backend Deploy** | Railway / Render | Simple, git-based deploys |

---

## 2. Frontend Setup

### 2.1 Project Initialization

Create a new React app with TypeScript using Vite (faster than CRA):

```bash
npm create vite@latest git-fight-club -- --template react-ts
cd git-fight-club
npm install
```

### 2.2 Install Dependencies

```bash
npm install tailwindcss framer-motion lucide-react axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2.3 Dependency Details

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.0 | UI framework |
| typescript | ^5.0 | Type safety |
| tailwindcss | ^3.0 | Utility-first CSS |
| framer-motion | ^10.0 | Animation library |
| lucide-react | latest | Icon library |
| axios | ^1.6 | HTTP client for API calls |
| vite | ^5.0 | Build tool (much faster than webpack) |

### 2.4 Project Structure

```
git-fight-club/
├── src/
│   ├── components/
│   │   ├── BattleArena.tsx          # Main battle screen
│   │   ├── SetupScreen.tsx          # Username input screen
│   │   ├── VictoryScreen.tsx        # Winner announcement
│   │   ├── LoadingScreen.tsx        # Data analysis loading
│   │   └── PreFightIntro.tsx        # "GET READY" screen
│   │
│   ├── hooks/
│   │   ├── useAudio.ts             # Web Audio API wrapper
│   │   ├── useBattle.ts            # Battle state management
│   │   └── useAnimation.ts         # Framer Motion helpers
│   │
│   ├── types/
│   │   └── battle.ts               # TypeScript interfaces
│   │
│   ├── utils/
│   │   ├── api.ts                  # Axios instance & API calls
│   │   ├── sounds.ts               # Sound synthesis utilities
│   │   └── animations.ts           # Animation presets
│   │
│   ├── styles/
│   │   ├── index.css               # Global styles + Tailwind
│   │   └── retro.css               # Retro pixel art theme
│   │
│   ├── App.tsx                     # Main component
│   ├── main.tsx                    # Entry point
│   └── vite-env.d.ts               # Vite env types
│
├── public/                         # Static assets
│   └── fonts/                      # Press Start 2P, VT323
│
├── .env.example                    # Environment template
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
└── package.json
```

### 2.5 Environment Variables

Create `.env.local` in your frontend root:

```env
VITE_API_URL=http://localhost:5000
VITE_ENVIRONMENT=development
```

For production:
```env
VITE_API_URL=https://your-backend.railway.app
VITE_ENVIRONMENT=production
```

### 2.6 Tailwind Configuration

**tailwind.config.js**:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['VT323', 'monospace'],
        display: ['Press Start 2P', 'monospace'],
      },
      colors: {
        neon: {
          green: '#00ff00',
          cyan: '#00ffff',
          magenta: '#ff00ff',
          yellow: '#ffff00',
        }
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shake: 'shake 0.15s ease-in-out',
      }
    },
  },
  plugins: [],
}
```

### 2.7 Develop & Build Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 3. Backend Setup

### 3.1 Project Initialization

```bash
mkdir git-fight-club-server
cd git-fight-club-server
npm init -y
npm install express cors dotenv mongoose
npm install --save-dev typescript @types/express @types/node ts-node nodemon
npx tsc --init
```

### 3.2 Install Additional Dependencies

```bash
# GitHub API client
npm install octokit

# Development dependencies
npm install -D @types/cors
```

### 3.3 Dependency Details

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18 | Web server framework |
| mongoose | ^7.0 | MongoDB object modeling |
| octokit | ^2.0 | GitHub API client |
| cors | ^2.8 | Cross-origin request handling |
| dotenv | ^16.0 | Environment variables |
| typescript | ^5.0 | Type safety |
| ts-node | latest | Run TypeScript directly |
| nodemon | latest | Auto-restart on file changes |

### 3.4 Project Structure

```
git-fight-club-server/
├── src/
│   ├── routes/
│   │   ├── battle.ts               # POST /api/battle, GET /api/battle/:id
│   │   ├── leaderboard.ts          # GET /api/leaderboard
│   │   └── health.ts               # GET /api/health (for monitoring)
│   │
│   ├── models/
│   │   ├── Battle.ts               # MongoDB Battle schema
│   │   ├── User.ts                 # MongoDB User schema (optional)
│   │   └── index.ts                # Export all models
│   │
│   ├── controllers/
│   │   ├── battleController.ts     # Battle logic & endpoints
│   │   └── leaderboardController.ts # Leaderboard logic
│   │
│   ├── utils/
│   │   ├── scoring.ts              # Power level calculation
│   │   ├── github.ts               # GitHub API wrapper (Octokit)
│   │   ├── battle.ts               # Battle sequence generation
│   │   └── cache.ts                # Simple in-memory caching
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts         # Global error handler
│   │   └── logger.ts               # Request logging
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   │
│   ├── app.ts                      # Express app configuration
│   └── server.ts                   # Server startup
│
├── .env.example                    # Environment template
├── .gitignore
├── tsconfig.json                   # TypeScript config
├── nodemon.json                    # Nodemon config
└── package.json
```

### 3.5 Environment Variables

Create `.env` in backend root:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/git-fight-club

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# CORS
CLIENT_URL=http://localhost:5173
```

Get `GITHUB_TOKEN`:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`, `user`
4. Copy token and add to `.env`

### 3.6 TypeScript Configuration

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 3.7 Nodemon Configuration

**nodemon.json**:
```json
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.test.ts"],
  "exec": "ts-node",
  "env": {
    "NODE_ENV": "development"
  }
}
```

### 3.8 Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 3.9 Start Development Server

```bash
npm run dev
# Server runs on http://localhost:5000
```

---

## 4. Database Setup

### 4.1 MongoDB Atlas (Cloud Database - Recommended)

**Why Atlas?**
- Free M0 tier (512MB storage, unlimited connections)
- Zero installation required
- Automatic backups
- Scales easily

**Setup Steps:**

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with email

2. **Create Cluster**
   - Click "Create Deployment"
   - Choose "M0 Free" tier
   - Select region closest to you (Asia: Singapore, Asia-Pacific)
   - Click "Create Cluster"

3. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Click "Connect Your Application"
   - Copy connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/git-fight-club?retryWrites=true&w=majority`

4. **Add to .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/git-fight-club?retryWrites=true&w=majority
   ```

5. **Configure IP Whitelist**
   - Go to "Network Access"
   - Click "Allow Access from Anywhere" (for development)
   - For production: add specific IPs

### 4.2 MongoDB Schema Design

**Battle Collection:**
```javascript
{
  _id: ObjectId,
  player1: {
    username: String,
    powerLevel: Number,
    maxHp: Number,
    finalHp: Number,
    score: Number
  },
  player2: {
    username: String,
    powerLevel: Number,
    maxHp: Number,
    finalHp: Number,
    score: Number
  },
  battleSequence: [
    {
      turn: Number,
      player: 1 | 2,
      move: String,
      damage: Number
    }
  ],
  winner: 1 | 2,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 Mongoose Model Example

**models/Battle.ts:**
```typescript
import mongoose from 'mongoose';

const battleSchema = new mongoose.Schema({
  player1: {
    username: { type: String, required: true },
    powerLevel: { type: Number, required: true },
    maxHp: { type: Number, default: 100 },
    finalHp: { type: Number },
    score: { type: Number }
  },
  player2: {
    username: { type: String, required: true },
    powerLevel: { type: Number, required: true },
    maxHp: { type: Number, default: 100 },
    finalHp: { type: Number },
    score: { type: Number }
  },
  battleSequence: [{
    turn: Number,
    player: Number,
    move: String,
    damage: Number
  }],
  winner: { type: Number, enum: [1, 2] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Battle = mongoose.model('Battle', battleSchema);
```

---

## 5. API Configuration

### 5.1 Express App Setup

**src/app.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/battle', require('./routes/battle'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
```

### 5.2 Server Startup

**src/server.ts:**
```typescript
import app from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ MongoDB connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

---

## 6. Deployment

### 6.1 Frontend: Deploy to Vercel

**Why Vercel?**
- Zero-config deployment
- Auto-deploy on git push
- Free tier includes custom domains
- Perfect for Next.js & React

**Steps:**

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - Under "Settings" → "Environment Variables"
   - Add: `VITE_API_URL=https://your-backend-url.railway.app`
   - Click "Save"

4. **Deploy**
   - Vercel auto-deploys on git push
   - Get production URL from Vercel dashboard

### 6.2 Backend: Deploy to Railway

**Why Railway?**
- Simple git-based deployments
- $5/month free credit
- Easy environment variable management
- Good for full-stack startups

**Steps:**

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Railway**
   - Go to https://railway.app
   - Sign up / Log in
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your backend repository

3. **Configure Environment Variables**
   - Go to project settings
   - Add variables:
     - `MONGODB_URI`: (from MongoDB Atlas)
     - `GITHUB_TOKEN`: (from GitHub)
     - `CLIENT_URL`: (your Vercel frontend URL)
     - `PORT`: `5000`
     - `NODE_ENV`: `production`

4. **Add start script to package.json**
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/server.js"
     }
   }
   ```

5. **Deploy**
   - Railway auto-deploys on git push
   - Get backend URL from Railway dashboard (e.g., `https://project-name.railway.app`)

### 6.3 Database: MongoDB Atlas is Already Cloud

No additional setup needed! MongoDB Atlas handles everything:
- Automatic backups
- Monitoring & alerts
- Scaling
- Security patches

---

## 7. Key Tools & Resources

### GitHub API (Octokit)

**Official Documentation**: https://octokit.github.io/rest.js/

**Get Personal Access Token**:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`, `user`
4. Copy and add to `.env` as `GITHUB_TOKEN`

**Rate Limits**:
- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour per user
- **Best practice**: Cache user data for 24 hours

**Example Usage**:
```typescript
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const user = await octokit.rest.users.getByUsername({
  username: 'harsh_dev'
});
```

### Mongoose (MongoDB)

**Official Documentation**: https://mongoosejs.com/

**Key Features**:
- Schema validation
- Type safety with TypeScript
- Built-in middleware (hooks)
- Query building

**Basic Model**:
```typescript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
```

### Framer Motion

**Official Documentation**: https://www.framer.com/motion/

**Perfect for**:
- Combat animations
- Screen transitions
- Health bar fills
- Damage numbers floating

**Example**:
```typescript
import { motion } from 'framer-motion';

export function HealthBar({ value, max }: Props) {
  return (
    <motion.div
      animate={{ width: `${(value / max) * 100}%` }}
      transition={{ duration: 0.5 }}
      className="bg-red-500 h-4"
    />
  );
}
```

### Web Audio API

**MDN Guide**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

**Good for**:
- Synthesizing 8-bit sounds
- No external dependencies
- Built into all modern browsers
- Low latency

**Basic Example**:
```typescript
const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain();

osc.connect(gain);
gain.connect(ctx.destination);

osc.frequency.value = 440;
gain.gain.setValueAtTime(0.3, ctx.currentTime);

osc.start();
osc.stop(ctx.currentTime + 0.1);
```

---

## 8. Development Workflow

### Local Development

```bash
# Terminal 1: Start Backend
cd git-fight-club-server
npm run dev
# Server on http://localhost:5000

# Terminal 2: Start Frontend
cd git-fight-club
npm run dev
# App on http://localhost:5173
```

### Testing API Locally

Use Postman or VS Code REST Client:

**test.http**:
```http
POST http://localhost:5000/api/battle
Content-Type: application/json

{
  "player1Username": "torvalds",
  "player2Username": "gvanrossum"
}
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/battle-animations

# Make changes, commit
git add .
git commit -m "Add battle animations"

# Push to GitHub
git push origin feature/battle-animations

# Create PR on GitHub
# Auto-deploys preview on Vercel

# Merge PR → auto-deploys to production
```

---

## 9. Monitoring & Debugging

### Backend Logging

Add simple logging:
```typescript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Check Deployment Status

**Vercel**: https://vercel.com/dashboard
**Railway**: https://railway.app/dashboard
**MongoDB**: https://cloud.mongodb.com

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Check `CLIENT_URL` in backend `.env` |
| MongoDB connection fails | Check IP whitelist in Atlas, verify URI |
| API returns 404 | Verify `VITE_API_URL` in frontend `.env` |
| Rate limit exceeded | Implement caching for GitHub API calls |

---

## 10. Next Steps

1. **Set up MongoDB Atlas** ✅ 5 min
2. **Get GitHub Personal Access Token** ✅ 2 min
3. **Initialize frontend repo** ✅ 5 min
4. **Initialize backend repo** ✅ 5 min
5. **Build scoring algorithm** 🚀 Start here
6. **Create Battle API endpoint** 🚀 Then here
7. **Build React components** 🚀 Then here
8. **Deploy to Vercel + Railway** 🚀 Finally here

---

**Happy coding! 🎮**
