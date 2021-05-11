// Definición para el fichero arcaLogs.js 2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Definición del módulo LOGS para el registro de creación/modificación de un documento.
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
	/**
	 * Propiedad cuando se crea el documento y/u objeto
	 */
	created: {
		/**
		 * Id para la creación del registro
		 */
		_id: {
			type: Schema.Types.ObjectId,
			default: new mongoose.Types.ObjectId()
		},
		/**
		 * Fecha y hora de creación del registro
		 */
		fecha: {
			type: Date,
			default: function () {
				// Se incluye el módulo de utilidades
				let utils = require('./../services/utilidadesService');
				// Retorna la fecha/hora actual del servidor pero para MONGO
				return utils.localDateToUTC(new Date());
			}
		},
		/** 
		 * Id del usuario que crea el registro
		 */
		usuario_id: Schema.Types.ObjectId,
		/**
		 * Nombre de usuario que crea el registro
		 */
		usuario: String,
		/**
		 * Nombre completo del usuario que crea el registro
		 */
		nombre: String
	},
	/**
	 * Propiedad cuando se modifica el documento y/u objeto
	 */
	modified: {
		/**
		 * Id para la modifica del registro
		 */
		_id: {
			type: Schema.Types.ObjectId,
			default: new mongoose.Types.ObjectId()
		},
		/**
		 * Fecha y hora de modificación del registro
		 */
		fecha: Date,
		/** 
		 * Id del usuario que modifica el registro
		 */
		usuario_id: Schema.Types.ObjectId,
		/**
		 * Nombre de usuario que modifica el registro
		 */
		usuario: String,
		/**
		 * Nombre completo del usuario que modifica el registro
		 */
		nombre: String
	}
};
