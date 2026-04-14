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
            posterUrl: '',
            genres: ['Sci-Fi', 'Adventure', 'Drama'],
            reviews: ['Шедевр візуального мистецтва!', 'Музика Ціммера просто неймовірна.']
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
        const lowerCaseQuery = titleQuery.toLowerCase();
        return this.films.filter((film) => film.title.toLowerCase().includes(lowerCaseQuery)
        );
    }

    findByGenre(genre: string): Film[] {
        const lowerCaseGenre = genre.toLowerCase();
        return this.films.filter((film) => film.genres.some((g) => g.toLowerCase() === lowerCaseGenre)
        );
    }

    filterByRating(minRating: number, maxRating: number): Film[] {
        return this.films.filter((film) => film.rating >= minRating && film.rating <= maxRating );
    }

    addReview(id: string, reviewText: string): Film | null {
        const filmIndex = this.films.findIndex((f) => f.id === id);
        
        if (filmIndex === -1) {
            return null;
        }
        
        this.films[filmIndex].reviews.push(reviewText);
        
        return this.films[filmIndex];
    }

    create(dto: CreateFilmDto): Film {
        const newFilm: Film = {
            id: Date.now().toString(),
            title: dto.title,
            description: dto.description || "",
            releaseYear: dto.releaseYear,
            rating: dto.rating,
            posterUrl: dto.posterUrl || "",
            genres: dto.genres || [],
            reviews: dto.reviews || []
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