export interface Actor {
  id: string;
  name: string;
  movies: Array<{
    id: string;
    title: string;
    year?: number;
  }>;
}

export const mockActors: Actor[] = [
  {
    id: '1',
    name: 'Ator A',
    movies: [
      { id: '1', title: 'Inception' },
    ],
  },
  {
    id: '2',
    name: 'Ator B',
    movies: [
      { id: '1', title: 'Inception' },
    ],
  },
  {
    id: '3',
    name: 'Ator C',
    movies: [
      { id: '1', title: 'Inception' },
    ],
  },
  {
    id: '4',
    name: 'Ator D',
    movies: [
      { id: '1', title: 'Inception' },
    ],
  },
  {
    id: '5',
    name: 'Keanu Reeves',
    movies: [
      { id: '2', title: 'The Matrix', year: 1999 },
    ],
  },
  {
    id: '6',
    name: 'Laurence Fishburne',
    movies: [
      { id: '2', title: 'The Matrix', year: 1999 },
    ],
  },
  {
    id: '7',
    name: 'Carrie-Anne Moss',
    movies: [
      { id: '2', title: 'The Matrix', year: 1999 },
    ],
  },
  {
    id: '8',
    name: 'Hugo Weaving',
    movies: [
      { id: '2', title: 'The Matrix', year: 1999 },
    ],
  },
  {
    id: '9',
    name: 'Matthew McConaughey',
    movies: [
      { id: '3', title: 'Interstellar', year: 2014 },
    ],
  },
  {
    id: '10',
    name: 'Anne Hathaway',
    movies: [
      { id: '3', title: 'Interstellar', year: 2014 },
    ],
  },
  {
    id: '11',
    name: 'Jessica Chastain',
    movies: [
      { id: '3', title: 'Interstellar', year: 2014 },
    ],
  },
  {
    id: '12',
    name: 'Michael Caine',
    movies: [
      { id: '3', title: 'Interstellar', year: 2014 },
    ],
  },
];

// Helper function to get an actor by ID
export const getActorById = (id: string): Actor | undefined => {
  return mockActors.find(actor => actor.id === id);
};

// Helper function to get all actors
export const getAllActors = (): Actor[] => {
  return mockActors;
};
