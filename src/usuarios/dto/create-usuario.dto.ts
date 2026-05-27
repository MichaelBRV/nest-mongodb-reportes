import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsDateString()
  fechaRegistro?: Date;
}