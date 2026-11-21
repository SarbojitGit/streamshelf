import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsInt()
  @Min(1888)
  @Max(2100)
  year: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  genres: string[];
}