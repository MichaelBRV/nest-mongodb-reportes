import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Categoria extends Document {
  @Prop({ required: true, unique: true })
  nombre!: string;

  @Prop({ required: true })
  descripcion!: string;

  @Prop({ required: true, default: Date.now })
  fechaCreacion!: Date;
}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);
