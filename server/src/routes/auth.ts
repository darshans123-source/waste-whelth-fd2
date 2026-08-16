import { Router, Request, Response } from 'express';
<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import { CONFIG } from '../config';
import { db } from '../db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { User } from '../types';

export const authRouter = Router();

const googleClient = CONFIG.GOOGLE_CLIENT_ID
  ? new OAuth2Client(CONFIG.GOOGLE_CLIENT_ID, CONFIG.GOOGLE_CLIENT_SECRET, CONFIG.GOOGLE_CALLBACK_URL)
  : null;

// Get Auth Configuration Status
authRouter.get('/config', (req: Request, res: Response) => {
  res.json({
    googleConfigured: Boolean(CONFIG.GOOGLE_CLIENT_ID && CONFIG.GOOGLE_CLIENT_ID.length > 5),
    googleClientId: CONFIG.GOOGLE_CLIENT_ID || null,
  });
});

// Google OAuth Login
authRouter.post('/google', async (req: Request, res: Response) => {
  const { credential } = req.body;
  if (!credential) {
    res.status(400).json({ error: 'Missing Google ID token / credential' });
    return;
  }

  if (!googleClient || !CONFIG.GOOGLE_CLIENT_ID) {
    res.status(500).json({ error: 'Google OAuth is not configured on the server. Please check your .env file.' });
    return;
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: CONFIG.GOOGLE_CLIENT_ID,
=======
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
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
<<<<<<< HEAD
      res.status(400).json({ error: 'Invalid Google token payload' });
      return;
    }

    const email = payload.email;
    let user = db.getUserByEmail(email);

    if (!user) {
      user = {
        id: `usr_${uuidv4().substring(0, 8)}`,
        email,
        name: payload.name || 'Eco Warrior',
        picture: payload.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
        isDemo: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.saveUser(user);
    } else {
      // Update name/picture if changed
      user.name = payload.name || user.name;
      user.picture = payload.picture || user.picture;
      db.saveUser(user);
    }

    const token = jwt.sign({ userId: user.id }, CONFIG.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user,
      message: 'Logged in successfully with Google',
    });
  } catch (err: any) {
    console.error('Google OAuth verification failed:', err);
    res.status(401).json({ error: 'Google authentication failed: ' + (err.message || 'Invalid token') });
  }
});

// Demo Login
authRouter.post('/demo', (req: Request, res: Response) => {
  const demoEmail = 'demo_manager@wastetowealth.eco';
  let user = db.getUserByEmail(demoEmail);

  if (!user) {
    user = {
      id: 'usr_demo_manager_1',
      email: demoEmail,
      name: 'Eco Manager (Demo)',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.saveUser(user);
  }

  const token = jwt.sign({ userId: user.id }, CONFIG.JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user,
    message: 'Logged in as Demo User',
  });
});

// Current User Profile
authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: req.user,
  });
});

// Logout
authRouter.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});
=======
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
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
