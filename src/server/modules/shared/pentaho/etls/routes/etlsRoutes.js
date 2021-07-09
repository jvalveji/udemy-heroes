// Definición para el fichero etlsTaskRoutes.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de ETLS
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const etlsTaskController = require('./../controllers/etlsController');

/*
 * GET
 */
router.get('/', etlsTaskController.list);
router.get('/status/:nameEtl', etlsTaskController.show);

/*
 * POST
 */
router.post('/', etlsTaskController.create);

module.exports = router;
