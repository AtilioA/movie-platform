export interface Actor {
  id: string;
  name: string;
  movies: Array<{
    id: string;
    title: string;
    year?: number;
    rating?: number;
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
      { id: '3', title: 'Interstellar', year: 2014, rating: 8.6 },
    ],
  },
  {
    id: '13',
    name: 'Leonardo DiCaprio',
    movies: [
      { id: '17', title: 'The Departed', year: 2006, rating: 8.5 },
      { id: '27', title: 'The Wolf of Wall Street', year: 2013, rating: 8.2 },
      { id: '28', title: 'Django Unchained', year: 2012, rating: 8.4 },
      { id: '29', title: 'The Revenant', year: 2015, rating: 8.0 },
      { id: '30', title: 'Inception', year: 2010, rating: 8.8 },
      { id: '31', title: 'Shutter Island', year: 2010, rating: 8.2 },
      { id: '32', title: 'The Aviator', year: 2004, rating: 7.5 },
      { id: '33', title: 'Blood Diamond', year: 2006, rating: 8.0 },
      { id: '34', title: 'Catch Me If You Can', year: 2002, rating: 8.1 },
      { id: '35', title: 'The Departed', year: 2006, rating: 8.5 },
      { id: '36', title: 'The Wolf of Wall Street', year: 2013, rating: 8.2 },
      { id: '37', title: 'Django Unchained', year: 2012, rating: 8.4 },
      { id: '38', title: 'The Revenant', year: 2015, rating: 8.0 },
      { id: '39', title: 'Inception', year: 2010, rating: 8.8 },
      { id: '40', title: 'Shutter Island', year: 2010, rating: 8.2 },
      { id: '41', title: 'The Aviator', year: 2004, rating: 7.5 },
      { id: '42', title: 'Blood Diamond', year: 2006, rating: 8.0 },
      { id: '43', title: 'Catch Me If You Can', year: 2002, rating: 8.1 },
      { id: '44', title: 'The Great Gatsby', year: 2013, rating: 7.2 },
      { id: '45', title: 'The Departed', year: 2006, rating: 8.5 },
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
