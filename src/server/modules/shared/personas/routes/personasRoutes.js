// Definición para el fichero permisosRoutes.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr>
// Modificado: (25-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const personasController = require('./../controllers/personasController');

/*
 * GET
 */
router.get('/:filtro', personasController.showByFilter);
router.get('/fallecidos/:desde/:hasta', personasController.showByFallecidosFilter);

module.exports = router;
