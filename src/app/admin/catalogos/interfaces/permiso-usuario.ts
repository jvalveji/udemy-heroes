// Definición typescript para la interface IPermisoUsuario v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
import { IArcaLog } from './../../../shared/interfaces/arca-log';

/**
 * Interfaz que representa un objeto complejo de tipo Permiso Usuario.
 */

export interface IPermisoUsuario {
	/**
     * Identificador del documento
     */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
     * Identificador de la aplicación
     */
	aplicacion_id: mongoose.Schema.Types.ObjectId;

	/**
    * Identificador de la unidad programática
    */
	unidadProgramatica_id: mongoose.Schema.Types.ObjectId;

	/**
    * Identificador del usuario
    */
	usuario_id: mongoose.Schema.Types.ObjectId;

	/**
     * Identificador del permiso
     */
	permiso_id: mongoose.Schema.Types.ObjectId;

	/**
     * (opcional) Objeto para el manejo del log asociado al documento
     */
	logs?: IArcaLog;
}
