// Definición para  Articulos Grupos
// Proyecto: Bitzu - RPM
// Definiciones por: Ing. Jorge Valverde  <jvalveji@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles de los controladores articulos grupos.
// Modificado: 13-8-2021) Ing. Jorge Valverde

const express = require('express');
let router = express.Router();
const familiasArticulosController = require('../../../rpm/catalogos/controllers/familiasArticulosController');

/**
 * GET /check - Validación que indica que el tipoMaterial en esta ruta esta disponible
 * */
router.get('/check', (req, res) =>
    res.send('OK aqui estoy en Familia Articulos')
);

/*
 * GET
 */
router.get('/', familiasArticulosController.list);

/*
 * get
 */
router.get('/:id_grupo', familiasArticulosController.showByGrupo);


module.exports = router;
