import { IsString, IsNotEmpty, IsInt, Min, Max, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'ID фільму є обовʼязковим' })
  filmId: string;

  @IsString()
  @IsNotEmpty({ message: 'Вкажіть ваше імʼя' })
  author: string;

  @IsString()
  @MinLength(5, { message: 'Відгук має містити хоча б 5 символів' })
  text: string;

  @IsInt({ message: 'Оцінка має бути цілим числом' })
  @Min(1, { message: 'Мінімальна оцінка 1' })
  @Max(10, { message: 'Максимальна оцінка 10' })
  rating: number;
}