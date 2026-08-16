import express from 'express';
import cors from 'cors';
import { CONFIG } from './config';
import { authRouter } from './routes/auth';
import { gameRouter } from './routes/game';
import { leaderboardRouter } from './routes/leaderboard';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/game', gameRouter);
app.use('/api/leaderboard', leaderboardRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Waste to Wealth Server', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Uncaught Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message || 'Something went wrong' });
});

if (!process.env.VERCEL) {
  app.listen(CONFIG.PORT, () => {
    console.log(`=============================================`);
    console.log(`🌱 Waste to Wealth Backend running on http://localhost:${CONFIG.PORT}`);
    console.log(`🔑 Google Auth Configured: ${Boolean(CONFIG.GOOGLE_CLIENT_ID)}`);
    console.log(`=============================================`);
  });
}

export { app };
export default app;
