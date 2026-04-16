import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/films'; 
import type { Genre } from '../../types/genre';
import type { Film } from '../../types/film';
import styles from './EditFilmPage.module.css';

const filmSchema = z.object({
  title: z.string().min(1, 'Назва фільму обовʼязкова'),
  description: z.string().optional(),
  releaseYear: z.number({ message: "Введіть рік" }),
  rating: z.number({ message: "Введіть рейтинг" }).min(0, 'Мінімум 0').max(10, 'Максимум 10'),
  posterUrl: z.string().url('Має бути коректним посиланням (URL)').optional().or(z.literal('')),
  genreIds: z.array(z.string()).min(1, 'Оберіть хоча б один жанр'),
});

type FilmFormValues = z.infer<typeof filmSchema>;

export const EditFilmPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FilmFormValues>({
    resolver: zodResolver(filmSchema),
  });

  const { data: film, isLoading: isFilmLoading } = useQuery({
    queryKey: ['film', id],
    queryFn: async () => {
      const response = await apiClient.get<Film>(`/films/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: genres = [], isLoading: isGenresLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const response = await apiClient.get<Genre[]>('/genres');
      return response.data;
    },
  });

  useEffect(() => {
    if (film) {
      reset({
        title: film.title,
        description: film.description || '',
        releaseYear: film.releaseYear,
        rating: film.rating,
        posterUrl: film.posterUrl || '',
        genreIds: film.genreIds,
      });
    }
  }, [film, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: FilmFormValues) => apiClient.patch(`/films/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['films'] });
      queryClient.invalidateQueries({ queryKey: ['film', id] });
      navigate(`/films/${id}`);
    },
  });

  const onSubmit = (data: FilmFormValues) => {
    updateMutation.mutate(data);
  };

  if (isFilmLoading || isGenresLoading) return <div className={styles.statusMessage}>Завантаження даних...</div>;
  if (!film) return <div className={styles.errorMessage}>Фільм не знайдено</div>;

  return (
    <div className={styles.container}>
      <Link to={`/films/${id}`} className={styles.backLink}>
        &larr; Назад до фільму
      </Link>
      
      <h2 className={styles.pageTitle}>Редагувати фільм</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label>Назва фільму *</label>
          <input className={styles.input} {...register('title')} />
          {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Опис</label>
          <textarea className={styles.textarea} {...register('description')} />
        </div>

        <div className={styles.formGroup}>
          <label>Рік випуску *</label>
          <input type="number" className={styles.input} {...register('releaseYear', { valueAsNumber: true })} />
          {errors.releaseYear && <span className={styles.errorText}>{errors.releaseYear.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Рейтинг (0-10) *</label>
          <input type="number" step="0.1" className={styles.input} {...register('rating', { valueAsNumber: true })} />
          {errors.rating && <span className={styles.errorText}>{errors.rating.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Посилання на постер (URL)</label>
          <input className={styles.input} {...register('posterUrl')} />
          {errors.posterUrl && <span className={styles.errorText}>{errors.posterUrl.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Жанри *</label>
          <div className={styles.checkboxGrid}>
            {genres.map((genre) => (
              <label key={genre.id} className={styles.checkboxLabel}>
                <input type="checkbox" value={genre.id} {...register('genreIds')} />
                {genre.name}
              </label>
            ))}
          </div>
          {errors.genreIds && <span className={styles.errorText}>{errors.genreIds.message}</span>}
        </div>

        <button 
          type="submit" 
          disabled={updateMutation.isPending}
          className={styles.submitButton}
        >
          {updateMutation.isPending ? 'Збереження...' : 'Зберегти зміни'}
        </button>

      </form>
    </div>
  );
};