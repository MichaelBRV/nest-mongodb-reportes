import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import type { Response } from 'express'; 
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post() 
  create(@Body() createVentaDto: CreateVentaDto) { 
    return this.ventasService.create(createVentaDto); 
  }

  @Get('descargar/todas')
  async descargarTodas(@Res() res: Response) {
    const buffer = await this.ventasService.generarExcelTodas();

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=ventas-todas.xlsx',
      'Content-Length': buffer.length.toString(),
    });

    res.end(buffer);
  }


  @Get('reporte/excel')
  async descargarExcel(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.ventasService.generarExcel(startDate, endDate);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=ventas.xlsx',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  
  @Get('reporte') 
  getReporte(@Query('startDate') startDate: string, @Query('endDate') endDate: string) { 
    return this.ventasService.getReporteFechas(startDate, endDate); 
  }

  @Get() 
  findAll() { 
    return this.ventasService.findAll(); 
  }

  @Get(':id') 
  findOne(@Param('id') id: string) { 
    return this.ventasService.findOne(id); 
  }

  @Patch(':id') 
  update(@Param('id') id: string, @Body() updateVentaDto: any) { 
    return this.ventasService.update(id, updateVentaDto); 
  }

  @Delete(':id') 
  remove(@Param('id') id: string) { 
    return this.ventasService.remove(id); 
  }
}