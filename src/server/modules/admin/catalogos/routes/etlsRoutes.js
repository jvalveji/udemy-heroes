// Definición JavaScript para las rutas del Catálogo etls v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo etls.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const etlsController = require('./../controllers/etlsController');

/**
 * Validación para indicar que se encuentran disponibles los servicios para esta ruta
 */
router.get('/check', function (req, res) {
	res.send('OK');
});
/*
 * GET
 * Obtiene la lista de  todos los item del catálogo
 */
router.get('/', etlsController.list);
router.get('/:name', etlsController.showByNombre);
/*
 * POST
 * Crea un item en la colección
 */
router.post('/', etlsController.create);
/*
 * PUT
 * Crear o actualizar los items del catálogo
 */
router.put('/:id', etlsController.update);

module.exports = router;
