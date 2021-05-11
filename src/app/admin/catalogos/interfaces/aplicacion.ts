// Definición typescript para la interface IAplicacion v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
import { IArcaLog } from './../../../shared/interfaces/arca-log';

/**
 * Interfaz que representa un objeto complejo de tipo Aplicaciones.
 */
export interface IAplicacion {
	/**
     * Identificador del documento
     */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
     * Identificador interno de la aplicación
     */
	idApp: string;

	/**
     * Nombre a mostrar al usuario
     */
	nombre: string;

	/**
     * (opcional) Descripción general de la aplicación
     */
	descripcion?: string;

	/**
     * Estado de la aplicación (habilitado/deshabilitado)
     */
	estado: boolean;

	/**
    * (opcional) Objeto para el manejo del log asociado al documento
    */
	logs?: IArcaLog;
}
