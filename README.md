# API de Reportes - NestJS & MongoDB

Este proyecto es una API RESTful desarrollada en NestJS que permite la conexión con una base de datos MongoDB. Incluye la creación de esquemas, implementación de operaciones CRUD completas y la generación eficiente de reportes mediante filtros de fechas utilizando `$gte` y `$lte`.

## Requisitos Previos
* **Node.js** (v16 o superior)
* **MongoDB** (Instancia local corriendo en el puerto 27017 o conexión a MongoDB Atlas)

## Instalación y Dependencias

El proyecto utiliza el CLI de Nest y Mongoose para la integración con la base de datos. Para instalar todas las dependencias necesarias, clona este repositorio y ejecuta:

```bash
npm install

Las dependencias principales instaladas son:

@nestjs/mongoose y mongoose: Para la conexión y modelado de datos en MongoDB.

class-validator y class-transformer: Para la validación básica de datos usando DTOs.

Configuración
Por defecto, la API intentará conectarse a una base de datos local. Puedes verificar esta configuración en src/app.module.ts:
mongodb://127.0.0.1:27017/reportesDB

Si deseas usar MongoDB en la nube, reemplaza esa cadena por tu URL de MongoDB Atlas.

Ejecución del Proyecto
Para levantar el servidor en entorno de desarrollo:

Bash
npm run start:dev
La API estará disponible en http://localhost:3000.

Endpoints Principales
La API cuenta con módulos documentados y validados para Ventas, Usuarios y Facturas.

Módulo de Ventas (Ejemplo con Reportes):

POST /ventas - Crea una nueva venta.

GET /ventas - Obtiene todas las ventas.

GET /ventas/reporte?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD - Genera un reporte filtrando eficientemente por fecha.

GET /ventas/:id - Obtiene una venta específica.

PATCH /ventas/:id - Actualiza una venta.

DELETE /ventas/:id - Elimina una venta.

(Las mismas operaciones CRUD están disponibles para las rutas /usuarios y /facturas).

Para generar la data de prueba:
npx ts-node scripts/seed.ts

Para generar el reporte:
http://localhost:3000/reportes/completo/excel

### Novedades y Optimizaciones
1. **Colección Central de Facturas**: La colección `Facturas` ha sido actualizada para contener 4 referencias a colecciones externas (`ventaId`, `usuarioId`, `productoId`, `categoriaId`). Esto permite tener un punto central de información para los reportes y evitar múltiples consultas o agregaciones complejas.
2. **Consultas Optimizadas**: Gracias a las referencias cruzadas añadidas a las facturas, el reporte cruzado completo se realiza en **una sola consulta** a la base de datos utilizando `.populate()`.
3. **Reportes en Excel con Plantillas**: En lugar de generar celdas iterativamente con librerías pesadas, este proyecto utiliza `xlsx-template` para inyectar datos directamente en una plantilla de Excel (`templates/reporte-completo-template.xlsx`). Esto ofrece una mayor velocidad y permite diseñar visualmente la plantilla en Excel sin tocar el código.

Autor
[Michael Barriga]