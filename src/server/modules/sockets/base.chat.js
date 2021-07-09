// Definición para el fichero base.chat.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagpberto Gómez Jimñenez
// Descripción: Fichero utilizado en la definición del socket para el manejo de mensajeria tipo chat.
// Modificado:

/**
 * Toda función socket retorna un parametro el cuál posee una propiedad
 * llamada "data" que contiene todos los datos enviados del cliente hacia
 * el socket.
 * Entre los datos que puede traer el socket están:
 *    data: {
 *        accion (opcional): Indica una acción a realizar dentro de una función socket ya que
 *                            puede requerir realizar varias cosas en un solo socket y esto
 *                            sirve para identificar dichas acciones.
 *        data (opcional): Indica los datos enviados al socket. No necesariamente el socket 
 *                            puede ocupar datos (por ejemplo si es solo de escucha).
 *        token (opcional): Indica un JWT (jsonwebtoken) en caso de ocuparse dentro de la
 *                           plataforma Arca - MEAN.
 *    }
 */

module.exports = function (socket) {
	/**
	 * Retorna la función para el registro
	 */
	return function (dataIN) {
		// Saca los datos de la variable "data"
		const _data = dataIN.data;

		// Responde el socket hacia el socket que se desee
		socket.emit('bitzu.chat', {
			usuario: _data.usuario,
			mensaje: _data.mensaje
		});
	};
};
