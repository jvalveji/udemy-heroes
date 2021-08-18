// Definición para el fichero module.routes.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contiene las rutas
//              de los servicios rest asociados al módulo actual
// Modificado: Ing. Rafael Gamboa Molina <rggamboa@ccss.sa.cr>

//Librerias que se ocupan
const express = require('express');
const router = express.Router();

// Se obtienen los ficheros de rutas del módulo actual
const tipoMaterialRoutes = require('../catalogos/routes/tipoMaterialRoutes');
const grupoMaterialRoutes = require('../catalogos/routes/grupoMaterialRoutes');
const grupoArticulosRoutes = require('../catalogos/routes/grupoArticulosRoutes');
const familiasArticulosRoutes = require('../catalogos/routes/familiasArticulosRoutes');
const subfamiliasArticulosRoutes = require('../catalogos/routes/subfamiliasArticulosRoutes');
/**
 * GET /check - Validación que indica que el servicio en esta ruta esta disponible
 * */
router.get('/check', (req, res) =>
    res.send('OK Estoy en Bitzu-RPM catalogos')
);

// Enrutamiento interno del catalogo tipo Materiales
router.use('/tipo', tipoMaterialRoutes);
router.use('/grupo', grupoMaterialRoutes);
router.use('/grupo-articulos', grupoArticulosRoutes);
router.use('/familias-articulos', familiasArticulosRoutes);
router.use('/subfamilias-articulos', subfamiliasArticulosRoutes);
module.exports = router;