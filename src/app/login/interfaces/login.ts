// Definición typescript para la interfaz ILogin v1.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (16-07-2019) Ing. Dagoberto Gómez Jiménez

/**
 * Interface que representa los datos del usuario para el login
 */
export interface ILogin {
	/**
     * Nombre del usuario en el sistema
     */
	usuario: string;

	/**
     * Cadena que contiene la contraseña del usuario
     */
	clave: string;

	/**
     * Identificador de la unidad programática
     */
	idUnidadProgramatica: number;

	/**
	 * Indicador si el usuario es MISE o no
	 */
	esMISE: boolean;
}
