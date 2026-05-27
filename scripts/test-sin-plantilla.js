// scripts/test-sin-plantilla.js
const XlsxTemplate = require('xlsx-template');

// Crear un xlsx mínimo válido en memoria como base64
// xlsx-template acepta un buffer de un xlsx válido
const datos = {
  facturas: [
    { numeroFactura: 'FAC-001', montoTotal: 1500.5, fechaEmision: '15/4/2024' },
    { numeroFactura: 'FAC-002', montoTotal: 1750.5, fechaEmision: '21/4/2022' },
  ]
};

const template = new XlsxTemplate();
console.log('Template sin archivo:', template);
console.log('Workbook keys:', Object.keys(template.workbook));