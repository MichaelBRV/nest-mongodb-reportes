import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
const XlsxTemplate = require('xlsx-template');
import { Venta } from './schemas/venta.schema';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(@InjectModel(Venta.name) private ventaModel: Model<Venta>) {}

  async create(createVentaDto: CreateVentaDto) { return new this.ventaModel(createVentaDto).save(); }
  async findAll() { return this.ventaModel.find().populate('usuarioId').populate('productoId').exec(); }
  async findOne(id: string) { return this.ventaModel.findById(id).populate('usuarioId').populate('productoId').exec(); }
  async update(id: string, updateVentaDto: any) { return this.ventaModel.findByIdAndUpdate(id, updateVentaDto, { new: true }).exec(); }
  async remove(id: string) { return this.ventaModel.findByIdAndDelete(id).exec(); }

  async getReporteFechas(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Las fechas startDate y endDate son requeridas y deben ser fechas válidas (ejemplo: 2024-03-01).');
    }

    return this.ventaModel.find({
      fechaVenta: { $gte: start, $lte: end },
    }).exec();
  }

  
  async generarExcel(startDate: string, endDate: string): Promise<any> {
    const ventas = await this.getReporteFechas(startDate, endDate);

    const ventasFormateadas = ventas.map(v => ({
      _id: v._id.toString(),
      productoId: v.productoId ? v.productoId.toString() : 'N/A',
      cantidad: v.cantidad,
      montoTotal: v.montoTotal,
      fechaVenta: v.fechaVenta.toLocaleDateString()
    }));

    const templatePath = path.join(process.cwd(), 'templates', 'reporte-ventas-template.xlsx');
    const templateData = fs.readFileSync(templatePath);
    const template = new XlsxTemplate(templateData);

    template.substitute('Hoja1', { ventas: ventasFormateadas });

    return template.generate({ type: 'nodebuffer' });
  }

  async generarExcelTodas(): Promise<any> {
    const ventas = await this.ventaModel.find().lean().exec();

    const ventasFormateadas = ventas.map(v => ({
      _id: v._id.toString(),
      productoId: v.productoId ? v.productoId.toString() : 'N/A',
      cantidad: v.cantidad,
      montoTotal: v.montoTotal,
      fechaVenta: v.fechaVenta.toLocaleDateString()
    }));

    const templatePath = path.join(process.cwd(), 'templates', 'reporte-ventas-template.xlsx');
    const templateData = fs.readFileSync(templatePath);
    const template = new XlsxTemplate(templateData);

    template.substitute('Hoja1', { ventas: ventasFormateadas });

    return template.generate({ type: 'nodebuffer' });
  }
}