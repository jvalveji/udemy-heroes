// Definición typescript para la interface IUnidadProgramatica v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
import { IArcaLog } from './../../shared/interfaces/arca-log';

/**
 * Interfaz que representa un objeto complejo de tipo Unidad Programatica
 */

export interface IUnidadProgramatica {
	/**
     * (opcjonal) Id del documento
     */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
     * Identificador numérico de la unidad programática
     */
	idUP: number;

	/**
     * Descripción de la unidad programática
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
