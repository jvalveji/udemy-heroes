// Definición para el fichero utilidadesRoutes.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al módulo de utilidades
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const utilidadesController = require('./../controllers/utilidadesController');

/** 
 * GET /check - Validación que indica que el servicio en esta ruta esta disponible 
 * */
router.get('/check', (req, res) =>
	res.send('OK')
);

/*
 * GET
 */
router.get('/ntp', utilidadesController.showServidorNTP);

module.exports = router;
