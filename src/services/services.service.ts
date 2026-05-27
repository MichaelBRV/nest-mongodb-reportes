import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

// @ts-ignore
import * as XlsxTemplate from 'xlsx-template';

import { ServicesSchema } from '../../schemas/services.schema';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    @InjectModel(ServicesSchema.name)
    private readonly serviceModel: Model<ServicesSchema>,
  ) {}

  async seedServices() {
    try {
      this.logger.log('Limpiando colección de services...');
      await this.serviceModel.deleteMany({});

      const baseData = [
        {
          name: 'Servicio Consulta Cédula',
          alias: 'consulta-cedula',
          description: 'Servicio para consultar datos de la cédula',
          rcConsumer: 'anf',
          limitUses: 1000,
          usesTotal: 450,
          activeToken: 1,
          type: [{ type: 'CONSULTA' }, { type: 'IDENTIFICACION' }],
          category: 'CIVIL',
          failedAttempts: 2
        },
        {
          name: 'Servicio Pago Factura',
          alias: 'pago-factura',
          description: 'Permite pagar facturas en línea',
          rcConsumer: 'deuna',
          limitUses: 5000,
          usesTotal: 3200,
          activeToken: 1,
          type: [{ type: 'PAGO' }, { type: 'FINANCIERO' }],
          category: 'FINANZAS',
          failedAttempts: 15
        },
        {
          name: 'Servicio Verificación Identidad',
          alias: 'verif-identidad',
          description: 'Verificación biométrica y facial',
          rcConsumer: 'anf',
          limitUses: 2000,
          usesTotal: 1900,
          activeToken: 1,
          type: [{ type: 'IDENTIFICACION' }, { type: 'SEGURIDAD' }],
          category: 'CIVIL',
          failedAttempts: 10
        },
        {
          name: 'Servicio Transferencia Bancaria',
          alias: 'trans-banco',
          description: 'Realiza transferencias SPEI',
          rcConsumer: 'banco',
          limitUses: 10000,
          usesTotal: 8500,
          activeToken: 1,
          type: [{ type: 'PAGO' }, { type: 'FINANCIERO' }],
          category: 'FINANZAS',
          failedAttempts: 45
        },
        {
          name: 'Servicio Historial Crediticio',
          alias: 'historial-credito',
          description: 'Consulta el buró de crédito',
          rcConsumer: 'buro',
          limitUses: 500,
          usesTotal: 120,
          activeToken: 1,
          type: [{ type: 'CONSULTA' }, { type: 'FINANCIERO' }],
          category: 'FINANZAS',
          failedAttempts: 0
        }
      ];

      this.logger.log('Generando 50,000 registros en memoria...');
      const testData: any[] = [];
      for (let i = 0; i < 50000; i++) {
        const base = baseData[i % baseData.length];
        testData.push({
          ...base,
          name: `${base.name} - ${i + 1}`,
          alias: `${base.alias}-${i + 1}`
        });
      }

      this.logger.log('Insertando datos de prueba por lotes...');
      let insertedCount = 0;
      const batchSize = 10000;
      
      for (let i = 0; i < testData.length; i += batchSize) {
        const batch = testData.slice(i, i + batchSize);
        await this.serviceModel.insertMany(batch);
        insertedCount += batch.length;
        this.logger.log(`${insertedCount} servicios creados exitosamente.`);
      }
      
      return {
        message: 'Seed ejecutado correctamente',
        inserted: insertedCount
      };
    } catch (error) {
      this.logger.error('Error in seedServices', error);
      return { error: error.message, stack: error.stack, validationErrors: error.errors };
    }
  }

  async generateReportByType(type: string) {
    this.logger.log(`Obteniendo servicios para la búsqueda: ${type}...`);
    
    const searchRegex = new RegExp(type, 'i');
    const services: any[] = await this.serviceModel.find({
      $or: [
        { 'type.type': searchRegex },
        { name: searchRegex },
        { alias: searchRegex }
      ]
    }).lean();
    
    if (services.length === 0) {
      this.logger.warn(`No hay servicios para la búsqueda: ${type}.`);
      throw new Error(`No hay servicios para generar reportes con el tipo o nombre: ${type}`);
    }

    const templatePath = path.join(process.cwd(), 'templates', 'reporte-servicios-template.xlsx');
    
    if (!fs.existsSync(templatePath)) {
      this.logger.error(`No se encuentra el template en: ${templatePath}`);
      throw new Error('Template not found');
    }

    const templateData = fs.readFileSync(templatePath);

    const dataForTemplate = services.map(s => ({
      name: s.name || '',
      alias: s.alias || '',
      description: s.description || '',
      rcConsumer: s.rcConsumer || '',
      limitUses: s.limitUses || 0,
      usesTotal: s.usesTotal || 0,
      activeToken: s.activeToken || 0,
      category: s.category || '',
      failedAttempts: s.failedAttempts || 0
    }));

    // @ts-ignore
    const TemplateClass = XlsxTemplate.default || XlsxTemplate;
    const template = new TemplateClass(templateData);
    
    template.substitute('Servicios', { servicios: dataForTemplate });
    const buffer = template.generate({ type: 'nodebuffer' });
    
    // Limpiamos el texto para que sea un nombre de archivo válido
    const safeType = type.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `reporte-servicios-${safeType}.xlsx`;
    const outputPath = path.join(process.cwd(), 'templates', fileName);
    
    fs.writeFileSync(outputPath, buffer);
    
    this.logger.log(`Archivo Excel generado y guardado en: ${outputPath}`);

    return {
      outputPath,
      fileName
    };
  }
}
