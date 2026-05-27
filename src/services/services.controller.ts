import { Controller, Post, Get, HttpCode, HttpStatus, Res, Param } from '@nestjs/common';
import type { Response } from 'express';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('seed')
  @HttpCode(HttpStatus.CREATED)
  async seedServices() {
    return this.servicesService.seedServices();
  }

  @Get('reportes/:type')
  @HttpCode(HttpStatus.OK)
  async generateReports(@Param('type') type: string, @Res() res: Response) {
    try {
      const reportData = await this.servicesService.generateReportByType(type);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${reportData.fileName}"`);
      
      res.download(reportData.outputPath, reportData.fileName, (err) => {
        if (err) {
          console.error('Error enviando el archivo:', err);
          if (!res.headersSent) {
            res.status(500).send('Error interno del servidor al descargar el archivo.');
          }
        }
      });
    } catch (error) {
      if (!res.headersSent) {
        res.status(404).send({ message: error.message });
      }
    }
  }
}
