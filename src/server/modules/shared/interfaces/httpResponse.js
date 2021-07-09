// Definición para el fichero mise-servicios.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Clase que representa la respuesta HTTP

/**
 * @constructor Constructor de la clase HttpResponse
 * @param {boolean} _exito Indica verdadero o falso según la respuesta
 * @param {string} _mensaje Mensaje para el usuario
 * @param {object} _data Objeto que contra la respuesta del servicio
 */
function HttpResponse(_exito, _mensaje, _data) {
    /**
     * @property Propiedad que contiene el cuerpo de la respuesta Htpp
     */
	this.respuesta = {
		exito: _exito, // Indica true o false
		mensaje: _mensaje, // Indica un texto de mensaje
		data: _data // Indica la data a enviar al cliente
	};
}

/**
 * Función que convierte la respuesta a un formato JSON
 */
HttpResponse.prototype.getJSON = function () {
	return JSON.stringify(this.respuesta);
};

/**
 * Se exporta la clase creada
 */
module.exports = HttpResponse;