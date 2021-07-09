// Definición JavaScript para las rutas del Catálogo grupos siges v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo grupos siges.
// Modificado por: (24-06-2020) Ing. Félix Lee Pan <fleepan@ccss.sa.cr>

const express = require('express');
let router = express.Router();
const gruposController = require('./../controllers/gruposController');

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
router.get('/', gruposController.list);
router.get('/:id', gruposController.showByGrupo);
/*
 * POST
 * Crea un item en la colección
 */
router.post('/', gruposController.create);
/*
 * PUT
 * Crear o actualizar los items del catálogo
 */
router.put('/:id', gruposController.update);

module.exports = router;
