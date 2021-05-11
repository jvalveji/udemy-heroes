// Definición JavaScript para el modelo unidades programáticas inicio sesión v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del modelo UNIDADES PROGRAMATICAS INICIO SESION para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');

let unidadesProgramaticasInicioSesionSchema = new Schema({
	'aplicacion_id': Schema.Types.ObjectId,
	'unidadProgramatica_id': Schema.Types.ObjectId,
	estado: Boolean,
	logs: arcaLog
});

if (dbCore) {
	module.exports = dbCore.model('catalogo-unidades-programaticas-inicio-sesion',
		unidadesProgramaticasInicioSesionSchema,
		'catalogo-unidades-programaticas-inicio-sesion');
}
