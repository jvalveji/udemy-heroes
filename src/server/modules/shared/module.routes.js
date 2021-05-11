// Definición para el fichero module.routes.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contiene las rutas
//              de los servicios rest asociados al módulo actual
// Modificado:

const express = require('express');
const router = express.Router();

// Se obtienen los ficheros de rutas del módulo actual
const archivosRoutes = require('./archivos/routes/archivoRoutes');
const articulosRoutes = require('./articulos/routes/articulosRoutes');
const aseguradosRoutes = require('./asegurados/routes/aseguradosRoutes');
const personasRoutes = require('./personas/routes/personasRoutes');
const utilidadesRoutes = require('./utilidades/routes/utilidadesRoutes');

// Se obtienen los ficheros de rutas de otros sub-módulos
const pentahoModuleRoutes = require('./pentaho/module.routes');

/**
 * GET /check - Validación que indica que el servicio en esta ruta esta disponible
 * */
router.get('/check', (req, res) =>
    res.send('OK')
);

// Enrutamiento interno del módulo
router.use('/archivos', archivosRoutes);
router.use('/articulos', articulosRoutes);
router.use('/asegurados', aseguradosRoutes);
router.use('/personas', personasRoutes);
router.use('/utilidades', utilidadesRoutes);

// Enrutamiento otros sub-módulos
router.use('/pentaho', pentahoModuleRoutes);

module.exports = router;
