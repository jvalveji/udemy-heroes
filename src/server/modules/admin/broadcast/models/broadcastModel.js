// Definición para el fichero broadcastModel.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del modelo BROADCAST.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');

let broadcastSchema = new Schema({
	aplicacion_id: Schema.Types.ObjectId,
	'mensaje': String,
	'color': String,
	'fechaInicio': Date,
	'fechaFinal': Date,
	'estado': Boolean,
	'enviado': Boolean,
	logs: arcaLog
});

if (dbCore) { module.exports = dbCore.model('broadcast', broadcastSchema); }
