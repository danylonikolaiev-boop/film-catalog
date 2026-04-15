import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilmsModule } from './films/films.module';
import { GenresModule } from './genres/genres.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [FilmsModule, GenresModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
