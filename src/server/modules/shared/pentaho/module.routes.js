// Definición para el fichero module.routes.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contiene las rutas
//              de los servicios rest asociados al módulo actual
// Modificado:

const express = require('express');
const router = express.Router();

// Se obtienen los ficheros de rutas del módulo actual
const etlsRoutes = require('./etls/routes/etlsRoutes');
const jobsRoutes = require('./jobs/routes/jobsRoutes');
const reportesRoutes = require('./reportes/routes/reportesRoutes');

// Se obtienen los ficheros de rutas de otros sub-módulos

/**
 * GET /check - Validación que indica que el servicio en esta ruta esta disponible
 * */
router.get('/check', (req, res) =>
    res.send('OK')
);

// Enrutamiento interno del módulo
router.use('/etls', etlsRoutes);
router.use('/jobs', jobsRoutes);
router.use('/reportes', reportesRoutes);

// Enrutamiento otros sub-módulos

module.exports = router;
