// Definición para Tipo Material
// Proyecto: Bitzu - MEAN
// Definiciones por: Ing. Jorge Luis Castro Godinez <jlcastrog@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles de los controladores TIPO MATERIAL
// Modificado: (29-06-2021) Ing. Jorge Luis Castro Godinez

const express = require('express');
let router = express.Router();
const grupoMaterialController = require('../../../rpm/catalogos/controllers/grupoMaterialController');

/**
 * GET /check - Validación que indica que el tipoMaterial en esta ruta esta disponible
 * */
router.get('/check', (req, res) =>
    res.send('OK aqui estoy en Tipo Materiales de Materiales')
);

/*
 * GET
 */
router.get('/listarGrupoMaterial', grupoMaterialController.getGrupoMaterial);

/*
 * PUT
 */
// router.put('/modificarTipoMaterial/:id', tipoMaterialController.modificaTipoMaterial);

// /*
//  * PUT
//  */
// router.put('/guardartipoMaterial', tipoMaterialController.crearTipoMaterial);

// /*
//  * PUT
//  */
// router.get('/consultarTipoMaterial/:id', tipoMaterialController.showByIdTipoMaterial);

// /*
//  * DELETE
//  */
// router.delete('/eliminaTipoMaterial/:id', tipoMaterialController.eliminarTipoMaterial);

module.exports = router;
