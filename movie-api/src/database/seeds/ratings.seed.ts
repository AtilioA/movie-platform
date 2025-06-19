import { movieSeeds } from './movies.seed';
import { userSeeds } from './users.seed';

const comments = [
  'Amazing!', 'Loved it!', 'Pretty good', 'Not bad', 'Could be better', 'Didn\'t like it', 'Masterpiece', 'Overrated', 'Underrated', 'Would watch again', 'Boring', 'Inspiring', 'Mediocre', 'Thrilling', 'Suspenseful', 'Too long', 'Great acting', 'Poor script', 'Excellent soundtrack', 'Visually stunning'
];

export const ratingSeeds = Array.from({ length: 100 }, (_, i) => {
  const movie = movieSeeds[i % movieSeeds.length];
//   const user = userSeeds[i % userSeeds.length];
  const score = 1 + Math.floor(Math.random() * 5);
  const comment = comments[Math.floor(Math.random() * comments.length)];
  return {
    score,
    comment,
    movieTitle: movie.title,
    // userEmail: user.email,
  };
});
