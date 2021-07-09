// Definición typescript para la interface IParametro v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
import { IArcaLog } from './../../../shared/interfaces/arca-log';

/**
 * Interfaz que representa un objeto complejo de tipo Parámetro.
 */
export interface IParametro {
	/**
     * (opcional) Identificador del documento
     */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
     * (opcional) Identificador de la aplicación arca
     */
	aplicacion_id?: mongoose.Schema.Types.ObjectId;

	/**
     * (opcional) Identificador de la unidad programática
     */
	unidadProgramatica_id?: mongoose.Schema.Types.ObjectId;

	/**
     * Nombre del parámetro
     */
	nombre: string;

	/**
     * (opcional) Descripción general del parámetro
     */
	descripcion?: string;

	/**
     * Valor dado al parámetro
     */
	valor: string;

	/**
     * Estado de la aplicación (habilitado/deshabilitado)
     */
	estado: boolean;

	/**
    * (opcional) Objeto para el manejo del log asociado al documento
    */
	logs?: IArcaLog;
}
