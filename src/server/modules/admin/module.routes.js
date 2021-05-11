// Definición para el fichero module.routes.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contiene las rutas
//              de los servicios rest asociados al módulo actual
// Modificado:

const express = require('express');
const router = express.Router();

// Se obtienen los ficheros de rutas del módulo actual
const broadcastRoutes = require('./broadcast/routes/broadcastRoutes');
const parametrosRoutes = require('./parametros/routes/parametrosRoutes');
const procesoSIGESRoutes = require('./proceso-siges/routes/procesoSIGESRoutes');
const tipoCambioRoutes = require('./tipo-cambio/routes/tipoCambioRoutes');
const tokenRoutes = require('./token/routes/tokenRoutes');

// Se obtienen los ficheros de rutas de otros sub-módulos
const catalogosModuleRoutes = require('./catalogos/module.routes');
const usuariosModuleRoutes = require('./usuarios/module.routes');

/**
 * GET /check - Validación que indica que el servicio en esta ruta esta disponible
 * */
router.get('/check', (req, res) =>
	res.send('OK')
);

// Enrutamiento interno del módulo
router.use('/broadcast', broadcastRoutes);
router.use('/parametros', parametrosRoutes);
router.use('/proceso-siges', procesoSIGESRoutes);
router.use('/tipo-cambio', tipoCambioRoutes);
router.use('/token', tokenRoutes);

// Enrutamiento otros sub-módulos
router.use('/catalogos', catalogosModuleRoutes);
router.use('/usuarios', usuariosModuleRoutes);

module.exports = router;
