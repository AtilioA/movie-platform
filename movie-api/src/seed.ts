import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

// Entities
import { User } from './users/entities/user.entity';
import { Actor } from './actors/entities/actor.entity';
import { Movie } from './movies/entities/movie.entity';
import { Rating } from './ratings/entities/rating.entity';

// Seed data
import { userSeeds } from './database/seeds/users.seed';
import { actorSeeds } from './database/seeds/actors.seed';
import { movieSeeds } from './database/seeds/movies.seed';
import { ratingSeeds } from './database/seeds/ratings.seed';

/**
 * Seed users into the database
 */
async function seedUsers(userRepo: Repository<User>): Promise<User[]> {
  console.log('Seeding users...');
  const result = await userRepo.upsert(userSeeds, ['email']);
  console.log(`Upserted ${result.identifiers.length} users.`);
  // Fetch all users after upsert
  const users = await userRepo.find();
  return users;
}

/**
 * Seed actors into the database
 */
async function seedActors(actorRepo: Repository<Actor>): Promise<Actor[]> {
  console.log('\nSeeding actors...');
  const result = await actorRepo.upsert(actorSeeds, ['id']);
  console.log(`Upserted ${result.identifiers.length} actors.`);
  const actors = await actorRepo.find();
  return actors;
}

/**
 * Seed movies and their relationships with actors
 */
async function seedMovies(
  movieRepo: Repository<Movie>,
  actorRepo: Repository<Actor>
): Promise<Movie[]> {
  console.log('\nSeeding movies...');
  // Upsert movies by id
  const result = await movieRepo.upsert(movieSeeds, ['id']);
  console.log(`Upserted ${result.identifiers.length} movies.`);

  // Attach actors to movies (many-to-many)
  const movies = await movieRepo.find();
  for (const movieData of movieSeeds) {
    const movie = movies.find(m => m.id === movieData.id);
    if (!movie) continue;
    const actorIds = movieData.actors.map((a: { id: string }) => a.id);
    const movieActors = await actorRepo.findBy({ id: In(actorIds) });
    movie.actors = movieActors;
    await movieRepo.save(movie);
  }
  return await movieRepo.find({ relations: ['actors'] });
}

/**
 * Seed ratings for movies
 */
async function seedRatings(
  ratingRepo: Repository<Rating>,
): Promise<void> {
  console.log('\nSeeding ratings...');
  // Upsert ratings by id
  for (const ratingData of ratingSeeds) {
    await ratingRepo.upsert({ ...ratingData, movie: { id: ratingData.movieId } }, ['id']);
  }
  console.log('Upserted ratings.');
}

/**
 * Main seeding function
 */
async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn']
    });

    // Get repositories
    const actorRepo = app.get<Repository<Actor>>(getRepositoryToken(Actor));
    const movieRepo = app.get<Repository<Movie>>(getRepositoryToken(Movie));
    const ratingRepo = app.get<Repository<Rating>>(getRepositoryToken(Rating));
    const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

    // Seed data
    await seedUsers(userRepo);
    await seedActors(actorRepo);
    await seedMovies(movieRepo, actorRepo);
    await seedRatings(ratingRepo);

    await app.close();
    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Start the seeding process
bootstrap();
