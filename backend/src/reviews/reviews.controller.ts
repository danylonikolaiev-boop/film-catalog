import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  NotFoundException, 
  HttpCode,
  Query
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll(@Query('filmId') filmId?: string) {
    if (filmId) {
      return this.reviewsService.findByFilmId(filmId);
    }
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const review = this.reviewsService.findOne(id);
    if (!review) {
      throw new NotFoundException(`Відгук з ID ${id} не знайдено`);
    }
    return review;
  }

  @Post(':id/like')
  addLike(@Param('id') id: string) {
    const updatedReview = this.reviewsService.addLike(id);
    if (!updatedReview) {
      throw new NotFoundException(`Відгук з ID ${id} не знайдено`);
    }
    return updatedReview;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    const updatedReview = this.reviewsService.update(id, updateReviewDto);
    if (!updatedReview) {
      throw new NotFoundException(`Відгук з ID ${id} не знайдено`);
    }
    return updatedReview;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const isDeleted = this.reviewsService.remove(id);
    if (!isDeleted) {
      throw new NotFoundException(`Відгук з ID ${id} не знайдено`);
    }
    return { message: `Відгук з ID ${id} успішно видалено` };
  }
}