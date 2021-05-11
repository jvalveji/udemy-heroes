// Definición para el fichero tiposMonedaModel.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Descripción: Definición del modelo cambioMoneda para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');

let monedasSchema = new Schema({
	'indicador': String,
	'descripcion': String,
	'simbolo': String,
	'estado': Boolean,
	'logs': arcaLog
});

if (dbCore) { module.exports = dbCore.model('catalogo-monedas', monedasSchema); }
