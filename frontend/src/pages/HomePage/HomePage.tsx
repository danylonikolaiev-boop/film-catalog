import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/films';
import type { Film } from '../../types/film';

import styles from './HomePage.module.css';

export const HomePage = () => {
  const queryClient = useQueryClient();

  const { data: films, isLoading, isError } = useQuery({
    queryKey: ['films'],
    queryFn: async () => {
      const response = await apiClient.get<Film[]>('/films');
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/films/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['films'] });
    },
  });

  if (isLoading) return <div className={styles.loading}>Завантаження фільмів...</div>;
  if (isError) return <div className={styles.error}>Сталася помилка при завантаженні.</div>;

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Каталог фільмів</h2>
        <Link to="/create" className={styles.addButton}>
          + Додати фільм
        </Link>
      </div>
      
      {!films || films.length === 0 ? (
        <p className={styles.emptyMessage}>Фільмів поки немає. Додайте перший!</p>
      ) : (
        <div className={styles.grid}>
          {films.map((film) => (
            <div key={film.id} className={styles.card}>
              
              {film.posterUrl && (
                <img 
                  src={film.posterUrl} 
                  alt={`Постер ${film.title}`} 
                  className={styles.poster} 
                />
              )}
              
              <h3 className={styles.cardTitle}>{film.title}</h3>
              <p className={styles.cardInfo}><strong>Рік:</strong> {film.releaseYear}</p>
              <p className={styles.cardInfo}><strong>Рейтинг:</strong> {film.rating}/10</p>
              
              <div className={styles.cardFooter}>
                <Link to={`/films/${film.id}`} className={styles.detailsLink}>
                  Детальніше &rarr;
                </Link>
                
                <button 
                  className={styles.deleteButton}
                  onClick={() => {
                    if (window.confirm('Видалити цей фільм?')) {
                      deleteMutation.mutate(film.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Видалення...' : '🗑 Видалити'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};