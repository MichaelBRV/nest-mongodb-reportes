import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { Factura, FacturaSchema } from './schemas/factura.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Factura.name, schema: FacturaSchema }])],
  controllers: [FacturasController],
  providers: [FacturasService],
})
export class FacturasModule {}