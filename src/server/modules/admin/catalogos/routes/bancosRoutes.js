// Definición para el fichero bancosRoutes.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para los servicios de cambio de bancos.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const bancosController = require('./../controllers/bancosController');

router.get('/check', (req, res) =>
	res.send('OK monedas')
);

/*
 * GET
 */
router.get('/bancos', bancosController.list);
router.get('/bancosHabilitados', bancosController.listBancosHabilitados);
router.get('/:id', bancosController.show);

/*
 * POST
 */
router.post('/', bancosController.create);
router.post('/showByName', bancosController.showByName);

/*
 * PUT
 */
router.put('/:id', bancosController.update);

module.exports = router;
