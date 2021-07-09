// Definición JavaScript para las rutas del Catálogo unidades programáticas v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo unidades programáticas.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const unidadesProgramaticasController = require('./../controllers/unidadesProgramaticasController');

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
router.get('/', unidadesProgramaticasController.list);
router.get('/:id', unidadesProgramaticasController.show);

/*
 * POST
 * Crea un item en la colección
 */
router.post('/', unidadesProgramaticasController.create);

/*
 * PUT
 * Actualizar los items de la colección
 */
router.put('/:id', unidadesProgramaticasController.update);

module.exports = router;
