import { Router, Request, Response } from 'express';
import { db } from '../db';

<<<<<<< HEAD
export const leaderboardRouter = Router();

// Get top 20 players on circular leaderboard
leaderboardRouter.get('/', (req: Request, res: Response) => {
  const leaderboard = db.getLeaderboard();
  res.json({ leaderboard });
});
=======
const router = Router();

// Sample players to populate leaderboard for initial demo
const SAMPLE_LEADERBOARD = [
  { id: 'bot_1', name: 'Aarav Sharma 🌿', picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav', greenScore: 92, totalWasteRecycled: 1420, cityLevel: 5, rank: 1 },
  { id: 'bot_2', name: 'Priya Patel ♻️', picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya', greenScore: 86, totalWasteRecycled: 980, cityLevel: 4, rank: 2 },
  { id: 'bot_3', name: 'Rohan Gupta 🌍', picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rohan', greenScore: 78, totalWasteRecycled: 750, cityLevel: 4, rank: 3 },
  { id: 'bot_4', name: 'Ananya Verma 🌱', picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya', greenScore: 65, totalWasteRecycled: 520, cityLevel: 3, rank: 4 }
];

router.get('/', (req: Request, res: Response) => {
  try {
    const rows = db.prepare(`
      SELECT u.id, u.name, u.picture, g.green_score, g.total_waste_recycled, g.city_level
      FROM users u
      JOIN game_states g ON u.id = g.user_id
      ORDER BY g.green_score DESC, g.total_waste_recycled DESC
      LIMIT 10
    `).all() as any[];

    const formatted = rows.map((r, index) => ({
      id: r.id,
      name: r.name,
      picture: r.picture || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + r.name,
      greenScore: r.green_score,
      totalWasteRecycled: r.total_waste_recycled,
      cityLevel: r.city_level,
      rank: index + 1
    }));

    // Combine real players with sample bots if needed
    const combined = [...formatted];
    for (const bot of SAMPLE_LEADERBOARD) {
      if (!combined.some(p => p.id === bot.id)) {
        combined.push(bot);
      }
    }

    combined.sort((a, b) => b.greenScore - a.greenScore || b.totalWasteRecycled - a.totalWasteRecycled);
    combined.forEach((item, idx) => { item.rank = idx + 1; });

    res.json({ leaderboard: combined });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch leaderboard: ' + err.message });
  }
});

export default router;
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
