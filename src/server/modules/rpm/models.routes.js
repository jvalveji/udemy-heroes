// Definición para el fichero module.routes.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contiene las rutas
//              de los servicios rest asociados al módulo actual
// Modificado: Ing. Jorge Luis Castro Godinez <jlcastrog@ccss.sa.cr>

//Librerias que se ocupan
const express = require('express');
const router = express.Router();

// Se obtienen los ficheros de rutas del módulo actual
const tipoMaterialRoutes = require('../rpm/catalogos/model.routes');

/**
 * GET /check - Validación que indica que el servicio en esta ruta esta disponible
 * */
router.get('/check', (req, res) =>
    res.send('OK Estoy en Bitzu-RPM main')
);

// Enrutamiento interno del módulo catalogos
router.use('/materiales', tipoMaterialRoutes);

// // Enrutamiento interno del módulo jvj 26/07
// router.use('/catalogos', grupoMaterialRoutes);

module.exports = router;
