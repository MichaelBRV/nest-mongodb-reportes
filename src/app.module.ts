import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VentasModule } from './ventas/ventas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FacturasModule } from './facturas/facturas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { ReportesModule } from './reportes/reportes.module';
import { ServicesModule } from './services/services.module';


@Module({
  imports: [
    // Cambia el string por tu URL de MongoDB si es distinta
    MongooseModule.forRoot('mongodb://localhost:27017/reportesdb'),
    VentasModule,
    UsuariosModule,
    FacturasModule,
    CategoriasModule,
    ProductosModule,
    ReportesModule,
    ServicesModule,
  ],
})
export class AppModule { }