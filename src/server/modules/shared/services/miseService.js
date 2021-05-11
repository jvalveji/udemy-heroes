/* eslint-disable indent */
// Definición para el fichero miseService.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Servicio (middleware) encargado de gestionar las consultas a los servicios
//				restful del MISE
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

// Módulo para solicitudes http
const request = require('request');
// Obtiene las variables de configuración según entorno
const config = require('./../../../config/config')[process.env.NODE_ENV];
// Se incluye el servicio de utilidades
const utils = require('./utilidadesService');
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../interfaces/httpResponse');
// Se incluye el servicio de generación de JWT de la CCSS
const ccssJWT = require('./jsonWebTokenCCSSService');

// Se incluyen los modelos necesarios para mongoose
const usuarioModel = require('./../../admin/usuarios/main/models/usuariosModel');

// Variable para definir el tiempo TIMEOUT para MISE
const timeout = config.ws.timeout * 1000; // Milisegundos (1000 ms = 1 s)

/**
 * Función que se encarga de deshabilitar al usuario en la base de datos LOCAL
 * una vez que MISE lo bloqueó
 * @param _usuario {string} Indica el ombre del usuario
 * @param callback {object} Función callback que retorna el resultado
 */
let BloquearCuentaUsuarioLocal = function (_usuario, callback) {
	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	var _where = {
		usuario: _usuario
	};

	// Datos para actualizar
	var _set = {
		estado: false,
		logs: {
			modified: {
				fecha: utils.localDateToUTC(new Date()),
				usuario: 'arcasuper'
			}
		}
	};

	// Actualiza el estado del usuario
	usuarioModel.findOneAndUpdate(_where, _set, {}, function (err, numberAffected) {
		// SI todo anduvo bien continua a la función callback
		callback(null, true);
		return;
	});
};

/**
 * Módulo para gestionar el acceso y consumo de los servicios restful proporcionados por el MISE
 */
module.exports = {
	/**
	 * Método que realiza el proceso de inicial sesión en MISE
	 * @param params {any} Objeto que representa el conjunto de parámetros a enviar al servicio MISE
	 * @param usuario {string} Representa el nombre delusuario que esta ejecutando la acción
	 * @param callback {function} Función callback que recibe la respuesta
	 * @returns Retorna un objeto en formato JSON con los datos de inicio de sesión del usuario y 
	 * 			el token (JWT) generado para los servicios MISE
	 */
	login(params, usuario, callback) {
		// Solicita un token para MISE
		ccssJWT.get(null, function (error, token) {
			// Valida algún error de MISE
			if (error) {
				// Se valida si el error es por TIMEOUT
				if (error && error.code === 'ETIMEDOUT') {
					// Al ser problema de conexión se procede a retornar datos NULOS
					// de esta forma se le indica al que esta consumiendo que NO se puede 
					// obtener información de MISE por lo que "deberia optar por usar la información
					// de la base de datos local de MONGO"
					callback(null, null);
					return;
				}
				// Retorna el error específico
				callback(error);
				return;
			}

			try {
				// Se solicita el token a MISE (JWT)
				request({
					url: config.ws.mise.url + '/iniciarsesion?' + params,
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: token // Se agrega el RESPONSE anterior ya que contiene el token válido
					},
					timeout: timeout,
					json: true
				}, function (error, info) {
					// Valida si existe error
					if (error || (info.body.codigo && info.body.codigo !== 1)) {
						// Se valida si el error es por TIMEOUT
						if (error && error.code === 'ETIMEDOUT') {
							// Al ser problema de conexión se procede a retornar datos NULOS
							// de esta forma se le indica al que esta consumiendo que NO se puede 
							// obtener información de MISE por lo que "deberia optar por usar la información
							// de la base de datos local de MONGO"
							callback(null, null);
							return;
						}

						// Se define variable para retornar la respuesta
						let resp = null;
						// Variable que almacena los datos del error
						let dataError = null;
						// Numero Error				
						const numError = (error) ? 500 : info.body.codigo;
						// Se obtiene el mensaje de error generado por el MISE
						const msgError = (error) ? error.message : info.body.descripcion;

						// Se valida el código de error
						switch (numError) {
							case 401:
								// error: "No se permite invocar el servicio desde este cliente."
								// Token vencido / Token inválido
								if (error.indicadorTokenCaducado === 1) {
									dataError = { tokenMISECaducado: true };
								} else {
									dataError = { tokenMISEInvalido: true };
								}
								break;
							case 618:
								// error: "Datos de inicio de sesión incorrectos" (CREDENCIALES INVALIDAS)
								dataError = { credencialesInvalidas: true };
								break;
							case 619:
								if (info.body.indicadorCambioClave && info.body.indicadorCambioClave === 1) {
									// error: "Datos de inicio de sesión incorrectos" (CAMBIO CLAVE)
									dataError = { cambioClave: true };
								} else {
									// error: "La cuenta usuario ha caducado (contactar al Administrador)"
									dataError = { cuentaCaducada: true };
								}
								break;
							case 623:
								// error: "La cuenta usuario se encuentra deshabilitada"
								dataError = { cuentaDeshabilitada: true };
								break;
							case 624:
								// error: "La cuenta usuario se encuentra suspendida"
								dataError = { cuentaSuspendida: true };
								break;
							case 621 || 625:
								// error: "La cuenta usuario se encuentra bloqueada"
								dataError = { bloqueoCuenta: true };
								break;
							default:
								// Cualquier otro error
								dataError = null;
								break;
						}

						// Se establece un objeto de tipo HttpResponse indicando un error
						resp = new HttpResponse(false, 'MISE: ' + msgError, dataError);

						// Valida error de bloqueo de cuenta
						if (numError === 621 || numError === 625) {
							// Se debe actualizar el usuario de la base de datos local para
							// bloquearlo igual que MISE
							BloquearCuentaUsuarioLocal(usuario, function (err, _esBloqueado) {
								// SE DEBE RETORNAR EL MENSAJE INDICANDO EL ERROR CON LAS CREDENCIALES
								// (CUENTA BLOQUEADA POR INTENTO FALLIDOS)

								// En caso de que haya ocurrido un error en la actualización
								// se continua con el flujo normal y se obvia (esto deja al usuario local AUN HABILITADO)
								callback(resp);
								return;
							});
						} else {
							// SE DEBE RETORNAR EL MENSAJE INDICANDO EL ERROR
							callback(resp);
							return;
						}
					} else {
						// Si todo anduvo bien retorna los datos del RESPONSE
						callback(null, info.body);
						return;
					}
				});
			} catch (err) {
				// Retorna el error
				callback(err);
				return;
			}
		});
	},
	/**
	 * Método que solicita un servicio restful desde el MISE
	 * @param MISEService {enumMISE} Representa los datos del nombre del servicio MISE y el método HTTP
	 * @param params {any} Objeto que representa el conjunto de parámetros a enviar al servicio MISE
	 * 						(En caso de omitir este parámetro indicar NULO)
	 * @param data {any} Objeto que representa el conjunto de datos a enviar en el body
	 * 						(En caso de omitir este parámetro indicar NULO)
	 * @param callback {function} Función callback que recibe la respuesta
	 */
	execute(MISEService, params, data, callback) {
		// Solicita un token para MISE
		ccssJWT.get(null, function (error, token) {
			// Valida algún error de MISE
			if (error) {
				// Se valida si el error es por TIMEOUT
				if (error && error.code === 'ETIMEDOUT') {
					// Al ser problema de conexión se procede a retornar datos NULOS
					// de esta forma se le indica al que esta consumiendo que NO se puede 
					// obtener información de MISE por lo que "deberia optar por usar la información
					// de la base de datos local de MONGO"
					callback(null, null);
					return;
				}
				// Retorna el error específico
				callback(error);
				return;
			}

			try {
				// Se hace el llamado al servicio del MISE
				request({
					url: config.ws.mise.url + '/' + MISEService.name + ((params) ? '?' + params : ''),
					method: MISEService.method,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: token
					},
					timeout: timeout,
					json: true,
					data: (data) ? data : null
				}, function (error, info) {
					// Vlida si existe error
					if (error || (info.body.codigo && info.body.codigo !== 1)) {
						// Se valida si el error es por TIMEOUT
						if (error && error.code === 'ETIMEDOUT') {
							// Al ser problema de conexión se procede a retornar datos NULOS
							// de esta forma se le indica al que esta consumiendo que NO se puede 
							// obtener información de MISE por lo que "deberia optar por usar la información
							// de la base de datos local de MONGO"
							callback(null, null);
							return;
						}

						// Se obtiene el mensaje de error generado por el MISE
						const msgError = (error) ? error.message : info.body.descripcion;
						// SE DEBE RETORNAR EL MENSAJE INDICANDO EL ERROR
						callback(new HttpResponse(false, 'MISE: ' + msgError, null));
						return;
					}

					// Si todo anduvo bien retorna los datos del RESPONSE
					callback(null, info.body);
					return;
				});
			} catch (err) {
				// Retorna el error
				callback(err);
				return;
			}
		});
	}
};
