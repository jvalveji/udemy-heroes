// Definición typescript para la interface IPermiso v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
import { IArcaLog } from './../../../shared/interfaces/arca-log';

/**
 * Interfaz que representa un objeto complejo de tipo Permiso.
 */

export interface IPermiso {
	/**
     * Identificador del documento
     */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
     * Identificador de la aplicación
     */
	aplicacion_id: mongoose.Schema.Types.ObjectId;

	/**
     * Nombre del permiso en la aplicación para la seguridad y accesos de usuario
     */
	idPermiso: string;

	/**
     * Nombre a mostrar al usuario
     */
	nombre: string;

	/**
     * (opcional) Descripción del permiso en la aplicación
     */
	descripcion?: string;

	/**
     * Estado del permiso (habilitado/deshabilitado)
     */
	estado: boolean;

	/**
     * Estado que indica si el permiso es local (falso indica que es de MISE)
     */
	esLocal: boolean;

	/**
     * (opcional) Objeto para el manejo del log asociado al documento
     */
	logs?: IArcaLog;
}
