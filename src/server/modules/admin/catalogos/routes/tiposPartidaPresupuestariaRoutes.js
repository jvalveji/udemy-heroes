// Definición JavaScript para las rutas del Catálogo tipos de partida presupuestaria v1.0.0
// Proyecto: Arca - Nutrición
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr> (26-05-2020)
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados al Catálogo tipos de vigencias de contratos.

var express = require('express');
var router = express.Router();
var catalogoController = require('./../controllers/tiposPartidaPresupuestariaController');

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
