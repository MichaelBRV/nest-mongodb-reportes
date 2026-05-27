const AdmZip = require('adm-zip');
const path = require('path');

const templatePath = path.join(process.cwd(), 'templates', 'reporte-todas-template.xlsx');
const zip = new AdmZip(templatePath);

// 1. Leer shared strings
const sharedEntry = zip.getEntry('xl/sharedStrings.xml');
const sharedXml = sharedEntry.getData().toString('utf8');

// 2. Extraer todos los strings en un array indexado
const strings = [];
const siRegex = /<t[^>]*>([\s\S]*?)<\/t>/g;
let m;
while ((m = siRegex.exec(sharedXml)) !== null) {
  strings.push(m[1]);
}
console.log('Shared strings encontrados:', strings);

// 3. Leer sheet1.xml
const sheetEntry = zip.getEntry('xl/worksheets/sheet1.xml');
let sheetXml = sheetEntry.getData().toString('utf8');

// 4. Regex corregido — t="s" puede estar en cualquier posición entre atributos
sheetXml = sheetXml.replace(
  /<c ([^>]*?)t="s"([^>]*?)><v>(\d+)<\/v><\/c>/g,
  (match, before, after, index) => {
    const valor = strings[parseInt(index)] || '';
    // Limpiamos atributos y reconstruimos como inlineStr
    const ref = (before + after).match(/r="([^"]+)"/);
    const refVal = ref ? ref[1] : '';
    const s = (before + after).match(/s="([^"]+)"/);
    const sVal = s ? ` s="${s[1]}"` : '';
    return `<c r="${refVal}"${sVal} t="inlineStr"><is><t xml:space="preserve">${valor}</t></is></c>`;
  }
);

console.log('Verificando conversión:');
console.log(sheetXml.substring(sheetXml.indexOf('<sheetData>'), sheetXml.indexOf('</sheetData>') + 12));

// 5. Actualizar sheet1.xml
zip.updateFile('xl/worksheets/sheet1.xml', Buffer.from(sheetXml, 'utf8'));

// 6. Guardar
zip.writeZip(templatePath);
console.log('✅ Plantilla convertida correctamente');