// Definición para el fichero permisosRoutes.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer las rutas disponibles para el servicio de Permisos Usuarios
// Modificado: (25-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

const express = require('express');
let router = express.Router();
const permisosUsuariosController = require('./../controllers/permisosController');

/*
 * GET
 */
router.get('/:app/:up/:usuario', permisosUsuariosController.listByUsuarioAplicacionUnidadProgramatica);
router.get('/:app/:up/:usuario/:permiso', permisosUsuariosController.validarPermisoUsuarioPorNombre);

/*
 * PUT
 */
router.put('/:app/:up/:usuario', permisosUsuariosController.updateByUsuarioYUnidadProgramatica);

module.exports = router;
