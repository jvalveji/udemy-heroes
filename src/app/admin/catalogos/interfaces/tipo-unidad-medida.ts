// Definición typescript para la interface ITipoUnidadMedida v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// Se importan las interfaces  utilizar
import { IUnidadMedida } from './unidad-medida';

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';

/**
 * Interfaz que representa un objeto complejo de tipo Tipos Unidades de Medida.
 */

export interface ITipoUnidadMedida {
	/**
     * Identificador del tipo de unidad de medida
     */
	_id?: mongoose.Schema.Types.ObjectId,
	/**
     * Nombre del tipo de unidad de medida
     */
	descripcion?: string;
	/**
     * Arreglo con los items que representa las unidades de medida
     */
	items?: Array<IUnidadMedida>;
	/**
     * Estado del tipo de unidad de medida (habilitado/deshabilitado)
     */
	estado: boolean;
}
