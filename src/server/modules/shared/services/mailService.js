// Definición para el fichero mailService.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Servicio (middleware) encargado de gestionar el envio de correos
// Importante: Cuando se requieran crear nuevas funcionalidades; deberán incluirse por ORDEN ALFABETICO ascendente
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const nodemailer = require('nodemailer'); // Módulo para manejo de correos electrónicos
// Se instancia el objeto de envio de correo
let mail = nodemailer.createTransport({
	host: '172.30.37.163', // Host CCSS
	port: 25,
	secure: false
});

/**
 * Módulo para gestionar las funcionalidades de envio de correos por medio de PhpList desde la plataforma Arca - MEAN
 */
module.exports = {
	/**
	 * Método que permite enviar un correo por medio del servidor de correo institucional
	 * @param mailOptions {object} Representa las lista de opciones para enviar el correo electrónico.
	 * @param isHtml {boolean} Indica si el mensaje se envia como HTML 
	 * 							(en caso contrario será enviado como texto plano)
	 * @param callback {function} Función callback que recibe la respuesta
	 * @description Los siguientes son la lista de propiedades mínimas requeridas para el envio del correo:
	 * 	+ from -> {string} Indica el correo de quién envia la información; 
	 * por default si no existe esta propiedad se asigna como autor del correo a 
	 * "'Plataforma Arca' <`no-reply@ccss.sa.cr>"
	 * 	+ to 		-> {Array[string]} Lista de direcciones de correo electrónico a enviar
	 *	+ subject 	-> {string} Indica el título / asunto del correo electrónico
	 * @example
	 * var mailOptions = {
	 *  `from: "'Jhon Doe' <ejemplo@abc.com>",
	 * 	`to: ["janedoe@abc.com", "babydoe@xyz.com", "johnnydoe@google.com"],
	 * 	`subject: 'Mensaje de alerta para usuario'
	 * };
	 */
	send(mailOptions, body, isHtml, callback) {
		try {
			// Valida si existen los elementos minimos para el envio del correo
			if (!mailOptions.to || !mailOptions.subject) {
				// Retorna el error
				callback('Para el envio del correo deben existir al menos los datos: "to" y "subject".');
				return;
			}

			// Valida si el mensaje es texto plano o html
			if (isHtml) { mailOptions['html'] = body; }
			else { mailOptions['text'] = body; }

			// Valida el remitente
			mailOptions.from = (mailOptions.from) ? mailOptions.from : '"Plataforma Arca" <no-reply@ccss.sa.cr>';

			// send mail with defined transport object
			mail.sendMail(mailOptions, function (error, info) {
				// Valida si existe algún tipo de error
				if (error) {
					// Retorna el error
					callback(error);
					return;
				}
				// Retorna el mensaje de información sobre el envio
				callback(null, info.response);
				return;
			});
		}
		catch (error) {
			// Retorna el error
			callback(error);
			return;
		}
	}
};
