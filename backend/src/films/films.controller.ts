import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post } from '@nestjs/common';
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
    @Get(':id')
    findOne(@Param('id') id: string) {
        const task = this.filmsService.findOne(id);
        if (!task) {
            throw new NotFoundException(`Задачу з id ${id} не знайдено`);
        }
        return task;
    }
  
    @Post()
    @HttpCode(201)
    create(@Body() createFilmDto: CreateFilmDto): Film {
        return this.filmsService.create(createFilmDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto): Film {
        const updatedFilm = this.filmsService.update(id, updateFilmDto);
    
        if (!updatedFilm) { throw new NotFoundException(`Фільм з ID ${id} не знайдено`);}
    
        return updatedFilm;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        const isDeleted = this.filmsService.remove(id);
    
        if (!isDeleted) { throw new NotFoundException(`Фільм з ID ${id} не знайдено`);}
    }
}
