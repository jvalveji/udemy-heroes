// Definición para el fichero categoriasCIE10Model.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del modelo CATEGORIAS_CIE10 de la colección de CATALOGOS
// para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');

let categoriasCIE10Schema = new Schema({
	'grupo_id': Schema.Types.ObjectId,
	'idUCore': Number,
	'categoria': String,
	'descripcion': String,
	'estado': Boolean,
	'logs': arcaLog
});

if (dbCore) { module.exports = dbCore.model('catalogo-CIE10-categorias', categoriasCIE10Schema); }
