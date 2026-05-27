import { IsString, IsNumber, IsOptional, IsDateString, IsMongoId } from 'class-validator';

export class CreateFacturaDto {
  @IsMongoId() ventaId!: string;
  @IsMongoId() usuarioId!: string;
  @IsMongoId() productoId!: string;
  @IsMongoId() categoriaId!: string;
  @IsString() numeroFactura!: string;
  @IsNumber() montoTotal!: number;
  @IsOptional() @IsDateString() fechaEmision?: Date;
}