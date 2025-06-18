import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'movie_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // Auto-create database schema (disabled in production)
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',

  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsRun: false,

  // Add connection success/error logging
  logger: 'advanced-console',
  // Add connection event listeners
  retryAttempts: 5,
  retryDelay: 3000,
  // Enable query logging in development
  maxQueryExecutionTime: 1000, // Log slow queries (1s)
  poolErrorHandler: (err) => {
    console.error('❌ Database connection pool error:', err);
  },
  // Connection timeout
  connectTimeoutMS: 10000,
};
