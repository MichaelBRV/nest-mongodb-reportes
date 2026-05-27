import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Factura extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Venta', required: true })
  ventaId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Producto', required: true })
  productoId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Categoria', required: true })
  categoriaId!: Types.ObjectId;

  @Prop({ required: true, unique: true }) numeroFactura!: string;
  @Prop({ required: true }) montoTotal!: number;
  @Prop({ required: true, default: Date.now }) fechaEmision!: Date;
}
export const FacturaSchema = SchemaFactory.createForClass(Factura);