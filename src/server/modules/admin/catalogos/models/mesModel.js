// Definición para el fichero mesModel.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr> (24-04-2019)
// Descripción: Definición del modelo TIPOS_IDENTIFICACION de la colección de CATALOGOS
// para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');

let mesSchema = new Schema({
	'idMes': Number,
	'descripcion': String,
	'logs': arcaLog
});

if (dbCore) { module.exports = dbCore.model('catalogo-meses', mesSchema); }
