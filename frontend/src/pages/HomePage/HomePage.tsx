import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/films';
import type { Film } from '../../types/film';
import type { Genre } from '../../types/genre';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const queryClient = useQueryClient();
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const response = await apiClient.get<Genre[]>('/genres');
      return response.data;
    },
  });

  const { data: films, isLoading, isError } = useQuery({
    queryKey: ['films', selectedGenres], 
    queryFn: async () => {
      if (selectedGenres.length > 0) {
        const response = await apiClient.get<Film[]>(`/films/filter/genres?ids=${selectedGenres.join(',')}`);
        return response.data;
      } else {
        const response = await apiClient.get<Film[]>('/films');
        return response.data;
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/films/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['films'] });
    },
  });

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  if (isLoading) return <div>Завантаження фільмів...</div>;
  if (isError) return <div>Сталася помилка при завантаженні.</div>;

  const displayedFilms = films?.filter((film) => {
    const matchesRating = film.rating >= minRating;
    const matchesSearch = film.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRating && matchesSearch;
  }) || [];

  return (
    <div>
      <div className={styles.header}>
        <h2>Каталог фільмів</h2>
        <Link to="/create" className={styles.addButton}>
          + Додати фільм
        </Link>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Пошук та фільтри:</h3>
        
        <input 
          type="text" 
          placeholder="Пошук за назвою..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />

        {genres.length > 0 && (
          <div className={styles.genreTags}>
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={selectedGenres.includes(genre.id) ? styles.genreTagActive : styles.genreTag}
                onClick={() => toggleGenre(genre.id)}
              >
                {genre.name}
              </button>
            ))}
            {selectedGenres.length > 0 && (
              <button 
                className={styles.genreTag} 
                style={{ color: 'red', borderColor: 'red' }}
                onClick={() => setSelectedGenres([])}
              >
                ✕ Скинути
              </button>
            )}
          </div>
        )}

        <div className={styles.ratingFilter}>
          <label>Мінімальний рейтинг: {minRating}+</label>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.5" 
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className={styles.ratingSlider}
          />
        </div>
      </div>
      
      {displayedFilms.length === 0 ? (
        <p>Фільмів не знайдено.</p>
      ) : (
        <div className={styles.grid}>
          {displayedFilms.map((film) => (
            <div key={film.id} className={styles.card}>
              {film.posterUrl && (
                <img 
                  src={film.posterUrl} 
                  alt={`Постер ${film.title}`} 
                  className={styles.poster} 
                />
              )}
              
              <h3>{film.title}</h3>
              <p><strong>Рік:</strong> {film.releaseYear}</p>
              <p><strong>Рейтинг:</strong> {film.rating}/10</p>
              
              <div className={styles.cardFooter}>
                <Link to={`/films/${film.id}`}>Детальніше &rarr;</Link>
                
                <button 
                  className={styles.deleteButton}
                  onClick={() => {
                    if (window.confirm('Видалити цей фільм?')) {
                      deleteMutation.mutate(film.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Видалення...' : 'Видалити'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};