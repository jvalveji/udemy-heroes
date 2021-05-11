// Definición JavaScript para las rutas del Catálogo cantones v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo cantones.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const cantonesController = require('./../controllers/cantonesController');

/**
 * Validación para indicar que se encuentran disponibles los servicios para esta ruta
 */
router.get('/check', function (req, res) {
	res.send('OK');
});
/*
 * GET
 */
router.get('/', cantonesController.list);
router.get('/:idProvincia', cantonesController.showByProvincia);
/*
 * POST
 * Crea un item en la colección
 */
router.post('/', cantonesController.create);
/*
 * PUT
 * Crear o actualizar los items del catálogo
 */
router.put('/:id', cantonesController.update);

module.exports = router;
