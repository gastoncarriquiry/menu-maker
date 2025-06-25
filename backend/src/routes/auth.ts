import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const authService = new AuthService();

// Registration endpoint
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;

    // Basic validation
    if (!email || !username || !password) {
      res
        .status(400)
        .json({ error: 'Email, username, and password are required' });
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ error: 'Password must be at least 8 characters long' });
      return;
    }

    const result = await authService.register(email, username, password);

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Registration failed',
    });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      res
        .status(400)
        .json({ error: 'Email/username and password are required' });
      return;
    }

    const result = await authService.login(emailOrUsername, password);

    res.json({
      message: 'Login successful',
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Login failed',
    });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    const tokens = await authService.refreshTokens(refreshToken);

    res.json({
      message: 'Tokens refreshed successfully',
      tokens,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Token refresh failed',
    });
  }
});

// Get current user profile
router.get(
  '/profile',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const user = await authService.getUserById(req.user.id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        user,
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({
        error: 'Failed to fetch user profile',
      });
    }
  },
);

// Logout endpoint (client-side token removal, but we can blacklist tokens in future)
router.post(
  '/logout',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json({
      message: 'Logout successful. Please remove tokens from client storage.',
    });
  },
);

export default router;
