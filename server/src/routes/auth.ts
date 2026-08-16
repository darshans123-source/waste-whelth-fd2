import { Router, Request, Response } from 'express';
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
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
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
