// Definición JavaScript para las rutas del Catálogo perfiles v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo perfiles.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const perfilesController = require('./../controllers/perfilesController');

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
router.get('/', perfilesController.list);
router.get('/:id', perfilesController.show);
router.get('/aplicacion/:id', perfilesController.showByAplicacion);
router.get('/:app/:nombre', perfilesController.showByNombre);

/*
 * POST
 * Crea un item en la colección
 */
router.post('/', perfilesController.create);

/*
 * PUT
 * Actualizar los items de la colección
 */
router.put('/:id', perfilesController.update);

module.exports = router;
