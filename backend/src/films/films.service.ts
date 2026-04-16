import { Injectable } from '@nestjs/common';
import { Film } from './entities/film.entity';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class FilmsService {
    private films: Film[] = [
        {
            id: '1',
            title: 'Dune: Part Two',
            description: 'Paul Atreides unites with Chani and the Fremen...',
            releaseYear: 2024,
            rating: 8.8,
            posterUrl: 'https://upload.wikimedia.org/wikipedia/uk/3/39/%D0%94%D1%8E%D0%BD%D0%B0_%D0%A7%D0%B0%D1%81%D1%82%D0%B8%D0%BD%D0%B0_%D0%B4%D1%80%D1%83%D0%B3%D0%B0.jpg',
            genreIds: ['101', '103'],
        }
    ];

    findAll(): Film[] {
        return this.films;
    }

    findOne(id: string): Film | null {
        const film = this.films.find((f) => f.id === id);
        return film || null; 
    }

    searchByTitle(titleQuery: string): Film[] {
        const lowerCaseTitle = titleQuery.toLowerCase();
        return this.films.filter((film) => film.title.toLowerCase().includes(lowerCaseTitle)
        );
    }

    findByMultipleGenreIds(genreIdsToFind: string[]): Film[] {
        return this.films.filter((film) => {
            return genreIdsToFind.every((id) => film.genreIds.includes(id));
        });
    }

    filterByRating(minRating: number, maxRating: number): Film[] {
        return this.films.filter((film) => film.rating >= minRating && film.rating <= maxRating );
    }

    create(dto: CreateFilmDto): Film {
        const newFilm: Film = {
            id: Date.now().toString(),
            title: dto.title,
            description: dto.description || "",
            releaseYear: dto.releaseYear,
            rating: dto.rating,
            posterUrl: dto.posterUrl || "",
            genreIds: dto.genreIds || [],
        };
        this.films.push(newFilm);
        return newFilm;
    }

    update(id: string, dto: UpdateFilmDto): Film | null {
        const filmIndex = this.films.findIndex((f) => f.id === id);
        if (filmIndex === -1) {
            return null;
        }
        this.films[filmIndex] = {
            ...this.films[filmIndex],
            ...dto,
        };
        return this.films[filmIndex];
    }

    remove(id: string): boolean {
        const filmIndex = this.films.findIndex((f) => f.id === id);
        if (filmIndex === -1) {
            return false;
        }
        this.films.splice(filmIndex, 1);
        return true;
    }
}