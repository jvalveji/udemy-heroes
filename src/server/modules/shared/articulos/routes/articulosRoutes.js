// Definición para el fichero artiuclosRoutes.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Fabián Cascante Arce <fcascant@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de Articulos
// Modificado: (25-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const articulosController = require('./../controllers/articulosController');

/*
 * GET
 */
router.get('/', articulosController.list);
router.get('/clase/:id', articulosController.showByClase);
router.get('/subClase/:id', articulosController.showBySubClase);
router.get('/grupo/:id', articulosController.showByGrupo);
router.get('/:clase/:subClase/:grupo/:filtro', articulosController.showByFiltro);

module.exports = router;
