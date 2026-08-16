import { Router, Request, Response } from 'express';
import { db } from '../db';

export const leaderboardRouter = Router();

// Get top 20 players on circular leaderboard
leaderboardRouter.get('/', (req: Request, res: Response) => {
  const leaderboard = db.getLeaderboard();
  res.json({ leaderboard });
});
