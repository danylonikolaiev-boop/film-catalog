import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  NotFoundException, 
  HttpCode 
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const genre = this.genresService.findOne(id);
    if (!genre) {
      throw new NotFoundException(`Жанр з ID ${id} не знайдено`);
    }
    return genre;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    const updatedGenre = this.genresService.update(id, updateGenreDto);
    if (!updatedGenre) {
      throw new NotFoundException(`Жанр з ID ${id} не знайдено`);
    }
    return updatedGenre;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const isDeleted = this.genresService.remove(id);
    if (!isDeleted) {
      throw new NotFoundException(`Жанр з ID ${id} не знайдено`);
    }
    return { message: `Жанр з ID ${id} успішно видалено` };
  }
}