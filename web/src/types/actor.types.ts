export interface Actor {
  id: string;
  name: string;
}

export interface ActorWithMovies extends Actor {
  movies: {
    id: string;
    title: string;
  }[];
}
