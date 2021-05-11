// Definición typescript para la interface IUnidadMedida v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';

/**
 * Interfaz que representa un objeto complejo de tipo Unidad de Medida.
 */

export interface IUnidadMedida {
	/**
     * Identificador de la unidad de medida
     */
	_id?: mongoose.Schema.Types.ObjectId,
	/**
     * Descripción de la unidad de medida
     */
	descripcion?: string;
	/**
     * Simbolo de la unidad de medida
     */
	simbolo?: string;
	/**
     * Equivalencia para la unidad de medida
     */
	equivalencia?: {
		/**
         * Descripción para la equivalencia de la unidad de medida
         */
		descripcion: string;
		/**
         * Valor para la equivalencia de la unidad de medida
         */
		valor: any
	}
	/**
     * Estado de la unidad de medida
     */
	estado?: boolean;
}
