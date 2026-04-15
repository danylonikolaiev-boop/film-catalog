export interface Review {
  id: string;
  filmId: string;
  author: string;
  text: string;
  rating: number;
  likes: number;
  createdAt: string;
}