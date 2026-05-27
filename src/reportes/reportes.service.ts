import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
const XlsxTemplate = require('xlsx-template');
import { Venta } from '../ventas/schemas/venta.schema';
import { Factura } from '../facturas/schemas/factura.schema';

@Injectable()
export class ReportesService {
  constructor(
    @InjectModel(Venta.name) private ventaModel: Model<Venta>,
    @InjectModel(Factura.name) private facturaModel: Model<Factura>,
  ) {}

  /**
   * Genera un reporte completo cruzando datos en UNA sola consulta
   * desde la colección central (Facturas)
   */
  async generarReporteCompleto(startDate?: string, endDate?: string) {
    const filtro: any = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException(
          'Las fechas startDate y endDate deben ser válidas (ejemplo: 2024-03-01).',
        );
      }
      filtro.fechaEmision = { $gte: start, $lte: end };
    }

    // Extracción en UNA sola consulta usando .populate()
    const facturas = await this.facturaModel
      .find(filtro)
      .populate(['ventaId', 'usuarioId', 'productoId', 'categoriaId'])
      .lean()
      .exec();

    const reporte = facturas.map((factura: any) => {
      const venta = factura.ventaId || {};
      const usuario = factura.usuarioId || {};
      const producto = factura.productoId || {};
      const categoria = factura.categoriaId || {};

      return {
        ventaId: venta._id ? venta._id.toString() : 'N/A',
        fechaVenta: venta.fechaVenta,
        cantidad: venta.cantidad || 0,
        montoVenta: venta.montoTotal || 0,
        usuarioNombre: usuario.nombre || 'N/A',
        usuarioEmail: usuario.email || 'N/A',
        productoNombre: producto.nombre || 'N/A',
        productoDescripcion: producto.descripcion || 'N/A',
        productoPrecio: producto.precio || 0,
        categoriaNombre: categoria.nombre || 'N/A',
        categoriaDescripcion: categoria.descripcion || 'N/A',
        numeroFactura: factura.numeroFactura || 'Sin factura',
        montoFactura: factura.montoTotal || 0,
        fechaEmision: factura.fechaEmision,
      };
    });

    return reporte;
  }

  /**
   * Genera un archivo Excel usando xlsx-template
   */
  async generarReporteExcel(startDate?: string, endDate?: string): Promise<Buffer> {
    const datos = await this.generarReporteCompleto(startDate, endDate);

    const datosFormateados = datos.map(d => ({
      ...d,
      fechaVenta: d.fechaVenta ? new Date(d.fechaVenta).toLocaleDateString() : 'N/A',
      fechaEmision: d.fechaEmision ? new Date(d.fechaEmision).toLocaleDateString() : 'N/A',
    }));

    const templatePath = path.join(process.cwd(), 'templates', 'reporte-completo-template.xlsx');
    const templateData = fs.readFileSync(templatePath);
    const template = new XlsxTemplate(templateData);

    template.substitute(1, { reporte: datosFormateados });

    return template.generate({ type: 'nodebuffer' });
  }
}
