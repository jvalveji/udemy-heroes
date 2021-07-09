// Definición JavaScript para las rutas del catálogo unidades programáticas inicio sesión v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contienen las rutas
//              de los servicios rest asociados a las unidades programaticas inicio sesion.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const unidadesProgramaticasInicioSesionController = require('./../controllers/unidadesProgramaticasInicioSesionController');

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
router.get('/', unidadesProgramaticasInicioSesionController.list);
router.get('/:id', unidadesProgramaticasInicioSesionController.show);
router.get('/aplicacion', unidadesProgramaticasInicioSesionController.showByAplicacionLocal);
router.get('/aplicacion/:id', unidadesProgramaticasInicioSesionController.showByIdAplicacion);

/*
 * POST
 * Crea un item en la colección
 */
router.post('/', unidadesProgramaticasInicioSesionController.create);

/*
 * PUT
 * Actualizar los items de la colección
 */
router.put('/:id', unidadesProgramaticasInicioSesionController.update);

/*
 * DELETE
 * Eliminar un item en la colección
 */
router.delete('/:id', unidadesProgramaticasInicioSesionController.delete);

module.exports = router;
