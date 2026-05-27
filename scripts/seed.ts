/**
 * Script de Seed - Poblar la base de datos con datos de ejemplo
 * 
 * Crea datos en las 5 colecciones con referencias cruzadas:
 * Categoría → Producto → Venta ← Usuario, Venta → Factura
 * 
 * Ejecutar: npx ts-node scripts/seed.ts
 */
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/reportesdb';

// ==================== SCHEMAS ====================

const CategoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
}, { timestamps: true });

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  fechaCreacion: { type: Date, default: Date.now },
}, { timestamps: true });

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fechaRegistro: { type: Date, default: Date.now },
}, { timestamps: true });

const VentaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  montoTotal: { type: Number, required: true },
  fechaVenta: { type: Date, default: Date.now },
}, { timestamps: true });

const FacturaSchema = new mongoose.Schema({
  ventaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venta', required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  numeroFactura: { type: String, required: true, unique: true },
  montoTotal: { type: Number, required: true },
  fechaEmision: { type: Date, default: Date.now },
}, { timestamps: true });

// ==================== MODELOS ====================

const Categoria = mongoose.model('Categoria', CategoriaSchema);
const Producto = mongoose.model('Producto', ProductoSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Venta = mongoose.model('Venta', VentaSchema);
const Factura = mongoose.model('Factura', FacturaSchema);

// ==================== DATOS DE EJEMPLO ====================

const categoriasData = [
  { nombre: 'Electrónica', descripcion: 'Dispositivos electrónicos y gadgets' },
  { nombre: 'Ropa', descripcion: 'Prendas de vestir y accesorios de moda' },
  { nombre: 'Alimentos', descripcion: 'Productos alimenticios y bebidas' },
  { nombre: 'Hogar', descripcion: 'Artículos para el hogar y decoración' },
  { nombre: 'Deportes', descripcion: 'Equipamiento y ropa deportiva' },
];

const productosData = [
  // Electrónica
  { nombre: 'Laptop HP Pavilion', descripcion: 'Laptop 15.6" Intel i7 16GB RAM', precio: 18500, catIndex: 0 },
  { nombre: 'Audífonos Sony WH-1000XM5', descripcion: 'Audífonos inalámbricos con cancelación de ruido', precio: 6200, catIndex: 0 },
  { nombre: 'Monitor Samsung 27"', descripcion: 'Monitor IPS 4K UHD', precio: 8900, catIndex: 0 },
  // Ropa
  { nombre: 'Chamarra de cuero', descripcion: 'Chamarra negra de piel genuina', precio: 3500, catIndex: 1 },
  { nombre: 'Tenis Nike Air Max', descripcion: 'Tenis deportivos edición limitada', precio: 2800, catIndex: 1 },
  { nombre: 'Jeans Levi\'s 501', descripcion: 'Jeans clásicos corte recto', precio: 1200, catIndex: 1 },
  // Alimentos
  { nombre: 'Café Oaxaqueño 1kg', descripcion: 'Café de grano tostado de Oaxaca', precio: 350, catIndex: 2 },
  { nombre: 'Aceite de Oliva Extra Virgen', descripcion: 'Aceite de oliva importado 750ml', precio: 280, catIndex: 2 },
  // Hogar
  { nombre: 'Aspiradora Robot iRobot', descripcion: 'Robot aspirador con mapeo inteligente', precio: 7600, catIndex: 3 },
  { nombre: 'Juego de sábanas King', descripcion: 'Sábanas de algodón egipcio 1000 hilos', precio: 1800, catIndex: 3 },
  // Deportes
  { nombre: 'Bicicleta de montaña', descripcion: 'Bicicleta MTB rodada 29 aluminio', precio: 12000, catIndex: 4 },
  { nombre: 'Pesas ajustables 20kg', descripcion: 'Set de mancuernas ajustables', precio: 2500, catIndex: 4 },
];

const usuariosData = [
  { nombre: 'Carlos García', email: 'carlos.garcia@email.com' },
  { nombre: 'María López', email: 'maria.lopez@email.com' },
  { nombre: 'Juan Hernández', email: 'juan.hernandez@email.com' },
  { nombre: 'Ana Martínez', email: 'ana.martinez@email.com' },
  { nombre: 'Pedro Sánchez', email: 'pedro.sanchez@email.com' },
  { nombre: 'Laura Ramírez', email: 'laura.ramirez@email.com' },
  { nombre: 'Roberto Torres', email: 'roberto.torres@email.com' },
  { nombre: 'Sofía Díaz', email: 'sofia.diaz@email.com' },
];

// ==================== FUNCIÓN DE SEED ====================

async function seed() {
  console.log('🔌 Conectando a MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Conectado a MongoDB');

  // Limpiar colecciones existentes
  console.log('🗑️  Limpiando colecciones existentes...');
  await Categoria.deleteMany({});
  await Producto.deleteMany({});
  await Usuario.deleteMany({});
  await Venta.deleteMany({});
  await Factura.deleteMany({});

  // 1. Crear Categorías
  console.log('📁 Creando categorías...');
  const categorias = await Categoria.insertMany(categoriasData);
  console.log(`   ✅ ${categorias.length} categorías creadas`);

  // 2. Crear Productos (con referencia a Categoría)
  console.log('📦 Creando productos...');
  const productosConRef = productosData.map(p => ({
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    categoriaId: categorias[p.catIndex]._id,
  }));
  const productos = await Producto.insertMany(productosConRef);
  console.log(`   ✅ ${productos.length} productos creados`);

  // 3. Crear Usuarios
  console.log('👤 Creando usuarios...');
  const usuarios = await Usuario.insertMany(usuariosData);
  console.log(`   ✅ ${usuarios.length} usuarios creados`);

  // 4. Crear 50,000 Ventas (con referencia a Usuario y Producto)
  const TOTAL_VENTAS = 50000;
  const BATCH_SIZE = 5000;
  console.log(`🛒 Creando ${TOTAL_VENTAS.toLocaleString()} ventas en lotes de ${BATCH_SIZE.toLocaleString()}...`);
  const fechaBase = new Date('2024-01-01');
  const allVentaIds: any[] = [];
  const allVentaMontos: number[] = [];
  const allVentaFechas: Date[] = [];
  const allVentaUsuarios: any[] = [];
  const allVentaProductos: any[] = [];
  const allVentaCategorias: any[] = [];

  for (let batch = 0; batch < TOTAL_VENTAS; batch += BATCH_SIZE) {
    const ventasBatch: any[] = [];
    const currentBatchSize = Math.min(BATCH_SIZE, TOTAL_VENTAS - batch);

    for (let i = 0; i < currentBatchSize; i++) {
      const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
      const producto = productos[Math.floor(Math.random() * productos.length)];
      const cantidad = Math.floor(Math.random() * 10) + 1;
      const fechaVenta = new Date(fechaBase);
      fechaVenta.setDate(fechaBase.getDate() + Math.floor(Math.random() * 730)); // 2 años de rango

      ventasBatch.push({
        usuarioId: usuario._id,
        productoId: producto._id,
        _tempCategoriaId: (producto as any).categoriaId,
        cantidad,
        montoTotal: (producto as any).precio * cantidad,
        fechaVenta,
      });
    }

    const insertedVentas = await Venta.insertMany(ventasBatch, { ordered: false });
    for (let i = 0; i < insertedVentas.length; i++) {
      const v = insertedVentas[i];
      allVentaIds.push(v._id);
      allVentaMontos.push((v as any).montoTotal);
      allVentaFechas.push((v as any).fechaVenta);
      allVentaUsuarios.push(ventasBatch[i].usuarioId);
      allVentaProductos.push(ventasBatch[i].productoId);
      allVentaCategorias.push(ventasBatch[i]._tempCategoriaId);
    }

    const progress = Math.min(batch + BATCH_SIZE, TOTAL_VENTAS);
    console.log(`   📊 Ventas: ${progress.toLocaleString()} / ${TOTAL_VENTAS.toLocaleString()}`);
  }
  console.log(`   ✅ ${allVentaIds.length.toLocaleString()} ventas creadas`);

  // 5. Crear 50,000 Facturas (con referencia a Venta)
  console.log(`🧾 Creando ${allVentaIds.length.toLocaleString()} facturas en lotes de ${BATCH_SIZE.toLocaleString()}...`);
  let totalFacturas = 0;

  for (let batch = 0; batch < allVentaIds.length; batch += BATCH_SIZE) {
    const facturasBatch: any[] = [];
    const currentBatchSize = Math.min(BATCH_SIZE, allVentaIds.length - batch);

    for (let i = 0; i < currentBatchSize; i++) {
      const idx = batch + i;
      facturasBatch.push({
        ventaId: allVentaIds[idx],
        usuarioId: allVentaUsuarios[idx],
        productoId: allVentaProductos[idx],
        categoriaId: allVentaCategorias[idx],
        numeroFactura: `FAC-${String(idx + 1).padStart(6, '0')}`,
        montoTotal: allVentaMontos[idx],
        fechaEmision: allVentaFechas[idx],
      });
    }

    const insertedFacturas = await Factura.insertMany(facturasBatch, { ordered: false });
    totalFacturas += insertedFacturas.length;

    const progress = Math.min(batch + BATCH_SIZE, allVentaIds.length);
    console.log(`   📊 Facturas: ${progress.toLocaleString()} / ${allVentaIds.length.toLocaleString()}`);
  }
  console.log(`   ✅ ${totalFacturas.toLocaleString()} facturas creadas`);

  // Resumen
  console.log('\n========================================');
  console.log('🎉 SEED COMPLETADO EXITOSAMENTE');
  console.log('========================================');
  console.log(`   📁 Categorías:  ${categorias.length}`);
  console.log(`   📦 Productos:   ${productos.length}`);
  console.log(`   👤 Usuarios:    ${usuarios.length}`);
  console.log(`   🛒 Ventas:      ${allVentaIds.length.toLocaleString()}`);
  console.log(`   🧾 Facturas:    ${totalFacturas.toLocaleString()}`);
  console.log('========================================');
  console.log('\nReferencias creadas:');
  console.log('   Categoría ← Producto (categoriaId)');
  console.log('   Usuario ← Venta (usuarioId)');
  console.log('   Producto ← Venta (productoId)');
  console.log('   Venta ← Factura (ventaId)');
  console.log('\nEndpoints de reportes:');
  console.log('   GET /reportes/completo          → JSON cruzado');
  console.log('   GET /reportes/completo/excel     → Excel cruzado');
  console.log('========================================\n');

  await mongoose.disconnect();
  console.log('🔌 Desconectado de MongoDB');
}

seed().catch((err) => {
  console.error('❌ Error en el seed:', err);
  process.exit(1);
});
