import { DataSource } from 'typeorm';
import dataSource from '../data-source';

async function runMigrations() {
  try {
    await dataSource.initialize();
    await dataSource.runMigrations();
    console.log('✅ Database migrations ran successfully.');
    await dataSource.destroy();
  } catch (err) {
    console.error('❌ Error running migrations:', err);
    process.exit(1);
  }
}

async function startApp() {
  require('./main');
}

(async () => {
  await runMigrations();
  await startApp();
})();
