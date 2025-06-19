import 'dotenv/config';
import { DataSource } from 'typeorm';
import { getEnv, getEnvNumber } from './src/utils/config.utils';

export default new DataSource({
  type: 'postgres',
  host: getEnv('DB_HOST', 'localhost'),
  port: getEnvNumber('DB_PORT', 5433),
  username: getEnv('DB_USERNAME', 'postgres'),
  password: getEnv('DB_PASSWORD', 'postgres'),
  database: getEnv('DB_DATABASE', 'movie_db'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
});
