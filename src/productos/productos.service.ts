import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producto } from './schemas/producto.schema';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductosService {
  constructor(@InjectModel(Producto.name) private productoModel: Model<Producto>) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    return new this.productoModel(createProductoDto).save();
  }

  async findAll(): Promise<Producto[]> {
    return this.productoModel.find().populate('categoriaId').exec();
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoModel.findById(id).populate('categoriaId').exec();
    if (!producto) throw new NotFoundException(`Producto #${id} no encontrado`);
    return producto;
  }

  async update(id: string, updateProductoDto: any): Promise<Producto> {
    const productoActualizado = await this.productoModel.findByIdAndUpdate(id, updateProductoDto, { new: true }).exec();
    if (!productoActualizado) throw new NotFoundException(`Producto #${id} no encontrado`);
    return productoActualizado;
  }

  async remove(id: string): Promise<Producto> {
    const productoBorrado = await this.productoModel.findByIdAndDelete(id).exec();
    if (!productoBorrado) throw new NotFoundException(`Producto #${id} no encontrado`);
    return productoBorrado;
  }
}
