// Definición para el fichero messagePhoneService.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Servicio (middleware) encargado de gestionar el envio de mensajes de texto a teléfonos
// Importante: Cuando se requieran crear nuevas funcionalidades; deberán incluirse por ORDEN ALFABETICO ascendente
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Módulo request para solicitudes http
const request = require('ajax-request');
// Módulo async para manejo solicitudes asincronas
const async = require('async');
// Se incluye el servicio de utilidades
const utils = require('./utilidadesService');

/**
 * Módulo para gestionar las funcionalidades de envio de mensaje de texto a teléfonos desde la plataforma Arca - MEAN
 */
module.exports = {
	/**
	 * Método que permite enviar un mensaje a UN DESTINATARIO específico
	 * @param addressee {string} Representa el número telefónico del destinatario
	 * @param message {string} Representa el mensaje a enviar por mensaje
	 * @param copyMe {string} Representa el número telefónico para enviar una copia del mensaje (para omitir use null)
	 * @param callback {function} Función callback que recibe la respuesta
	 */
	send(addressee, message, copyMe, callback) {
		// Valida si el teléfono es válido
		if (addressee && utils.isPhoneNumber(addressee)) {
			// Se envia el mensaje al servidor de mensajeria
			request({
				url: 'http://10.76.18.99/SMS/send.php',
				method: 'GET',
				data: {
					tels: addressee,
					texto: message
				}
			}, function (err) {
				// Verifica si hubo errores
				if (err) {
					callback(false);
				}
				// Verifica si requiere enviar una copia del mensaje
				if (copyMe && utils.isPhoneNumber(copyMe)) {
					// Se envia el mensaje al servidor de mensajeria
					request({
						url: 'http://10.76.18.99/SMS/send.php',
						method: 'GET',
						data: {
							tels: copyMe,
							texto: message
						}
					}, function (err) {
						// Se obvia el error (en caso que exista)
						callback(true);
					});
				} else {
					callback(true);
				}
			});
		}
	},
	/**
	 * Método que permite enviar un mensaje a VARIOS DESTINATARIO específicos
	 * @param recipients {Array<string>} Representa una lista de números telefónicos de los destinatarios
	 * @param message {string} Representa el mensaje a enviar por mensaje
	 * @param copyMe {string} Representa el número telefónico para enviar una copia del mensaje (para omitir use null)
	 * @param callback {function} Función callback que recibe la respuesta
	 */
	sendMany(recipients, message, copyMe, callback) {
		// Valida si los teléfonos son válidos
		if (recipients && recipients.length > 0 && recipients.some((phone, index) => {
			// Se valida que TODAS las direciones de correo sean válidas
			if (!utils.isPhoneNumber(phone)) { return false; }
			if (recipients.length === index + 1) { return true; }
		})) {
			// Inicia un ciclo para enviar los mensajes
			async.eachSeries(recipients, function (phone, callback2) {
				// Se envia el mensaje al servidor de mensajeria
				request({
					url: 'http://10.76.18.99/SMS/send.php?',
					method: 'GET',
					data: {
						tels: phone,
						texto: message
					}
				}, function (err) {
					// Se obvia el error (en caso que exista)
					callback2();
				});
			}, function (err) {
				// Valida si existe un error
				if (err) {
					callback(false);
				}
				// Verifica si requiere enviar una copia del mensaje
				if (copyMe && utils.isPhoneNumber(copyMe)) {
					// Se envia el mensaje al servidor de mensajeria
					request({
						url: 'http://10.76.18.99/SMS/send.php?',
						method: 'GET',
						data: {
							tels: copyMe,
							texto: message
						}
					}, function (err) {
						// Se obvia el error (en caso que exista)
						callback(true);
					});
				} else {
					// Se obvia el error (en caso que exista)
					callback(true);
				}
			});
		}
		else {
			callback(false);
		}
	}
};
