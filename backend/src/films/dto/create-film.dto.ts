import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsInt, 
  Min, 
  Max, 
  IsNumber, 
  IsUrl, 
  IsArray 
} from 'class-validator';

export class CreateFilmDto {
  @IsString({ message: 'Назва має бути текстом' })
  @IsNotEmpty({ message: 'Назва фільму не може бути порожньою' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt({ message: 'Рік випуску має бути цілим числом' })
  releaseYear: number;

  @IsNumber({}, { message: 'Рейтинг має бути числом' })
  @Min(0, { message: 'Мінімальний рейтинг 0' })
  @Max(10, { message: 'Максимальний рейтинг 10' })
  rating: number;

  @IsOptional()
  @IsUrl({}, { message: 'У постер має бути валідне посилання' })
  posterUrl?: string;
  
  @IsArray()
  @IsString({ each: true })
  genreIds: string[];
}