// Definición JavaScript para las rutas del Catálogo tipos de funcionarios v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo tipos de funcionario.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const tiposFuncionarioController = require('./../controllers/tiposFuncionarioController');

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
router.get('/', tiposFuncionarioController.list);
router.get('/:id', tiposFuncionarioController.show);
/*
 * POST
 * Crea un item en la colección
 */
router.post('/', tiposFuncionarioController.create);
/*
 * PUT
 * Crear o actualizar los items del catálogo
 */
router.put('/:id', tiposFuncionarioController.update);

module.exports = router;
