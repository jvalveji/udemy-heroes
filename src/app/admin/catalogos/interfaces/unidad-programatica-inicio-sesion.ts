// Definición typescript para la interface IUnidadProgramaticaInicioSesion v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
import { IArcaLog } from './../../../shared/interfaces/arca-log';

/**
 * Interfaz que representa un objeto complejo de tipo Unidad Programatica Inicio Sesion
 */

export interface IUnidadProgramaticaInicioSesion {
	/**
     * Identificador mongo de documento
     */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
     * Id de la aplicación arca
     */
	aplicacion_id: mongoose.Schema.Types.ObjectId;

	/**
     * Id de la unidad programática
     */
	unidadProgramatica_id?: mongoose.Schema.Types.ObjectId;

	/**
     * Estado del documento
     */
	estado: boolean;

	/**
     * (opcional) Objeto para el manejo del log asociado al documento
     */
	logs?: IArcaLog;
}
