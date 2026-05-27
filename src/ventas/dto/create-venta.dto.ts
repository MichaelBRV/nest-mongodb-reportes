import { IsNumber, IsDateString, IsOptional, IsMongoId } from 'class-validator';

export class CreateVentaDto {
  @IsMongoId() usuarioId!: string;
  @IsMongoId() productoId!: string;
  @IsNumber() cantidad!: number;
  @IsNumber() montoTotal!: number;
  @IsOptional() @IsDateString() fechaVenta?: Date;
}