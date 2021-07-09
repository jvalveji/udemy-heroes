// Definición typescript para la interface IServicio v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
import { IArcaLog } from './../../../shared/interfaces/arca-log';

/**
 * Interfaz que representa un objeto complejo de tipo servicio
 */
export interface IServicio {
	/**
     * Identificador mongo de documento
     */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
     * (opcional) Id del servicio en el sistema SIAH
     */
	idSIAH?: number;

	/**
     * (opcional) Id del servicio en el sistema SIGES
     */
	idSIGES?: number;

	/**
     * Descripción (nombre) del servicio
     */
	descripcion: string;

	/**
     * Estado del documento
     */
	estado: boolean;

	/**
     * (opcional) Objeto para el manejo del log asociado al documento
     */
	logs?: IArcaLog;
}
