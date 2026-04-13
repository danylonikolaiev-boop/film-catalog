import { Injectable } from '@nestjs/common';
import { Film } from './entities/film.entity';
import { CreateFilmDto } from './dto/create-film.dto';

@Injectable()
export class FilmsService {
    private films: Film[] = [
        {
            id: '1',
            title: 'Dune: Part Two',
            description: 'Paul Atreides unites with Chani and the Fremen...',
            releaseYear: 2024,
            rating: 8.8,
        }
    ];
    findAll(): Film[]{
        return this.films;
    }
    create(dto: CreateFilmDto): Film{
        const newFilm: Film = {
            id: Date.now().toString(),
            title: dto.title,
            description: dto.description || "",
            releaseYear: dto.releaseYear,
            rating: dto.rating
        };
        this.films.push(newFilm);
        return newFilm
    }
    update(id: string, dto: any): Film | null{
        const filmIndex = this.films.findIndex((t)=> t.id === id);
        if (filmIndex === -1){
            return null;
        }
        this.films[filmIndex] = {
            ...this.films[filmIndex],
            ...dto,
        };
        return this.films[filmIndex];
    }
    remove(id: string): boolean {
        const filmIndex = this.films.findIndex((t)=>t.id === id);
        if (filmIndex === -1){
            return false;
        }
        this.films.splice(filmIndex, 1);
        return true;
    }
}
