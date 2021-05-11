// Definición para el fichero parametrosRoutes.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de PARAMETROS
// Modificado: (02-04-2019) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router =  express.Router();
const parametrosController = require('../controllers/parametrosController.js');

/**
 * Validación para indicar que se encuentran disponible los servicios para esta ruta
 */
router.get('/check', function (req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.send('OK');
});

/*
 * GET
 */
router.get('/', parametrosController.list);
router.get('/globales', parametrosController.listByGlobal);
router.get('/aplicaciones/:id', parametrosController.listByAplicacion);
router.get('/unidades-programaticas/:app/:up', parametrosController.listByUnidadProgramatica);
router.get('/:id', parametrosController.show);
router.get('/filtro-global/:nombre', parametrosController.showByGlobalNombre);
router.get('/filtro-aplicacion/:app/:nombre', parametrosController.showByAplicacionNombre);
router.get('/filtro-unidad-programatica/:app/:up/:nombre', parametrosController.showByUnidadProgramaticaNombre);

/*
 * POST
 */
//router.post('/', parametrosController.create);

/*
 * PUT
 */
router.put('/', parametrosController.createUpdate);

module.exports = router;
