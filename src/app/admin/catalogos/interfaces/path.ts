// Definición typescript para la interface IPath v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// Se importa el módulo de mongoose
import { mongoose } from 'mongoose';
/**
 * Interfaz que representa un objeto complejo de tipo Path.
 */

export interface IPath {

	/**
     * Identificador del path
     */
	_id?: mongoose.Schema.Types.ObjectId,
	/**
     * Nombre del path (ruta) en la aplicación para la seguridad y accesos de usuario
     */
	idPath: string;
	/**
     * Nombre a mostrar al usuario
     */
	nombre?: string;
	/**
     * Nombre de la ruta en la aplicación
     */
	path: string;
	/**
     * Descripción del path (ruta) en la aplicación
     */
	descripcion: string;
	/**
     * Descripción del icono para el path
     */
	icono: string;
	/**
     * Estado del path (habilitado/deshabilitado)
     */
	estado: boolean;
}
