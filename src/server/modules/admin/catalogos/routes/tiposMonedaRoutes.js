// Definición para el fichero cambioMonedaRoutes.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para los servicios de cambio de monedas.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const tiposMonedaController = require('./../controllers/tiposMonedaController');

router.get('/check', (req, res) =>
	res.send('OK monedas')
);

/*
 * GET
 */
router.get('/monedasDisponibles', tiposMonedaController.list);
//router.get('/:id', tiposMonedaController.show);

/*
 * POST
 */
router.post('/convertirDivisa', tiposMonedaController.convertirDivisa);
router.post('/', tiposMonedaController.create);
/*
 * PUT
 */
router.put('/:id', tiposMonedaController.update);
/*
 * PATCH
 */


module.exports = router;
