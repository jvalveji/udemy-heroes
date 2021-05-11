// Definición JavaScript para las rutas del proceso SIGES v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas de los servicios del proceso del SIGES

const express = require('express');
let router =  express.Router();
const procesoSIGESController = require('../controllers/procesoSIGESController');

/**
 * Validación para indicar que se encuentran disponibles los servicios para esta ruta
 */
router.get('/check', function (req, res) {
	res.send('OK');
});

/*
 * POST
 */
router.post('/upload', procesoSIGESController.upload);

module.exports = router;
