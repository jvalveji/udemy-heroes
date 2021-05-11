// Definición para el fichero grupoRhModel.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Definición del modelo GRUPO-RH de la colección de CATALOGOS
// para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');

let grupoRhSchema = new Schema({
	'descripcion': String,
	'estado': Boolean,
	'logs': arcaLog
});

if (dbCore) { module.exports = dbCore.model('catalogo-RH-grupos', grupoRhSchema, 'catalogo-RH-grupos'); }
