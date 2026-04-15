import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/films'; 
import type { Genre } from '../../types/genre';
import styles from './CreateFilmPage.module.css';

const filmSchema = z.object({
  title: z.string().min(1, 'Назва фільму обовʼязкова'),
  description: z.string().optional(),
  releaseYear: z.number({ message: "Введіть рік" }),
  rating: z.number({ message: "Введіть рейтинг" }).min(0, 'Мінімум 0').max(10, 'Максимум 10'),
  posterUrl: z.string().url('Має бути коректним посиланням (URL)').optional().or(z.literal('')),
  genreIds: z.array(z.string()).min(1, 'Оберіть хоча б один жанр'),
});

type FilmFormValues = z.infer<typeof filmSchema>;

export const CreateFilmPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FilmFormValues>({
    resolver: zodResolver(filmSchema),
    defaultValues: {
      genreIds: [],
    }
  });

  const { data: genres = [], isLoading: isGenresLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const response = await apiClient.get<Genre[]>('/genres');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: FilmFormValues) => apiClient.post('/films', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['films'] });
      navigate('/');
    },
    onError: () => {
      alert('Сталася помилка при збереженні фільму. Перевірте консоль.');
    }
  });

  const onSubmit = (data: FilmFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Додати новий фільм</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Назва фільму *</label>
          <input className={styles.input} {...register('title')} placeholder="Наприклад: Дюна" />
          {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Опис</label>
          <textarea className={styles.textarea} {...register('description')} placeholder="Короткий сюжет..." />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Рік випуску *</label>
          <input type="number" className={styles.input} {...register('releaseYear', { valueAsNumber: true })} />
          {errors.releaseYear && <span className={styles.errorText}>{errors.releaseYear.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Рейтинг (0-10) *</label>
          <input type="number" step="0.1" className={styles.input} {...register('rating', { valueAsNumber: true })} />
          {errors.rating && <span className={styles.errorText}>{errors.rating.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Посилання на постер (URL)</label>
          <input className={styles.input} {...register('posterUrl')} placeholder="https://..." />
          {errors.posterUrl && <span className={styles.errorText}>{errors.posterUrl.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Жанри *</label>
          {isGenresLoading ? (
            <span className={styles.loading}>Завантаження жанрів...</span>
          ) : (
            <div className={styles.checkboxGrid}>
              {genres.map((genre) => (
                <label key={genre.id} className={styles.checkboxLabel}>
                  <input type="checkbox" value={genre.id} {...register('genreIds')} />
                  {genre.name}
                </label>
              ))}
            </div>
          )}
          {errors.genreIds && <span className={styles.errorText}>{errors.genreIds.message}</span>}
        </div>

        <button 
          type="submit" 
          disabled={createMutation.isPending}
          className={styles.submitButton}
        >
          {createMutation.isPending ? 'Збереження...' : 'Зберегти фільм'}
        </button>

      </form>
    </div>
  );
};