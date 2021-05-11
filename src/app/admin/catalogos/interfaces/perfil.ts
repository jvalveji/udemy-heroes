// Definición typescript para la interface IPerfil v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
import { IArcaLog } from './../../../shared/interfaces/arca-log';

/**
 * Interfaz que representa un objeto complejo de tipo Perfil.
 */

export interface IPerfil {
	/**
     * Identificador del documento
     */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
     * Identificador de la aplicación
     */
	aplicacion_id: mongoose.Schema.Types.ObjectId;

	/**
     * Nombre del perfil en la aplicación para la seguridad y accesos de usuario
     */
	idPerfil: string;

	/**
     * Nombre a mostrar al usuario
     */
	nombre: string;

	/**
     * (opcional) Descripción del perfil en la aplicación
     */
	descripcion?: string;

	/**
     * Estado del perfil (habilitado/deshabilitado)
     */
	estado: boolean;

	/**
     * Estado que indica si el perfil es local (falso indica que es de MISE)
     */
	esLocal: boolean;

	/**
     * (opcional) Objeto para el manejo del log asociado al documento
     */
	logs?: IArcaLog;
}
