// Definición para el fichero personasModel.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del modelo PERSONA para las operaciones CRUD en la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../models/arcaLogs');

let personaSchema = new Schema({
	tipoIdentificacion_id: {
		_id: Schema.Types.ObjectId,
		descripcion: String
	},
	identificacion: String,
	nombre: String,
	apellido1: String,
	apellido2: String,
	genero_id: {
		_id: Schema.Types.ObjectId,
		descripcion: String
	},
	fechaNacimiento: Date,
	provinciaNacimiento: {
		_id: Schema.Types.ObjectId,
		descripcion: String
	},
	datosPadres: {
		identificacionMadre: Number,
		identificacionPadre: Number,
		nombreCompletoMadre: String,
		nombreCompletoPadre: String
	},
	pais_id: {
		_id: Schema.Types.ObjectId,
		nacionalidad: String
	},
	mediosContacto: [{
		tipoMedioContacto_id: {
			_id: Schema.Types.ObjectId,
			descripcion: String
		},
		descripcion: String
	}],
	esFallecido: Boolean,
	fechaDefuncion: Date,
	citaDefuncion: {
		asiento: String,
		folio: String,
		provincia: String,
		tomo: String
	},
	esUsuarioArca: Boolean,
	logs: arcaLog,
	idCargaPadron: Number
});

// Atributo virtual que une el nombre, el primer apellido y el segundo apellido para filtar las personas por el índice
personaSchema.virtual('fullname').get(function () {
	return [this.nombre, this.apellido1, this.apellido2].join(' ');
});

if (dbCore) { module.exports = dbCore.model('personas', personaSchema); }
