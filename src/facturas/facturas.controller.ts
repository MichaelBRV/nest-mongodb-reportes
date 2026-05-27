import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import type { Response } from 'express'; 
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post() 
  create(@Body() createFacturaDto: CreateFacturaDto) { 
    return this.facturasService.create(createFacturaDto);
  }

  // --- NUEVA RUTA PARA DESCARGAR TODAS LAS FACTURAS ---
  // IMPORTANTE: ¡Debe ir SIEMPRE arriba de la ruta descargar/:id!
  @Get('descargar/todas')
  async descargarTodas(@Res() res: Response) {
    // Llamamos al nuevo método que construimos en el servicio
    const buffer = await this.facturasService.generarExcelTodas();

    // Configuramos las cabeceras para el archivo general
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=Reporte-Todas-Facturas.xlsx',
      'Content-Length': buffer.length.toString(), 
    });

    res.end(buffer);
  }

  // --- RUTA PARA DESCARGAR LA PLANTILLA INDIVIDUAL ---
  @Get('descargar/:id')
  async descargarFacturaTemplate(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.facturasService.generarFacturaIndividualExcel(id);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=Factura-${id}.xlsx`,
      'Content-Length': buffer.length.toString(), 
    });

    res.end(buffer);
  }

  // --- RUTA DEL REPORTE NORMAL (JSON) ---
  @Get('reporte') 
  getReporte(@Query('startDate') startDate: string, @Query('endDate') endDate: string) { 
    return this.facturasService.getReporteFechas(startDate, endDate); 
  }

  @Get()
  findAll() { 
    return this.facturasService.findAll(); 
  }

  @Get(':id') 
  findOne(@Param('id') id: string) { 
    return this.facturasService.findOne(id); 
  }

  @Patch(':id') 
  update(@Param('id') id: string, @Body() updateFacturaDto: any) { 
    return this.facturasService.update(id, updateFacturaDto); 
  }

  @Delete(':id') 
  remove(@Param('id') id: string) { 
    return this.facturasService.remove(id); 
  }
}