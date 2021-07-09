// Definición para el fichero tokenRoutes.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de TOKEN
// Modificado:

const express = require('express');
let router = express.Router();
const tokenController = require('./../controllers/tokenController');

/*
 * POST
 */
router.post('/:medida/:ttl', tokenController.create);
router.post('/auth-arca/decode', tokenController.decodeAuthArcaToken);

module.exports = router;
