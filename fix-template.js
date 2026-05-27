const ExcelJS = require('exceljs');
async function run() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('templates/reporte-servicios-template.xlsx');
  const sheet = workbook.getWorksheet('Servicios');
  const row = sheet.getRow(3);
  row.getCell(1).value = '${table:servicios.name}';
  row.getCell(2).value = '${table:servicios.alias}';
  row.getCell(3).value = '${table:servicios.description}';
  row.getCell(4).value = '${table:servicios.rcConsumer}';
  row.getCell(5).value = '${table:servicios.limitUses}';
  row.getCell(6).value = '${table:servicios.usesTotal}';
  row.getCell(7).value = '${table:servicios.activeToken}';
  row.getCell(8).value = '${table:servicios.category}';
  row.getCell(9).value = '${table:servicios.failedAttempts}';
  row.getCell(10).value = null;
  row.getCell(11).value = null;
  row.commit();
  await workbook.xlsx.writeFile('templates/reporte-servicios-template.xlsx');
  console.log('Fixed correctly');
}
run();
