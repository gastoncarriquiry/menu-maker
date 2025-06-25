import request from 'supertest';
import app from '../index';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

describe('Authentication Routes', () => {
  let testUser: any;
  let authTokens: any;

  beforeAll(async () => {
    // Initialize database connection if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    // Clean up test data
    if (testUser) {
      const userRepository = AppDataSource.getRepository(User);
      await userRepository.delete({ email: testUser.email });
    }

    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();

      testUser = response.body.user;
      authTokens = response.body.tokens;
    });

    it('should fail to register with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          // Missing username and password
        })
        .expect(400);

      expect(response.body.error).toBe(
        'Email, username, and password are required',
      );
    });

    it('should fail to register with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test3@example.com',
          username: 'testuser3',
          password: '123', // Too short
        })
        .expect(400);

      expect(response.body.error).toBe(
        'Password must be at least 8 characters long',
      );
    });

    it('should fail to register with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com', // Same email as first test
          username: 'anotheruser',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with email successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();
    });

    it('should login with username successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'testuser',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('testuser');
    });

    it('should fail login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.error).toContain('Invalid');
    });

    it('should fail login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.error).toContain('Invalid');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should fail to get profile without token', async () => {
      const response = await request(app).get('/api/auth/profile').expect(401);

      expect(response.body.error).toContain('token');
    });

    it('should fail to get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.error).toContain('Invalid');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: authTokens.refreshToken,
        })
        .expect(200);

      expect(response.body.message).toBe('Tokens refreshed successfully');
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();

      // Update tokens for subsequent tests
      authTokens = response.body.tokens;
    });

    it('should fail to refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-refresh-token',
        })
        .expect(401);

      expect(response.body.error).toContain('Invalid');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .expect(200);

      expect(response.body.message).toContain('Logout successful');
    });
  });
});
