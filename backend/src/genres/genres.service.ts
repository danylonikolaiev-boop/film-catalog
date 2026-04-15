import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {

  private genres: Genre[] = [
    { id: '101', name: 'Sci-Fi' },
    { id: '102', name: 'Action' },
    { id: '103', name: 'Drama' }
  ];

  create(dto: CreateGenreDto): Genre {
    const newGenre: Genre = {
      id: Date.now().toString(),
      name: dto.name,
    };
    this.genres.push(newGenre);
    return newGenre;
  }

  findAll(): Genre[] {
    return this.genres;
  }

  findOne(id: string): Genre | null {
    const genre = this.genres.find((g) => g.id === id);
    return genre || null;
  }

  update(id: string, dto: UpdateGenreDto): Genre | null {
    const genreIndex = this.genres.findIndex((g) => g.id === id);
    
    if (genreIndex === -1) {
      return null;
    }

    this.genres[genreIndex] = {
      ...this.genres[genreIndex],
      ...dto,
    };
    return this.genres[genreIndex];
  }

  remove(id: string): boolean {
    const genreIndex = this.genres.findIndex((g) => g.id === id);
    
    if (genreIndex === -1) {
      return false;
    }

    this.genres.splice(genreIndex, 1);
    return true;
  }
}