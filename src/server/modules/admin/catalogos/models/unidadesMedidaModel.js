// Definición para el fichero unidadesMedidaModel.js v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del modelo TIPOS_UNIDADES_MEDIDA de la colección de CATALOGOS
// para las operaciones CRUD en la base de datos mongo.
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');

let unidadMedidaSchema = new Schema({
	'descripcion': String,
	'estado': Boolean,
	'items': [{
		'descripcion': String,
		'simbolo': String,
		'equivalencia': {
			'descripcion': String,
			'valor': Number
		},
		'estado': Boolean
	}],
	'logs': arcaLog
});

if (dbCore) { module.exports = dbCore.model('catalogo-medida-unidades-tipos', unidadMedidaSchema); }
