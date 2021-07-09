// Definición JavaScript para las rutas del Catálogo paths v1.0.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo paths.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const pathsController = require('./../controllers/pathsController');

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
router.get('/:id', pathsController.listPathsByAplicacion);
/*
 * GET
 * Obtiene por nombre de la app
 */
router.get('/:app/:nombre', pathsController.showPathByNombre);

/*
 * PUT
 * Crear o actualizar los items del catálogo
 */
router.put('/:id', pathsController.updateByPathsPorAplicacion);
module.exports = router;
