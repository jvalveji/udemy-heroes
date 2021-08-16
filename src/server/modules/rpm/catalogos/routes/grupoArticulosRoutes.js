// Definición para  Articulos Grupos
// Proyecto: Bitzu - RPM
// Definiciones por: Ing. Jorge Valverde  <jvalveji@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles de los controladores articulos grupos.
// Modificado: 13-8-2021) Ing. Jorge Valverde

const express = require('express');
let router = express.Router();
const grupoArticulosController = require('../../../rpm/catalogos/controllers/grupoArticulosController');

/**
 * GET /check - Validación que indica que el tipoMaterial en esta ruta esta disponible
 * */
router.get('/check', (req, res) =>
    res.send('OK aqui estoy en Grupo Articulos')
);

/*
 * GET
 */
router.get('/', grupoArticulosController.list);

/*
 * get
 */
router.get('/:id', grupoArticulosController.showByGrupo);


module.exports = router;
