import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post() create(@Body() createUsuarioDto: CreateUsuarioDto) { return this.usuariosService.create(createUsuarioDto); }

  @Get('descargar/todos')
  async descargarTodos(@Res() res: Response) {
    const buffer = await this.usuariosService.generarExcelTodos();

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=usuarios-todos.xlsx',
      'Content-Length': buffer.length.toString(),
    });

    res.end(buffer);
  }
  //Metodo
  @Get('reporte/excel')
  async descargarExcel(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.usuariosService.generarExcel(startDate, endDate);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=usuarios.xlsx',
      'Content-Length': buffer.length.toString(),
    });

    res.end(buffer);
  }

  @Get('reporte')
  getReporte(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.usuariosService.getReporteFechas(startDate, endDate);
  }

  @Get() findAll() { return this.usuariosService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.usuariosService.findOne(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() updateUsuarioDto: any) { return this.usuariosService.update(id, updateUsuarioDto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.usuariosService.remove(id); }
}