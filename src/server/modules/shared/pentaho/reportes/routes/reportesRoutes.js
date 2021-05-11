// Definición para el fichero reportesRoutes.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Andrés Salas Brenes <aasalab@ccss.sa.cr>
//					Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para manejar el consumo de reportes desde la plataforma de Pentaho
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const reportesController = require('./../controllers/reportesController');

/** 
 * GET /check - Validación que indica que el servicio en esta ruta esta disponible 
 * */
router.get('/check', (req, res) =>
	res.send('OK')
);

/*
 * GET
 */
router.post('/:name', reportesController.show);

module.exports = router;
