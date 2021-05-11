// Definición JavaScript para las rutas del Catálogo aplicaciones v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo aplicaciones.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const aplicacionesController = require('./../controllers/aplicacionesController');

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
router.get('/', aplicacionesController.list);
router.get('/:id', aplicacionesController.show);
router.get('/aplicacion/:idApp', aplicacionesController.showByNombre);

/*
 * POST
 * Crea un item en la colección
 */
router.post('/', aplicacionesController.create);

/*
 * PUT
 * Actualizar los items de la colección
 */
router.put('/:id', aplicacionesController.update);

module.exports = router;
