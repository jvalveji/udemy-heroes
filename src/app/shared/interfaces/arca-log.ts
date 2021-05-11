// Definición typescript para la interface IArcaLog v1.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (13-07-2018) Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';

/**
 * Interfaz que permite manejar el logs básico de un registro en la base de datos.
 */

export interface IArcaLog {
	/**
      * Propiedad cuando se crea el documento y/u objeto
      */
	created: {
		/**
         * Id para la creación del registro
         */
		_id: mongoose.Schema.Types.ObjectId,
		/**
         * Fecha y hora de creación del registro
         */
		fecha: Date,
		/**
         * Id del usuario que crea el registro
         */
		usuario_id: mongoose.Schema.Types.ObjectId,
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
		_id: mongoose.Schema.Types.ObjectId,
		/**
         * Fecha y hora de modificación del registro
         */
		fecha: Date,
		/**
         * Id del usuario que modifica el registro
         */
		usuario_id: mongoose.Schema.Types.ObjectId,
		/**
         * Nombre de usuario que modifica el registro
         */
		usuario: String,
		/**
         * Nombre completo del usuario que modifica el registro
         */
		nombre: String
	}
}
