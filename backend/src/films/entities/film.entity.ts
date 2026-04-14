export interface Film {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  rating: number;
  posterUrl?: string;
  genres: string[];
  reviews: string[];
}