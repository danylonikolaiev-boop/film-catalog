import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../../api/films';
import type { Film } from '../../types/film';
import type { Genre } from '../../types/genre';
import type { Review } from '../../types/review';
import styles from './FilmDetailsPage.module.css';

const reviewSchema = z.object({
  author: z.string().min(1, 'Вкажіть ваше імʼя'),
  text: z.string().min(5, 'Відгук має містити хоча б 5 символів'),
  rating: z.number({ message: 'Введіть оцінку' }).min(1, 'Мінімум 1').max(10, 'Максимум 10'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export const FilmDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const { data: film, isLoading: isFilmLoading } = useQuery({
    queryKey: ['film', id],
    queryFn: async () => {
      const res = await apiClient.get<Film>(`/films/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const res = await apiClient.get<Genre[]>('/genres');
      return res.data;
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await apiClient.get<Review[]>(`/reviews?filmId=${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const deleteFilmMutation = useMutation({
    mutationFn: () => apiClient.delete(`/films/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['films'] });
      navigate('/');
    },
  });

  const likeReviewMutation = useMutation({
    mutationFn: (reviewId: string) => apiClient.post(`/reviews/${reviewId}/like`),
    onSuccess: () => {queryClient.invalidateQueries({ queryKey: ['reviews', id] });},
  });

  const addReviewMutation = useMutation({
    mutationFn: (data: ReviewFormValues) => 
      apiClient.post('/reviews', { ...data, filmId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      reset();
    },
  });

  const onSubmitReview = (data: ReviewFormValues) => {
    addReviewMutation.mutate(data);
  };

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => apiClient.delete(`/reviews/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    },
  });

  if (isFilmLoading) return <div style={{ padding: '20px', textAlign: 'center' }}>Завантаження деталей...</div>;
  if (!film) return <div style={{ padding: '20px', color: 'red' }}>Фільм не знайдено</div>;

  const filmGenres = genres.filter(g => film.genreIds.includes(g.id));

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>&larr; Назад до каталогу</Link>
      
      <div className={styles.filmHeader}>
        {film.posterUrl && (
          <img src={film.posterUrl} alt={film.title} className={styles.poster} />
        )}
        
        <div className={styles.filmInfo}>
          <h1 className={styles.title}>{film.title} ({film.releaseYear})</h1>
          <p className={styles.meta}><strong>Рейтинг:</strong> {film.rating}/10</p>
          
          <div className={styles.meta}>
            <strong>Жанри:</strong>{' '}
            {filmGenres.length > 0 
              ? filmGenres.map(g => <span key={g.id} className={styles.genreTag}>{g.name}</span>)
              : 'Не вказано'
            }
          </div>
          
          <h3>Опис:</h3>
          <p className={styles.description}>{film.description || 'Опис відсутній.'}</p>

          <button 
            onClick={() => {
              if (window.confirm('Ви впевнені, що хочете видалити цей фільм?')) {
                deleteFilmMutation.mutate();
              }
            }}
            disabled={deleteFilmMutation.isPending}
            className={styles.deleteButton}
          >
            {deleteFilmMutation.isPending ? 'Видалення...' : 'Видалити фільм'}
          </button>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.reviewsSection}>
        <h2>Відгуки ({reviews.length})</h2>

        <form onSubmit={handleSubmit(onSubmitReview)} className={styles.reviewForm}>
          <h3>Залишити відгук</h3>
          
          <div className={styles.formGroup}>
            <input 
              {...register('author')} 
              placeholder="Ваше ім'я" 
              className={styles.input}
            />
            {errors.author && <span className={styles.errorText}>{errors.author.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <input 
              type="number" 
              {...register('rating', { valueAsNumber: true })} 
              placeholder="Оцінка (1-10)" 
              className={styles.input}
            />
            {errors.rating && <span className={styles.errorText}>{errors.rating.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <textarea 
              {...register('text')} 
              placeholder="Що ви думаєте про фільм?" 
              className={styles.textarea}
            />
            {errors.text && <span className={styles.errorText}>{errors.text.message}</span>}
          </div>

          <button type="submit" disabled={addReviewMutation.isPending} className={styles.submitBtn}>
            {addReviewMutation.isPending ? 'Надсилання...' : 'Надіслати відгук'}
          </button>
        </form>

        {reviews.length === 0 ? (
          <p>Поки немає відгуків.</p>
        ) : (
          <div className={styles.reviewsList}>
            {reviews.map(review => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewAuthor}>{review.author}</span>
                  <span className={styles.reviewRating}>{review.rating}/10</span>
                </div>
                <p className={styles.reviewText}>{review.text}</p>
                
                <button 
                  onClick={() => likeReviewMutation.mutate(review.id)}
                  disabled={likeReviewMutation.isPending}
                  className={styles.likeBtn}
                >
                  Корисно ({review.likes})
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Видалити цей відгук?')) {
                      deleteReviewMutation.mutate(review.id);
                    }
                  }}
                  disabled={deleteReviewMutation.isPending}
                  className={styles.deleteButton}
                  style={{ marginLeft: '10px' }}
                >
                  Видалити
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};