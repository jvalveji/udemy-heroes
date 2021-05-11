/* eslint-disable indent */
// Definición para el fichero jsonWebTokenCCSSService.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Servicio (middleware) encargado de gestionar llaves de tipo Json Web Token (JWT) con el
//				servicio restfiul provisto por la DTIC (CCSS).
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Módulo para solicitudes http
const request = require('request');
// Obtiene las variables de configuración según entorno
const config = require('./../../../config/config')[process.env.NODE_ENV];
const async = require('async'); // Módulo async para manejo solicitudes asincronas
const ip = require('ip');
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../interfaces/httpResponse');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../services/utilidadesService');

// Se incluyen los modelos necesarios para mongoose
const parametrosModel = require('./../../admin/parametros/models/parametrosModel');

// Variable para definir el tiempo TIMEOUT para MISE
const timeout = config.ws.timeout * 1000; // Milisegundos (1000 ms = 1 s)

/**
 * Función que obtiene el parámetro que almacena el token generado por el JWT de la CCSS
 * @param {object} callback Función callback que retorna el resultado
 * @returns Retorna el token (JWT) almacenado en la base de datos
 */
let ObtenerTokenCCSSBaseDatos = function (callback) {
	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _where = {
		nombre: 'tokenCCSS',
		estado: true
	};

	// Se busca la info del parámetro
	parametrosModel.findOne(_where, function (err, parametro) {
		// Se valida si hubo un error
		if (err) {
			// Retorna NULO para indicar que NO hay token
			callback(null, null);
			return;
		}

		// Retorna el dato del parámetro
		callback(null, parametro ? parametro.valor : parametro);
		return;
	});
};


/**
 * Función que guarda el parámetro que almacena el token en la base de datos
 * @param token {string} Token JWT
 * @param callback {object} Función callback que retorna el resultado
 */
let GuardarTokenCCSSBaseDatos = function (token, callback) {
	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _where = {
		nombre: 'tokenCCSS',
		estado: true
	};

	// Variable con los datos a guardar
	const _set = {
		$set: {
			valor: token,
			logs: {
				modified: {
					fecha: utils.localDateToUTC(new Date()),
					usuario: 'arcasuper'
				}
			}
		}
	};

	// Se busca la info del parámetro
	parametrosModel.findOneAndUpdate(_where, _set, { upsert: true }, function (err) {
		// Se valida si hubo un error
		if (err) {
			// retorna el error
			callback(err);
			return;
		}

		// Retorna el dato del parámetro
		callback(null, true);
		return;
	});
};

/**
 * Método que se encarga de validar el JWT con los servicios rest de la CCSS
 * @param token {string} Token JWT a validar
 * @param callback {function} Función callback que recibe la respuesta
 * @returns Retorna indicador verdadero/falso
 */
let ValidarTokenCCSS = function (token, callback) {
	try {
		// Se solicita el token (JWT)
		request({
			url: config.ws.tokens.url + '/tokenesvalido?modulo=MISE&estacionTrabajo=' + ip.address() + '&token=' + token,
			method: 'GET',
			timeout: timeout
		}, function (error, validacion) {
			// Se validan los posibles errores
			if (error || validacion.statusCode !== 200) {
				// Retorna el error
				callback(error ? error : new HttpResponse(false, validacion.body, null));
				return;
			}

			// Se parsea a JSON la respuesta contenida en el body
			const jsonResp = JSON.parse(validacion.body);
			// Si todo anduvo bien retorna el indicador
			callback(null, jsonResp.tokenValido);
			return;
		});
	} catch (err) {
		// Retorna el error
		callback(err);
		return;
	}
};

/**
 * Método que se encarga de solicitar el JWT a los servicios rest de la CCSS
 * @param data {JSON} Datos a "encapsular" en el JWT
 * @param callback {function} Función callback que recibe la respuesta
 * @returns Retorna el token (JWT) generado para los servicios de la CCSS
 */
let SolicitarTokenCCSS = function (data, callback) {
	try {
		// Se verifica si existen parametros para la consulta
		const params = (data) ? '&contenido=' + Buffer.alloc(data.length, data).toString('base64') : '';

		// Se solicita el token (JWT)
		request({
			url: config.ws.tokens.url + '/token?codigoSistema=ARCA' + params,
			method: 'GET',
			auth: { user: config.ws.tokens.user, pass: config.ws.tokens.pass },
			timeout: timeout
		}, function (error, token) {
			if (error) {
				// Retorna el error
				callback(error);
				return;
			}

			// Si todo anduvo bien, guarda el nuevo token en la base de datos
			GuardarTokenCCSSBaseDatos(token.body, function (error2, result) {
				// if (error2) {
				// 	// Retorna el error
				// 	callback(error2);
				// 	return;
				// }
				// Retorna los datos del token
				callback(null, token.body);
				return;
			});
		});
	} catch (err) {
		// Retorna el error
		callback(err);
		return;
	}
};

/**
 * Módulo para gestionar llaves JWT dadas por el servicio rest de la DTIC (CCSS)
 */
module.exports = {
	/**
	 * Método que se encarga de obtener un JWT
	 * @param data {JSON} Datos a "encapsular" en el JWT. Tiene una longitud máx. de 150 caracteres.
	 * @param callback {function} Función callback que recibe la respuesta
	 * @returns Retorna el token (JWT) generado para los servicios de la CCSS
	 */
	get(data, callback) {
		// Se realiza la ejecución de las funciones asincronas de forma sincrona
		// (IMPORTANTE: El primer parámetro que se envia a las funciones callback cuando es nulo indica un ERROR)
		async.waterfall([
			// PASO 1 -> Obtener el token de la base de datos (si existiese)
			function (callback) {
				ObtenerTokenCCSSBaseDatos(callback);
			},
			// PASO 2 -> Validar el token (si existiese)
			function (token, callback) {
				// Se valida si el token existe
				if (token) {
					ValidarTokenCCSS(token, function (error, esValido) {
						if (error) {
							callback(error);
							return;
						}

						// Valida si el token es correcto
						if (esValido) {
							// Si el token es válido lo retorna
							callback(null, token);
							return;
						}
						else {
							// Si el token es inválido se solicita uno nuevo
							SolicitarTokenCCSS(data, callback);
						}
					});
				} else {
					// Como no existe genera un nuevo token 
					SolicitarTokenCCSS(data, callback);
				}
			}], function (error, success) {
				if (error) {
					// Retorna el error
					callback(error);
					return;
				}

				// Si todo anduvo bien retorna los datos del token
				callback(null, success);
				return;
			});
	}
};
