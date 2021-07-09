// Definición para el fichero jobsTaskRoutes.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de JOBS
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const jobsTaskController = require('./../controllers/jobsController');

/*
 * GET
 */
router.get('/', jobsTaskController.list);
router.get('/status/:nameJob/:idJob', jobsTaskController.show);

/*
 * POST
 */
router.post('/', jobsTaskController.create);

module.exports = router;
