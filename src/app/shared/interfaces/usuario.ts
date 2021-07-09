// Definición typescript para la interface IUsuario v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';

/**
 * Interfaz que representa los datos de un usuario del sistema
 */
export interface IUsuario {
	/**
      * (opcional) Id del documento
      */
	_id?: mongoose.Schema.Types.ObjectId;

	/**
     * (opcional) Identificador de la persona asociada al usuario
     */
	persona_id?: mongoose.Schema.Types.ObjectId;

	/**
     * (opcional) Nombre de usuario
     */
	usuario?: string;

	/**
     * (opcional) Contraseña del usuario
     */
	password?: string;

	/**
     * (opcional) Indicador de usuario MISE
     */
	esMise?: boolean;

	/**
     * (opcional) Fecha último cambio contraseña
     */
	ultimoCambioPassword?: Date;

	/**
     * (opcional) Indicador del estado de usuario (activo/inactivo)
     */
	estado?: boolean;
}
