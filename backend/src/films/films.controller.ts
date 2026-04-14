import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpCode, 
  NotFoundException, 
  Param, 
  Patch, 
  Post, 
  Query 
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import type { Film } from './entities/film.entity';

@Controller('films')
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {}

    @Get()
    findAll(): Film[] {
        return this.filmsService.findAll();
    }

    @Get('search')
    searchByTitle(@Query('title') title: string): Film[] {
        if (!title) {
            return this.filmsService.findAll();
        }
        return this.filmsService.searchByTitle(title);
    }

    @Get('rating/range')
    filterByRating(@Query('min') min: string, @Query('max') max: string): Film[] {
        const minRating = parseFloat(min) || 0;
        const maxRating = parseFloat(max) || 10;
        return this.filmsService.filterByRating(minRating, maxRating);
    }

    @Get('filter/genres')
    findByGenres(@Query('tags') tags: string): Film[] {
        if (!tags) {
            return this.filmsService.findAll();
        }
        const genresArray = tags.split(',').map(tag => tag.trim());
        return this.filmsService.findByGenres(genresArray);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const film = this.filmsService.findOne(id);
        if (!film) {
            throw new NotFoundException(`Фільм з ID ${id} не знайдено`);
        }
        return film;
    }
  
    @Post()
    @HttpCode(201)
    create(@Body() createFilmDto: CreateFilmDto): Film {
        return this.filmsService.create(createFilmDto);
    }

    @Post(':id/reviews')
    @HttpCode(201)
    addReview(@Param('id') id: string, @Body('text') reviewText: string): Film {
        const updatedFilm = this.filmsService.addReview(id, reviewText);
        if (!updatedFilm) {
            throw new NotFoundException(`Фільм з ID ${id} не знайдено`);
        }
        return updatedFilm;
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto): Film {
        const updatedFilm = this.filmsService.update(id, updateFilmDto);
        if (!updatedFilm) { 
            throw new NotFoundException(`Фільм з ID ${id} не знайдено`);
        }
        return updatedFilm;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        const isDeleted = this.filmsService.remove(id);
        if (!isDeleted) { 
            throw new NotFoundException(`Фільм з ID ${id} не знайдено`);
        }
        return { message: `Фільм з ID ${id} успішно видалено` };
    }
}