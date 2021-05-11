// Definición para el fichero mailPhpListService.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Servicio (middleware) encargado de gestionar el envio de correos por medio de PhpList
// Importante: Cuando se requieran crear nuevas funcionalidades; deberán incluirse por ORDEN ALFABETICO ascendente
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Módulo request para solicitudes http
const request = require('ajax-request');
// Módulo async para manejo solicitudes asincronas
const async = require('async');
// Se incluye el servicio de utilidades
const utils = require('./../services/utilidadesService');

/**
 * Módulo para gestionar las funcionalidades de envio de correos por medio de PhpList desde la plataforma Arca - MEAN
 */
module.exports = {
	/**
	 * Método que permite enviar un correo a UN DESTINATARIO específico
	 * @param idTemplate {number} Representa el identificador de la plantilla en el PhpList
	 * @param addressee {string} Representa la dirección de correo electrónico del destinatario
	 * @param message {string} Representa el mensaje a enviar por correo (puede ser en formato HTML)
	 * @param copyMe {string} Representa la dirección de correo electrónico para enviar una copia del mensaje (para omitir use null)
	 * @param callback {function} Función callback que recibe la respuesta
	 */
	send(idTemplate, addressee, message, copyMe, callback) {
		// Valida si la dirección de correo electrónico es válido
		if (addressee && utils.isEmail(addressee)) {
			// Se envia el mensaje al servidor de PhpList
			request({
				url: 'http://10.76.18.66/mailccss/enviar.php',
				method: 'GET',
				data: {
					plantilla: idTemplate,
					destinatario: addressee,
					mensaje: message
				}
			}, function (err) {
				// Verifica si hubo errores
				if (err) {
					callback(false);
				}
				// Verifica si requiere enviar una copia del mensaje
				if (copyMe && utils.isEmail(copyMe)) {
					// Se envia el mensaje al servidor de PhpList
					request({
						url: 'http://10.76.18.66/mailccss/enviar.php',
						method: 'GET',
						data: {
							plantilla: idTemplate,
							destinatario: copyMe,
							mensaje: message
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
		else {
			callback(false);
		}
	},
	/**
	 * Método que permite enviar un correo a VARIOS DESTINATARIOS
	 * @param idTemplate {number} Representa el identificador de la plantilla en el PhpList
	 * @param recipients {Array<string>} Representa las direcciones de correo electrónico de los destinatarios
	 * @param message {string} Representa el mensaje a enviar por correo (puede ser en formato HTML)
	 * @param copyMe {string} Representa la dirección de correo electrónico para enviar una copia del mensaje (para omitir use null)
	 * @param callback {function} Función callback que recibe la respuesta
	 * @returns Retorna un indicador de éxito (verdadero/falso)
	 */
	sendMany(idTemplate, recipients, message, copyMe, callback) {
		// Valida si la dirección de correo electrónico es válido
		if (recipients && recipients.length > 0 && recipients.some((email, index) => {
			// Se valida que TODAS las direciones de correo sean válidas
			if (!utils.isEmail(email)) { return false; }
			if (recipients.length === index + 1) { return true; }
		})) {
			// Inicia un ciclo para enviar los correos
			async.eachSeries(recipients, function (email, callback2) {
				// Se envia el mensaje al servidor de PhpList
				request({
					url: 'http://10.76.18.66/mailccss/enviar.php',
					method: 'GET',
					data: {
						plantilla: idTemplate,
						destinatario: email,
						mensaje: message
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
				if (copyMe && utils.isEmail(copyMe)) {
					// Se envia el mensaje al servidor de PhpList
					request({
						url: 'http://10.76.18.66/mailccss/enviar.php',
						method: 'GET',
						data: {
							plantilla: idTemplate,
							destinatario: copyMe,
							mensaje: message
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
