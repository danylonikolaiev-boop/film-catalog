import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../../api/films';
import type { Genre } from '../../types/genre';
import styles from './GenresPage.module.css';

const genreSchema = z.object({
  name: z.string().min(2, 'Назва жанру має містити хоча б 2 символи'),
});

type GenreFormValues = z.infer<typeof genreSchema>;

export const GenresPage = () => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GenreFormValues>({
    resolver: zodResolver(genreSchema),
  });

  const { data: genres = [], isLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const res = await apiClient.get<Genre[]>('/genres');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: GenreFormValues) => apiClient.post('/genres', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/genres/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
  });

  const onSubmit = (data: GenreFormValues) => {
    createMutation.mutate(data);
  };

  if (isLoading) return <div>Завантаження жанрів...</div>;

  return (
    <div className={styles.container}>
      <h2>Керування жанрами</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div>
          <input 
            {...register('name')} 
            placeholder="Новий жанр" 
            className={styles.input}
          />
          {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
        </div>
        <button type="submit" disabled={createMutation.isPending} className={styles.submitBtn}>
          {createMutation.isPending ? 'Додавання...' : 'Додати'}
        </button>
      </form>

      <div className={styles.list}>
        {genres.length === 0 ? <p>Жанрів немає.</p> : genres.map((genre) => (
          <div key={genre.id} className={styles.listItem}>
            <span>{genre.name}</span>
            <button 
              onClick={() => {
                if(window.confirm('Видалити цей жанр?')) {
                  deleteMutation.mutate(genre.id);
                }
              }}
              disabled={deleteMutation.isPending}
              className={styles.deleteBtn}
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};