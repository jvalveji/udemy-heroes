// Definición para el fichero cie10Model.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del modelo CIE10 de la colección cie10 
// para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');

let cie10Schema = new Schema({
	'capitulo_id': Schema.Types.ObjectId,
	'categoria_id': Schema.Types.ObjectId,
	'grupo_id': Schema.Types.ObjectId,
	'cie10': String,
	'descripcion': String,
	'estado': Boolean
});

if (dbCore) { module.exports = dbCore.model('cie10', cie10Schema); }
