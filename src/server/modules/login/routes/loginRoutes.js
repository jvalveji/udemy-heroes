// Definición para el fichero loginRoutes.js v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de LOGIN
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
const router =  express.Router();
const loginController = require('./../controllers/loginController');
const usuariosController = require('./../../admin/usuarios/main/controllers/usuariosController');
const upInicioSesionController = require('./../../admin/catalogos/controllers/unidadesProgramaticasInicioSesionController');

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
router.get('/ups/:usuario', upInicioSesionController.showByAplicacionLocal);

/*
 * PUT
 */
router.put('/:app', loginController.update);
router.put('/auth-arca/:app', loginController.update);

/*
 * PATCH
 */
router.patch('/', usuariosController.updatePassword);

module.exports = router;
