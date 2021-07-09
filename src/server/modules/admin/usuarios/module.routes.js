// Definición para el fichero module.routes.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contiene las rutas
//              de los servicios rest asociados al módulo actual
// Modificado:

const express = require('express');
const router = express.Router();

// Se obtienen los ficheros de rutas del módulo
const usuariosRoutes = require('./main/routes/usuariosRoutes');
const permisosRoutes = require('./permisos/routes/permisosRoutes');
const preferenciasRoutes = require('./preferencias/routes/preferenciasRoutes');

// Controlador de usuarios (unicamente para uso de EDUS en patología)
const usuariosController = require('./main/controllers/usuariosController');

/**
 * GET /check - Validación que indica que el servicio en esta ruta esta disponible
 * */
router.get('/check', (req, res) =>
	res.send('OK')
);

// Enrutamiento interno del módulo
router.use('/main', usuariosRoutes);
router.use('/permisos', permisosRoutes);
router.use('/preferencias', preferenciasRoutes);

// Enrutamiento otros sub-módulos

// IMPORTANTE: Acceso utilizado desde otras plataformas Arca
// Ej:. /arca.pcore/SAAP
router.get('/:arcaapp/:mise', usuariosController.arcaAcceso);

module.exports = router;
