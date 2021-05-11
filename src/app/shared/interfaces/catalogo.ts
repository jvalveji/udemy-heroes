// Definición typescript para la interface ICatalogo v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
import { IArcaLog } from './arca-log';

/**
 * Interfaz que representa los datos de los catálogos
 */
export interface ICatalogo {
	/**
     * (opcional) Id del documento
     */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
     * Nombre INTERNO del catálogo
     */
	idCatalogo: string;

	/**
     * Nombre a mostrar a los usaurios del catálogo
     */
	nombre: string;

	/**
     * (opcional) Descripción del catálogo
     */
	descripcion?: string;

	/**
     * (opcional) Ruta de mantenimiento del catálogo en el navegador
     */
	path?: string;

	/**
     * Estado del documento
     */
	estado: boolean;

	/**
    * (opcional) Objeto para el manejo del log asociado al documento
    */
	logs?: IArcaLog;
}
