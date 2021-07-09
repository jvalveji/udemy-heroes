// Definición para el fichero preferenciasRoutes.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de Preferencias de Usuarios
// Modificado: (25-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

const express = require('express');
let router = express.Router();
const preferenciasUsuariosController = require('./../controllers/preferenciasController');

/*
 * PUT
 */
router.put('/:app/:user', preferenciasUsuariosController.update);

module.exports = router;
