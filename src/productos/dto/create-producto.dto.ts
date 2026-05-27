import { IsString, IsNumber, IsOptional, IsDateString, IsMongoId } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre!: string;

  @IsString()
  descripcion!: string;

  @IsNumber()
  precio!: number;

  @IsMongoId()
  categoriaId!: string;

  @IsOptional()
  @IsDateString()
  fechaCreacion?: Date;
}
