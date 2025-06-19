import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from './users/entities/user.entity';
import { Actor } from './actors/entities/actor.entity';
import { Movie } from './movies/entities/movie.entity';
import { Rating } from './ratings/entities/rating.entity';

import { Repository } from 'typeorm';

import { userSeeds } from './database/seeds/users.seed';
import { actorSeeds } from './database/seeds/actors.seed';
import { movieSeeds } from './database/seeds/movies.seed';
import { ratingSeeds } from './database/seeds/ratings.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const actorRepo = app.get<Repository<Actor>>(getRepositoryToken(Actor));
  const movieRepo = app.get<Repository<Movie>>(getRepositoryToken(Movie));
  const ratingRepo = app.get<Repository<Rating>>(getRepositoryToken(Rating));

  // Upsert users
  const userEntities: User[] = [];
  for (const u of userSeeds) {
    let user = await userRepo.findOne({ where: { email: u.email } });
    if (!user) user = userRepo.create(u);
    else user = userRepo.merge(user, u);
    user = await userRepo.save(user);
    userEntities.push(user);
  }

  // Upsert actors
  const actorEntities: Actor[] = [];
  for (const a of actorSeeds) {
    let actor = await actorRepo.findOne({ where: { name: a.name } });
    if (!actor) actor = actorRepo.create(a);
    else actor = actorRepo.merge(actor, a);
    actor = await actorRepo.save(actor);
    actorEntities.push(actor);
  }

  // Upsert movies (with actors)
  const movieEntities: Movie[] = [];
  for (const m of movieSeeds) {
    let movie = await movieRepo.findOne({ where: { title: m.title }, relations: ['actors'] });
    if (!movie) movie = movieRepo.create({ title: m.title });
    else movie = movieRepo.merge(movie, { title: m.title });
    // Attach actors by name
    const actorsForMovie = m.actors.map((a: any) => actorEntities.find((ae) => ae.name === a.name));
    movie.actors = actorsForMovie.filter((a) => a !== undefined) as Actor[];
    movie = await movieRepo.save(movie);
    movieEntities.push(movie);
  }

  // Upsert ratings
  for (const r of ratingSeeds) {
    const movie = movieEntities.find((m) => m.title === r.movieTitle);
    if (!movie) continue;
    let rating = await ratingRepo.findOne({ where: { movie: { id: movie.id } } });
    if (!rating) rating = ratingRepo.create({ ...r, movie });
    else rating = ratingRepo.merge(rating, { ...r, movie });
    await ratingRepo.save(rating);
  }

  await app.close();
  console.log('Seeding complete.');
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
