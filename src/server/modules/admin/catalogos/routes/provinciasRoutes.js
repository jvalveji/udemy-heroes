// Definición JavaScript para las rutas del Catálogo provincias v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo provincias.
// Modificado por: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const provinciasController = require('./../controllers/provinciasController');

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
router.get('/', provinciasController.list);
router.get('/:id', provinciasController.show);
/*
 * POST
 * Crea un item en la colección
 */
router.post('/', provinciasController.create);
/*
 * PUT
 * Crear o actualizar los items del catálogo
 */
router.put('/:id', provinciasController.update);

module.exports = router;
