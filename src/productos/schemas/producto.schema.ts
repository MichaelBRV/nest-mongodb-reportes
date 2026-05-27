import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Producto extends Document {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true })
  descripcion!: string;

  @Prop({ required: true })
  precio!: number;

  @Prop({ type: Types.ObjectId, ref: 'Categoria', required: true })
  categoriaId!: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  fechaCreacion!: Date;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);
