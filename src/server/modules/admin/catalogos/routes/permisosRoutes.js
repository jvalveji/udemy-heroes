// Definición JavaScript para las rutas del Catálogo permisos v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo permisos.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const permisosController = require('./../controllers/permisosController');

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
router.get('/', permisosController.list);
router.get('/:id', permisosController.show);
router.get('/aplicacion/:id', permisosController.showByAplicacion);
router.get('/:app/:nombre', permisosController.showByNombre);

/*
 * POST
 * Crea un item en la colección
 */
router.post('/', permisosController.create);

/*
 * DELETE
 * Eliminar los items de la colección
 */
router.delete('/:id', permisosController.delete);

/*
 * PUT
 * Actualizar los items de la colección
 */
router.put('/:id', permisosController.update);

module.exports = router;
