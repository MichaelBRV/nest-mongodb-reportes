const XlsxTemplate = require('xlsx-template');
const fs = require('fs');
const path = require('path');

const templateData = fs.readFileSync(
  path.join(process.cwd(), 'templates', 'reporte-todas-template.xlsx')
);

const template = new XlsxTemplate(templateData);

const datos = {
  facturas: [
    { numeroFactura: 'FAC-001', montoTotal: 1500.5, fechaEmision: '15/4/2024' },
    { numeroFactura: 'FAC-002', montoTotal: 1750.5, fechaEmision: '21/4/2022' },
  ]
};

console.log('Sustituyendo con datos:', JSON.stringify(datos, null, 2));

template.substitute('Hoja1', datos);

const buffer = template.generate({ type: 'nodebuffer' });

fs.writeFileSync(path.join(process.cwd(), 'templates', 'resultado-test.xlsx'), buffer);

console.log('✅ Archivo generado: templates/resultado-test.xlsx');