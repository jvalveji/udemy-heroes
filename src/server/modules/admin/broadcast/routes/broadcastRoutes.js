// Definición para el fichero broadcastRoutes.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de BROADCAST
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const broadcastController = require('./../controllers/broadcastController');

/*
 * GET
 */
router.get('/:idApp', broadcastController.listByAplicacion);

/*
 * GET
 */
router.get('/activos/:idApp', broadcastController.showByEstadoActivo);

/*
 * POST
 */
router.post('/:id', broadcastController.create);

/*
 * PUT
 */
router.put('/:id', broadcastController.update);

/*
 * DELETE
 */
router.delete('/:id', broadcastController.remove);

module.exports = router;
