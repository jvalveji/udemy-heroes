// Definición JavaScript para las rutas del Catálogo para plantillas de documentos 
// para imprimir mediante arcaPrinters v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo documentosPrinter.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const catalogoController = require('./../controllers/documentoPrinterController');

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
router.get('/', catalogoController.list);

/*
 * GET
 * Obtiene la lista de  todos los item del catálogo
 */
router.get('/:id', catalogoController.show);

/*
 * PUT
 * actualizar un items al catálogo
 */
router.put('/:id', catalogoController.update);

/*
 * POST
 * Crear un items al catálogo
 */
router.post('/', catalogoController.create);


module.exports = router;
