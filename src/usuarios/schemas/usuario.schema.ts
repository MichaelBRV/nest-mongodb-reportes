import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Usuario extends Document {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, default: Date.now })
  fechaRegistro!: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);