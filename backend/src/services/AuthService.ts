import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export class AuthService {
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly jwtSecret = process.env.JWT_SECRET ?? 'your-secret-key';
  private readonly jwtRefreshSecret =
    process.env.JWT_REFRESH_SECRET ?? 'your-refresh-secret-key';
  private readonly saltRounds = 12;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateTokens(user: AuthUser): AuthTokens {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: '15m',
      issuer: 'menu-maker',
      audience: 'menu-maker-users',
    });

    const refreshToken = jwt.sign({ id: user.id }, this.jwtRefreshSecret, {
      expiresIn: '7d',
      issuer: 'menu-maker',
      audience: 'menu-maker-users',
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'menu-maker',
        audience: 'menu-maker-users',
      }) as { id: string; email: string };

      return {
        id: decoded.id,
        email: decoded.email,
      };
    } catch (error) {
      console.error('Error verifying access token:', error);
      return null;
    }
  }

  verifyRefreshToken(token: string): { id: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtRefreshSecret, {
        issuer: 'menu-maker',
        audience: 'menu-maker-users',
      }) as { id: string };

      return { id: decoded.id };
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      return null;
    }
  }

  async register(
    email: string,
    firstName: string,
    password: string,
  ): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = this.userRepository.create({
      email,
      firstName,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const authUser: AuthUser = {
      id: savedUser.id,
      email: savedUser.email,
    };

    const tokens = this.generateTokens(authUser);

    return { user: authUser, tokens };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
    };

    const tokens = this.generateTokens(authUser);

    return { user: authUser, tokens };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const decoded = this.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    // Get user from database
    const user = await this.userRepository.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
    };

    return this.generateTokens(authUser);
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}
