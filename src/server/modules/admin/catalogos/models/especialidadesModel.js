// Definición para el fichero especialidadesModel.js v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Yendri González Sánchez <yvgonzals@ccss.sa.cr>
// Descripción: Definición del modelo ESPECIALIDADES de la colección de CATALOGOS
// para las operaciones CRUD en la base de datos mongo.
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');

let especialidadesSchema = new Schema({
	'idSIAH': Number,
	'idServicioSIAH': Number,
	'servicio_id': {
		'_id': Schema.Types.ObjectId,
		'descripcion': String
	},
	'codigo': String,
	'descripcion': String,
	'estado': Boolean,
	'logs': arcaLog
});

if (dbCore) { module.exports = dbCore.model('catalogo-especialidades', especialidadesSchema); }
