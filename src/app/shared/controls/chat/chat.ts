// Definición typescript para la interface IChat v1.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2020)  Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';

/**
 * Interfaz que permite manejar los mensajes de chat.
 */
export interface IChat {
	/**
     * Id para la creación del registro
     */
	_id?: mongoose.Schema.Types.ObjectId,
	/**
     * Nombre del usuario que envia la información
     */
	usuario: String,
	/**
     * Texto del mensaje
     */
	mensaje: String,
	/**
     * Indicador si el mensaje es importante
     */
	esImportante?: false
}
