import { DataSource } from 'typeorm';
import { getEnv, getEnvNumber } from '../utils/config.utils';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: getEnv('DB_HOST', 'localhost'),
  port: getEnvNumber('DB_PORT', 5433),
  username: getEnv('DB_USERNAME', 'postgres'),
  password: getEnv('DB_PASSWORD', 'postgres'),
  database: getEnv('DB_DATABASE', 'movie_db'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
