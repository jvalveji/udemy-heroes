// Definición para el fichero catalogoModel.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del modelo (genérico) CATALOGO.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dbCore = require('./../../../../config/db')('mixin', 'core');

let catalogoSchema = new Schema({
	'id': Number,
	'nombre': String,
	'descripcion': String,
	'path': String,
	'items': [{
		'id': Number,
		'descripcion': String
	}],
	'estado': Boolean
});

if (dbCore) { module.exports = dbCore.model('catalogo', catalogoSchema, 'catalogos'); }
