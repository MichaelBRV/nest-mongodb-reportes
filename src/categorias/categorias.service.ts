import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './schemas/categoria.schema';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(@InjectModel(Categoria.name) private categoriaModel: Model<Categoria>) {}

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    return new this.categoriaModel(createCategoriaDto).save();
  }

  async findAll(): Promise<Categoria[]> {
    return this.categoriaModel.find().exec();
  }

  async findOne(id: string): Promise<Categoria> {
    const categoria = await this.categoriaModel.findById(id).exec();
    if (!categoria) throw new NotFoundException(`Categoría #${id} no encontrada`);
    return categoria;
  }

  async update(id: string, updateCategoriaDto: any): Promise<Categoria> {
    const categoriaActualizada = await this.categoriaModel.findByIdAndUpdate(id, updateCategoriaDto, { new: true }).exec();
    if (!categoriaActualizada) throw new NotFoundException(`Categoría #${id} no encontrada`);
    return categoriaActualizada;
  }

  async remove(id: string): Promise<Categoria> {
    const categoriaBorrada = await this.categoriaModel.findByIdAndDelete(id).exec();
    if (!categoriaBorrada) throw new NotFoundException(`Categoría #${id} no encontrada`);
    return categoriaBorrada;
  }
}
