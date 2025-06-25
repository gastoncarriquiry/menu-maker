import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  const authService = new AuthService();
  const user = authService.verifyAccessToken(token);

  if (!user) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }

  req.user = user;
  next();
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token) {
    const authService = new AuthService();
    const user = authService.verifyAccessToken(token);
    if (user) {
      req.user = user;
    }
  }

  next();
};
