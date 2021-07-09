// Definición para el fichero tipoCambioRoutes.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de tipo de cambio
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const tipoCambioController = require('./../controllers/tipoCambioController');

/**
 * Validación para indicar que se encuentran disponible los servicios para esta ruta
 */
router.get('/check', (req, res) =>
	res.send('OK')
);

/*
 * GET
 */
router.get('/', tipoCambioController.list);

/*
 * POST
 */
router.post('/', tipoCambioController.create);
router.post('/indicadorEconomico', tipoCambioController.IndicadoresEconomicosWS);
router.post('/indicadoresEconomicosPorDia', tipoCambioController.ObtenerIndicadoresPorDia);
router.post('/indicadoresEconomicosPorDiaCreacion', tipoCambioController.ObtenerIndicadoresPorDiaCreacion);

/*
 * PUT
 */
router.put('/:id', tipoCambioController.update);

/*
 * DELETE
 */

module.exports = router;
