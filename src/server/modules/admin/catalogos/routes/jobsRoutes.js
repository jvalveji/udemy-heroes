// Definición JavaScript para las rutas del Catálogo jobs v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo jobs.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const jobsController = require('./../controllers/jobsController');

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
router.get('/', jobsController.list);
router.get('/:name', jobsController.showByNombre);
/*
 * POST
 * Crea un item en la colección
 */
router.post('/', jobsController.create);
/*
 * PUT
 * Crear o actualizar los items del catálogo
 */
router.put('/:id', jobsController.update);

module.exports = router;
