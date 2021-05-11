// Definición para el fichero utilidadesController.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con definiciones de funciones utilitarias públicas.
// Modificado por: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const HttpResponse = require('./../../interfaces/httpResponse'); // Modelo para el manejo de la respuesta HTTP genérica
const utils = require('./../../services/utilidadesService'); // Se incluye el fichero de funciones utilitarias

/**
 * utilidadesController.js
 *
 * @description :: Server-side logic for managing utilidades.
 */

module.exports = {
	/**
	 * @description Retorna la fecha y hora actual del servidor
	 */
	showServidorNTP: function (req, res) {
		// Se instancia el objeto para la respuesta http
		const hr = new HttpResponse(true, 'Tiempo del servidor (NTP).', utils.localDateToUTC(new Date()));
		// Se obtiene el JSON del mensaje y se envia
		res.send(hr.getJSON());
	}
};
