import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Venta extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Producto', required: true })
  productoId!: Types.ObjectId;

  @Prop({ required: true }) cantidad!: number;
  @Prop({ required: true }) montoTotal!: number;
  @Prop({ required: true, default: Date.now }) fechaVenta!: Date;
}
export const VentaSchema = SchemaFactory.createForClass(Venta);