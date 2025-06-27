import dotenv from 'dotenv';
import path, { join } from 'path';
import { DataSource } from 'typeorm';

// Always load .env from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const isProd = process.env.NODE_ENV === 'production';

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'menu_maker',
  synchronize: process.env.NODE_ENV === 'development', // Only sync in development
  logging: process.env.NODE_ENV === 'development',
  entities: [
    isProd
      ? join(__dirname, 'entities', '**', '*.js')
      : join(__dirname, '..', 'src', 'entities', '**', '*.ts'),
  ],
  migrations: [
    isProd
      ? join(__dirname, 'migrations', '**', '*.js')
      : join(__dirname, '..', 'src', 'migrations', '**', '*.ts'),
  ],
  subscribers: [
    isProd
      ? join(__dirname, 'subscribers', '**', '*.js')
      : join(__dirname, '..', 'src', 'subscribers', '**', '*.ts'),
  ],
});
