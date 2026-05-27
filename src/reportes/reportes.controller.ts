import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  /**
   * GET /reportes/completo
   * Retorna JSON con datos cruzados de las 5 colecciones
   * Parámetros opcionales: ?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('completo')
  getReporteCompleto(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportesService.generarReporteCompleto(startDate, endDate);
  }

  /**
   * GET /reportes/completo/excel
   * Descarga un archivo Excel con datos cruzados de las 5 colecciones
   * Parámetros opcionales: ?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('completo/excel')
  async descargarReporteExcel(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportesService.generarReporteExcel(startDate, endDate);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename=reporte-completo.xlsx',
      'Content-Length': buffer.length.toString(),
    });

    res.end(buffer);
  }
}
