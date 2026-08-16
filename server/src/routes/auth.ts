import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { db, initialWasteInventory, initialProductInventory, initialUpgrades, defaultMissions, defaultAchievements } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const JWT_SECRET = process.env.SESSION_SECRET || 'waste_to_wealth_super_secret_session_key_2026';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Get Google OAuth Client Status
router.get('/config', (req: Request, res: Response) => {
  res.json({
    googleConfigured: Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.length > 5 && !GOOGLE_CLIENT_ID.includes('your-google-client-id')),
    clientId: GOOGLE_CLIENT_ID || null
  });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userStmt = db.prepare('SELECT id, email, name, picture, is_demo FROM users WHERE id = ?');
  const user = userStmt.get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

// POST /api/auth/demo
router.post('/demo', (req: Request, res: Response) => {
  try {
    const demoEmail = 'demo@wastetowealth.org';
    const demoId = 'demo-user-101';
    
    // Check if demo user exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(demoEmail) as any;
    
    if (!user) {
      const now = new Date().toISOString();
      db.prepare('INSERT INTO users (id, google_id, email, name, picture, is_demo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(demoId, 'demo-google-id', demoEmail, 'Eco Warrior Demo', 'https://api.dicebear.com/7.x/bottts/svg?seed=EcoWarrior', 1, now);
      
      // Initialize demo game state
      db.prepare(`
        INSERT INTO game_states (
          user_id, money, xp, green_score, city_level,
          total_waste_collected, total_waste_recycled, total_products_sold, total_profit,
          waste_inventory, product_inventory, upgrades, missions, achievements, active_event, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        demoId, 5000, 0, 0, 1,
        0, 0, 0, 0,
        JSON.stringify(initialWasteInventory),
        JSON.stringify(initialProductInventory),
        JSON.stringify(initialUpgrades),
        JSON.stringify(defaultMissions),
        JSON.stringify(defaultAchievements),
        null,
        now
      );

      user = { id: demoId, email: demoEmail, name: 'Eco Warrior Demo', picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=EcoWarrior', is_demo: 1 };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, picture: user.picture, isDemo: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isDemo: true
      }
    });
  } catch (err: any) {
    console.error('Demo auth error:', err);
    res.status(500).json({ error: 'Failed to create demo session: ' + err.message });
  }
});

// POST /api/auth/google
router.post('/google', async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Missing Google credential token' });
  }

  if (!client || !GOOGLE_CLIENT_ID) {
    return res.status(400).json({ error: 'Google OAuth is not configured on the server. Please set GOOGLE_CLIENT_ID in .env' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token payload' });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || 'Eco Player';
    const picture = payload.picture || '';

    let user = db.prepare('SELECT * FROM users WHERE google_id = ? OR email = ?').get(googleId, email) as any;
    const now = new Date().toISOString();

    if (!user) {
      const userId = 'usr_' + Date.now().toString(36);
      db.prepare('INSERT INTO users (id, google_id, email, name, picture, is_demo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(userId, googleId, email, name, picture, 0, now);

      db.prepare(`
        INSERT INTO game_states (
          user_id, money, xp, green_score, city_level,
          total_waste_collected, total_waste_recycled, total_products_sold, total_profit,
          waste_inventory, product_inventory, upgrades, missions, achievements, active_event, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId, 5000, 0, 0, 1,
        0, 0, 0, 0,
        JSON.stringify(initialWasteInventory),
        JSON.stringify(initialProductInventory),
        JSON.stringify(initialUpgrades),
        JSON.stringify(defaultMissions),
        JSON.stringify(defaultAchievements),
        null,
        now
      );

      user = { id: userId, google_id: googleId, email, name, picture, is_demo: 0 };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, picture: user.picture, isDemo: false },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isDemo: false
      }
    });
  } catch (err: any) {
    console.error('Google Auth error:', err);
    res.status(401).json({ error: 'Failed to verify Google token: ' + err.message });
  }
});

export default router;
