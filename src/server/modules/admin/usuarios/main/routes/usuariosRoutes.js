// Definición para el fichero usuariosRoutes.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de USUARIOS
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
let router = express.Router();
const usuariosController = require('./../controllers/usuariosController');

/*
 * GET
 */
router.get('/:filtro', usuariosController.show);
router.get('/ups/:usuario', usuariosController.showByUnidadesProgramaticas);
router.get('/id/:usuario', usuariosController.showById);

/*
 * POST
 */
router.post('/', usuariosController.create); // Mantenimiento de usuarios

/*
 * PUT
 */
router.put('/:id', usuariosController.update);

/*
 * PATCH
 */
router.patch('/', usuariosController.updatePassword);
router.patch('/:id', usuariosController.resetPassword);

module.exports = router;
