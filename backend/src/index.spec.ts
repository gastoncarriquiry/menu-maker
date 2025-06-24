import request from 'supertest';
import app from './index';

describe('Express App', () => {
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty(
        'message',
        'Menu Maker Backend is running',
      );
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.timestamp).toBe('string');
    });

    it('should return a valid timestamp', async () => {
      const response = await request(app).get('/health');
      const timestamp = new Date(response.body.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Welcome to Menu Maker API',
      );
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });
});
