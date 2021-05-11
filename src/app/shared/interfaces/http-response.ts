// Definición typescript para la interface IHttpResponse v1.0.2
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (03-07-2019) Ing. Dagoberto Gómez Jiménez

/**
 * Interfaz que permite manejar las respuestas Http recibidas desde los servicios REST.
 */
export interface IHttpResponse {
	/**
     * Indicador de éxito en la operación realizada con el servidor
     */
	exito: boolean;

	/**
     * Mensaje enviado desde el servidor con información sobre la operación efectuada
     */
	mensaje?: string;

	/**
     * Conjunto de datos enviados en la respuesta desde el servidor
     */
	data?: any;
}
