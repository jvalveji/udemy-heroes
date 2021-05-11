// Definición para el fichero articulosModel.js v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Fabián Cascante Arce <fcascant@ccss.sa.cr>
// Descripción: Definición del modelo ARTÍCULOS para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');

let articulosSchema = new Schema({
	'articulo': String,
	'clase_id': Schema.Types.ObjectId,
	'codigo': String,
	'grupo_id': Schema.Types.ObjectId,
	'subclase_id': Schema.Types.ObjectId,
	'descripcion': String,
	'unidadMedida_id': {
		'_id': Schema.Types.ObjectId,
		'descripcion': String,
		'simbolo': String,
	},
	'categoria_id': Schema.Types.ObjectId,
	'clasificadorGasto': String,
	'partidaEfectivo': String,
	'partidaNoEfectivo': String,
	'estado': Boolean,
	'fechaActualizacion': Date
});

if (dbCore) { module.exports = dbCore.model('articulos', articulosSchema); }
