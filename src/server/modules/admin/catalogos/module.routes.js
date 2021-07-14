// Definición para el fichero module.routes.js v1.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la carga de los archivos que contiene las rutas
//              de los servicios rest asociados al módulo actual
// Modificado: (29-06-2020) Ing. Jorge Luis Castro Godinez

const express = require('express');
const router = express.Router();

// Se obtienen los ficheros de rutas del módulo actual
const catalogoController = require('./controllers/catalogosController');
const grupoRhRoutes = require('./routes/grupoRhRoutes');
const unidadesMedidaRoutes = require('./routes/unidadesMedidaRoutes');
const aplicacionesRoutes = require('./routes/aplicacionesRoutes');
const cantonesRoutes = require('./routes/cantonesRoutes');
const clasesRoutes = require('./routes/clasesRoutes');
const diagnosticosRoutes = require('./routes/diagnosticosRoutes');
const distritosRoutes = require('./routes/distritosRoutes');
const especialidadesRoutes = require('./routes/especialidadesRoutes');
const estadosCivilRoutes = require('./routes/estadosCivilRoutes');
const generosRoutes = require('./routes/generosRoutes');
const iconosRoutes = require('./routes/iconosRoutes');
const gruposRoutes = require('./routes/gruposRoutes');
const mediosContactoRoutes = require('./routes/mediosContactoRoutes');
const paisesRoutes = require('./routes/paisesRoutes');
const perfilesRoutes = require('./routes/perfilesRoutes');
const profesionalesRoutes = require('./routes/profesionalesRoutes');
const provinciasRoutes = require('./routes/provinciasRoutes');
const serviciosRoutes = require('./routes/serviciosRoutes');
const subClasesRoutes = require('./routes/subClasesRoutes');
const tiposFuncionarioRoutes = require('./routes/tiposFuncionarioRoutes');
const tiposIdentificacionRoutes = require('./routes/tiposIdentificacionRoutes');
const tiposParentescoRoutes = require('./routes/tiposParentescoRoutes');
const unidadesProgramaticasRoutes = require('./routes/unidadesProgramaticasRoutes');
const pathsRoutes = require('./routes/pathsRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const etlsRoutes = require('./routes/etlsRoutes');
const unidadesProgramaticasInicioSesionRoutes = require('./routes/unidadesProgramaticasInicioSesionRoutes');
const documentoPrinterRoutes = require('./routes/documentoPrinterRoutes');
const mesRoutes = require('./routes/mesRoutes');
const permisosRoutes = require('./routes/permisosRoutes');
const tiposMonedaRoutes = require('./routes/tiposMonedaRoutes');
const bancos = require('./routes/bancosRoutes');
const tiposPartidaPresupuestariaRoutes = require("./routes/tiposPartidaPresupuestariaRoutes");

// Se obtienen los ficheros de rutas de otros sub-módulos

/**
 * GET /check - Validación que indica que el servicio en esta ruta esta disponible
 * */
router.get('/check', (req, res) =>
	res.send('OK')
);

/*
 * GET
 * Obtiene la lista de  todos los catalogos
 */
router.get('/', catalogoController.list);

// Enrutamiento interno del módulo
router.use('/grupo-rh', grupoRhRoutes);
router.use('/unidades-medida', unidadesMedidaRoutes);
router.use('/aplicaciones', aplicacionesRoutes);
router.use('/cantones', cantonesRoutes);
router.use('/clases', clasesRoutes);
router.use('/diagnosticos', diagnosticosRoutes);
router.use('/distritos', distritosRoutes);
router.use('/especialidades', especialidadesRoutes);
router.use('/estados-civil', estadosCivilRoutes);
router.use('/generos', generosRoutes);
router.use('/grupos', gruposRoutes);
router.use('/iconos', iconosRoutes);
router.use('/medios-contacto', mediosContactoRoutes);
router.use('/paises', paisesRoutes);
router.use('/perfiles', perfilesRoutes);
router.use('/profesionales', profesionalesRoutes);
router.use('/provincias', provinciasRoutes);
router.use('/servicios', serviciosRoutes);
router.use('/subClases', subClasesRoutes);
router.use('/tipos-funcionario', tiposFuncionarioRoutes);
router.use('/tipos-identificacion', tiposIdentificacionRoutes);
router.use('/tipos-parentesco', tiposParentescoRoutes);
router.use('/unidades-programaticas', unidadesProgramaticasRoutes);
router.use('/paths', pathsRoutes);
router.use('/jobs', jobsRoutes);
router.use('/etls', etlsRoutes);
router.use('/unidades-programaticas-inicio-sesion', unidadesProgramaticasInicioSesionRoutes);
router.use('/documento-printer', documentoPrinterRoutes);
router.use('/mes', mesRoutes);
router.use('/permisos', permisosRoutes);
router.use('/tipos-moneda', tiposMonedaRoutes);
router.use('/bancos', bancos);
router.use('/tipos-partida-presupuestaria', tiposPartidaPresupuestariaRoutes);

// Enrutamiento otros sub-módulos

module.exports = router;
