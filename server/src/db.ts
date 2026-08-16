import fs from 'fs';
import path from 'path';
import { User, GameState, LeaderboardEntry } from './types';
import { CONFIG } from './config';
import { createInitialGameState } from './services/defaultState';

interface DatabaseSchema {
  users: Record<string, User>;
  gameStates: Record<string, GameState>;
  sampleLeaderboard: LeaderboardEntry[];
}

const samplePlayers: LeaderboardEntry[] = [
  {
    userId: 'bot_1',
    name: 'Aarav Sharma (EcoChampion)',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    greenScore: 94,
    totalWasteRecycled: 4200,
    levelTitle: '🌍 Green City',
    level: 5,
    totalProfit: 125000,
  },
  {
    userId: 'bot_2',
    name: 'Priya Patel (BioEnergy)',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    greenScore: 88,
    totalWasteRecycled: 2850,
    levelTitle: '🌆 Smart City',
    level: 4,
    totalProfit: 78000,
  },
  {
    userId: 'bot_3',
    name: 'Vikram Mehta (ZeroWaste)',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    greenScore: 76,
    totalWasteRecycled: 1650,
    levelTitle: '🏙️ City',
    level: 3,
    totalProfit: 42000,
  },
  {
    userId: 'bot_4',
    name: 'Ananya Roy (CircularLife)',
    picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
    greenScore: 62,
    totalWasteRecycled: 850,
    levelTitle: '🏘️ Town',
    level: 2,
    totalProfit: 19500,
  },
  {
    userId: 'bot_5',
    name: 'Rohan Gupta (CleanEarth)',
    picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    greenScore: 45,
    totalWasteRecycled: 420,
    levelTitle: '🏘️ Town',
    level: 2,
    totalProfit: 11000,
  },
];

class Database {
  private data: DatabaseSchema = {
    users: {},
    gameStates: {},
    sampleLeaderboard: samplePlayers,
  };
  private filePath: string;

  constructor() {
    this.filePath = CONFIG.DATABASE_FILE;
    this.init();
  }

  private init() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || {},
          gameStates: parsed.gameStates || {},
          sampleLeaderboard: parsed.sampleLeaderboard || samplePlayers,
        };
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  public getUser(id: string): User | null {
    return this.data.users[id] || null;
  }

  public getUserByEmail(email: string): User | null {
    return Object.values(this.data.users).find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public saveUser(user: User): User {
    this.data.users[user.id] = {
      ...user,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.users[user.id];
  }

  public getGameState(userId: string): GameState {
    if (!this.data.gameStates[userId]) {
      this.data.gameStates[userId] = createInitialGameState(userId);
      this.save();
    }
    return this.data.gameStates[userId];
  }

  public saveGameState(state: GameState): GameState {
    this.data.gameStates[state.userId] = state;
    this.save();
    return state;
  }

  public resetGameState(userId: string): GameState {
    const freshState = createInitialGameState(userId);
    this.data.gameStates[userId] = freshState;
    this.save();
    return freshState;
  }

  public getLeaderboard(): LeaderboardEntry[] {
    // Combine real users with sample players
    const realEntries: LeaderboardEntry[] = Object.values(this.data.users).map((user) => {
      const state = this.data.gameStates[user.id] || createInitialGameState(user.id);
      return {
        userId: user.id,
        name: user.name,
        picture: user.picture,
        greenScore: state.greenScore,
        totalWasteRecycled: state.stats.totalWasteRecycled,
        levelTitle: state.levelTitle,
        level: state.level,
        totalProfit: state.stats.totalProfit,
      };
    });

    const all = [...realEntries, ...this.data.sampleLeaderboard];
    // Sort descending by Green Score then by total waste recycled
    all.sort((a, b) => {
      if (b.greenScore !== a.greenScore) {
        return b.greenScore - a.greenScore;
      }
      return b.totalWasteRecycled - a.totalWasteRecycled;
    });

    return all.slice(0, 20);
  }
}

export const db = new Database();
