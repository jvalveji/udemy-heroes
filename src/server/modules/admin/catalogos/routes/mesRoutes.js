// Definición JavaScript para las rutas del Catálogo mes v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por:  Ing. Félix Lee Pan <fleepan@ccss.sa.cr> (24-04-2019)
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo mes.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const mesController = require('./../controllers/mesController');

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
router.get('/', mesController.list);
router.get('/:id', mesController.show);
/*
 * POST
 * Crea un item en la colección
 */
router.post('/', mesController.create);
/*
 * PUT
 * Crear o actualizar los items del catálogo
 */
router.put('/:id', mesController.update);

module.exports = router;
