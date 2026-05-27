import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  nombre!: string;

  @IsString()
  descripcion!: string;

  @IsOptional()
  @IsDateString()
  fechaCreacion?: Date;
}
