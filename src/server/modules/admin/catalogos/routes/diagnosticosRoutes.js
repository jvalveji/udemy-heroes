// Definición JavaScript para las rutas del Catálogo diagnósticos v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo diagnósticos.
// Fecha de modificación: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const diagnosticosController = require('./../controllers/diagnosticosController');

/**
 * Validación para indicar que se encuentran disponibles los servicios para esta ruta
 */
router.get('/check', function (req, res) {
	res.send('OK');
});
/*
 * GET
 * Obtiene la lista de  todos los item del catálogo por capitulos
 */
router.get('/capitulos', diagnosticosController.showByCapitulosCIE10);
/*
 * GET
 * Obtiene la lista de  todos los item del catálogo por grupo y capitulo
 */
router.get('/grupos/:capitulo', diagnosticosController.showByGruposCIE10);
/*
 * GET
 * Obtiene la lista de  todos los item del catálogo por categoria y grupo
 */
router.get('/categorias/:grupo', diagnosticosController.showByCategoriasCIE10);
/*
 * GET
 * Obtiene la lista de  todos los item del catálogo por codigo CIE10
 */
router.get('/codigoCIE10/:codigo', diagnosticosController.showDiagnosticoByCodigo);
/*
 * GET
 * Obtiene la lista de  todos los item del catálogo por descripción, capitulo, grupo y categoria
 */
router.get('/descripcionCIE10/:descripcion/:capitulo/:grupo/:categoria', diagnosticosController.showDiagnosticoByDescripcion);


module.exports = router;
