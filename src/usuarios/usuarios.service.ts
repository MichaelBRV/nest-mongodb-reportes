import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
const XlsxTemplate = require('xlsx-template');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './schemas/usuario.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto'; 

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const nuevoUsuario = new this.usuarioModel(createUsuarioDto);
    return nuevoUsuario.save();
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuarioActualizado = await this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, { new: true }).exec();
    if (!usuarioActualizado) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuarioActualizado;
  }

  async remove(id: string): Promise<Usuario> {
    const usuarioBorrado = await this.usuarioModel.findByIdAndDelete(id).exec();
    if (!usuarioBorrado) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuarioBorrado;
  }

  async getReporteFechas(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Las fechas startDate y endDate son requeridas y deben ser fechas válidas (ejemplo: 2024-03-01).');
    }

    return this.usuarioModel.find({
      fechaRegistro: { $gte: start, $lte: end },
    }).exec();
  }

  async generarExcel(startDate: string, endDate: string): Promise<Buffer> {
    const usuarios = await this.getReporteFechas(startDate, endDate);

    const usuariosFormateados = usuarios.map(u => ({
      _id: u._id.toString(),
      nombre: u.nombre,
      email: u.email,
      fechaRegistro: u.fechaRegistro.toLocaleDateString()
    }));

    const templatePath = path.join(process.cwd(), 'templates', 'reporte-usuarios-template.xlsx');
    const templateData = fs.readFileSync(templatePath);
    const template = new XlsxTemplate(templateData);

    template.substitute('Hoja1', { usuarios: usuariosFormateados });

    return template.generate({ type: 'nodebuffer' });
  }

  async generarExcelTodos(): Promise<Buffer> {
    const usuarios = await this.usuarioModel.find().lean().exec();

    const usuariosFormateados = usuarios.map(u => ({
      _id: u._id.toString(),
      nombre: u.nombre,
      email: u.email,
      fechaRegistro: u.fechaRegistro.toLocaleDateString()
    }));

    const templatePath = path.join(process.cwd(), 'templates', 'reporte-usuarios-template.xlsx');
    const templateData = fs.readFileSync(templatePath);
    const template = new XlsxTemplate(templateData);

    template.substitute('Hoja1', { usuarios: usuariosFormateados });

    return template.generate({ type: 'nodebuffer' });
  }
}