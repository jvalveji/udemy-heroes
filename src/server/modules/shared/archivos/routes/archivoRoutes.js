// Definición para el fichero archivoRoutes.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al modelo archivo (GridFs)
// Modificado: (25-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const archivoController = require('./../controllers/archivoController');

/*
 * GET
 */
router.get('/:id', archivoController.show);
router.get('/soloArchivo/:id', archivoController.showSoloArchivo);

/*
 * POST
 */
router.post('/', archivoController.create);

/*
 * DELETE
 */
router.delete('/:id', archivoController.remove);

/*
 * PUT
 */
router.put('/', archivoController.confirm);

module.exports = router;
