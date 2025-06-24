import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { AppDataSource } from './data-source';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Menu Maker Backend is running',
    timestamp: new Date().toISOString(),
    database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Menu Maker API',
    version: '1.0.0',
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Initialize TypeORM connection
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Start server only if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
};

// Start the server
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
