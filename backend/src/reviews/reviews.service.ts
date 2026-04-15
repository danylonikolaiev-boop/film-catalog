import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  // База відгуків (in-memory)
  private reviews: Review[] = [];

  create(dto: CreateReviewDto): Review {
    const newReview: Review = {
      id: Date.now().toString(),
      ...dto,
      likes: 0,
      createdAt: new Date(),
      filmId: '',
      author: '',
      text: '',
      rating: 0
    };
    this.reviews.push(newReview);
    return newReview;
  }

  findAll(): Review[] {
    return this.reviews;
  }

  findByFilmId(filmId: string): Review[] {
    return this.reviews.filter(review => review.filmId === filmId);
  }

  findOne(id: string): Review | null {
    const review = this.reviews.find((r) => r.id === id);
    return review || null;
  }

  addLike(id: string): Review | null {
    const reviewIndex = this.reviews.findIndex((r) => r.id === id);
    
    if (reviewIndex === -1) {
      return null;
    }

    this.reviews[reviewIndex].likes += 1;
    return this.reviews[reviewIndex];
  }

  update(id: string, dto: UpdateReviewDto): Review | null {
    const reviewIndex = this.reviews.findIndex((r) => r.id === id);
    
    if (reviewIndex === -1) {
      return null;
    }

    this.reviews[reviewIndex] = {
      ...this.reviews[reviewIndex],
      ...dto,
    };
    return this.reviews[reviewIndex];
  }

  remove(id: string): boolean {
    const reviewIndex = this.reviews.findIndex((r) => r.id === id);
    
    if (reviewIndex === -1) {
      return false;
    }

    this.reviews.splice(reviewIndex, 1);
    return true;
  }
}