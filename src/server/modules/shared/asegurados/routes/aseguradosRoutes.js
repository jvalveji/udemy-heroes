// Definición para el fichero aseguradosRoutes.js v2.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de consultas SIAC
// Modificado: (07-07-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const aseguradosController = require('./../controllers/aseguradosController');

/*
 * GET
 */
router.get('/:tipoIdentificacion/:identificacion', aseguradosController.showByID);
router.get('/:tipoIdentificacion/:nombre/:primerApellido/:segundoApellido/:sexo', aseguradosController.showByFilter);

module.exports = router;
