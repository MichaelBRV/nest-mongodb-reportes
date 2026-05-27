import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServicesSchema, ServiceSchemaFactory } from '../../schemas/services.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ServicesSchema.name, schema: ServiceSchemaFactory }])
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
