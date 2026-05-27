import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as fs from 'fs';
import * as path from 'path';
const XlsxTemplate = require('xlsx-template'); 
import { Factura } from './schemas/factura.schema';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class FacturasService {
  constructor(@InjectModel(Factura.name) private facturaModel: Model<Factura>) {}

  async create(createFacturaDto: CreateFacturaDto) { return new this.facturaModel(createFacturaDto).save(); }
  async findAll() { 
    return this.facturaModel.find()
      .populate(['ventaId', 'usuarioId', 'productoId', 'categoriaId'])
      .exec(); 
  }
  async findOne(id: string) { return this.facturaModel.findById(id).exec(); }
  async update(id: string, updateFacturaDto: any) { return this.facturaModel.findByIdAndUpdate(id, updateFacturaDto, { new: true }).exec(); }
  async remove(id: string) { return this.facturaModel.findByIdAndDelete(id).exec(); }

  
  async getReporteFechas(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Las fechas startDate y endDate son requeridas y deben ser fechas válidas (ejemplo: 2024-03-01).');
    }

    return this.facturaModel.find({
      fechaEmision: { $gte: start, $lte: end },
    }).exec();
  }

  // --- NUEVO METODO: REPORTE EXCEL TODAS LAS FACTURAS ---
 async generarExcelTodas(): Promise<Buffer> {
  const facturas = await this.facturaModel.find().lean().exec();

  const facturasFormateadas = facturas.map(f => ({
    numeroFactura: f.numeroFactura ? String(f.numeroFactura) : 'S/N',
    montoTotal: f.montoTotal ? Number(f.montoTotal) : 0,
    fechaEmision: f.fechaEmision ? new Date(f.fechaEmision).toLocaleDateString() : 'N/A'
  }));

  const templatePath = path.join(process.cwd(), 'templates', 'reporte-todas-template.xlsx');
  const templateData = fs.readFileSync(templatePath);
  const template = new XlsxTemplate(templateData);

  // Prueba con el nombre de hoja en lugar del índice numérico
  template.substitute('Hoja1', { facturas: facturasFormateadas });

  return template.generate({ type: 'nodebuffer' });
}

  // --- REPORTE EXCEL: FACTURA INDIVIDUAL ---
  async generarFacturaIndividualExcel(id: string): Promise<Buffer> {
    
    const factura = await this.facturaModel.findById(id).exec();
    if (!factura) throw new NotFoundException(`Factura #${id} no encontrada`);

    
    const templatePath = path.join(process.cwd(), 'templates', 'factura-template.xlsx');
    const templateData = fs.readFileSync(templatePath);

    const template = new XlsxTemplate(templateData);

    const valores = {
      numeroFactura: factura.numeroFactura,
      montoTotal: factura.montoTotal,
      fechaEmision: factura.fechaEmision.toLocaleDateString(),
    };

    template.substitute(1, valores);

    return template.generate({ type: 'nodebuffer' });
  }
}