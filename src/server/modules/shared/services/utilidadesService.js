// Definición para el fichero utilidadesService.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Servicio (middleware) encargado de gestionar todas las funcionalidad utilitarias
//              para los servicios rest de la plataforma Arca - MEAN
// Importante: Cuando se requieran crear nuevas funcionalidades; deberán incluirse por ORDEN ALFABETICO ascendente
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

// Módulo para el manejo de fechas por zona horaria
const crypto = require('crypto'); // Módulo para el manejo de llaves de encryptación
const parseXMLJSON = require('xml2js').parseString; // Módulo de parseo de XML to JSON
const fs = require('fs');
const _ = require('underscore');
const moment = require('moment-timezone');
moment().tz('America/Costa_Rica').format();

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../interfaces/httpResponse');

// Importación del servicio para el manejo de tokens (JWT)
const tokenService = require('./jsonWebTokenService');

/**
 * Módulo para gestionar las funcionalidades utilitarias de la plataforma Arca - MEAN
 */
module.exports = {
	/**
	 * Método que permite capitalizar una cadena de texto
	 * @param cadena Representa la cadena de texto a capitalizar
	 * @returns Cadena de texto capitalizada
	 */
	capitalizeText(cadena) {
		// valida que exista un dato a capitalizar
		if (!cadena) { return null; }
		// retorna la capitalización de la cadena
		return cadena.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
			return a.toUpperCase();
		});
	},
	/**
   	* Método que retorna la diferencia entre 2 datos de tipo fecha
   	* @param major {Date} Representa la fecha mayor
   	* @param minor {Date} Representa la fecha menor
   	* @param format {String} Indica el formato de la respuesta:
   	*  * d = dias
   	*  * m = minutos
   	*  * s = segundos
   	* @returns Retorna un dato numérico con la diferencia indicada
   	*/
	diffDates(major, minor, format) {
		// Valida los datos ingresados
		if (major && minor && format) {
			// Convierte los datos tipo "Date" a tipo "Moment"
			const fechaMayor = moment(major);
			const fechaMenor = moment(minor);
			// Retorna la diferencia de fechas
			return fechaMayor.diff(fechaMenor, format);
		}
		// Si no cumple retorna nulo
		return null;
	},
	/**
	 * Método encargado de eliminar un directorio y/o su contenido de forma recursiva
	 * @param path {String} Indica la ubicación del directorio principal
	 * @param isDeleteDirectory {Boolean} Indica si elimina o no el directorio raíz
	 */
	directoryDeleteRecursive(path, isDeleteDirectory) {
		var files = [];
		// Valida si existe la ruta
		if (fs.existsSync(path)) {
			// Obtiene el contenido del directorio (archivos y directorios internos)
			files = fs.readdirSync(path);
			// Recorre la lista
			files.forEach(function (file, index) {
				var curPath = path + "/" + file;
				// Valida si es un directorio
				if (fs.statSync(curPath).isDirectory()) {
					// Al ser directorio ejecuta esta mismafunción recursivamente
					directoryDeleteRecursive(curPath, true);
				} else {
					// Elimina el archivo
					fs.unlinkSync(curPath);
				}
			});
			// Valida si hay que eliminar el directorio raíz
			if (isDeleteDirectory) fs.rmdirSync(path);
		}
	},
	/**
	 * Método que retorna el tamaño de un directorio
	 * @param path {String} Indica la ubicación del directorio
   	 * @param size {String} Indica la medida en que se quiere obtener el tamaño
	 * Los tipos de medidas admitidos son:
	 * 	* kilobytes -> KB, kb, Kb
	 * 	* megabytes -> MB, mb, Mb
	 * 	* gigabytes -> GB, gb, Gb
   	 * @returns Retorna un dato numérico con el tipo de medida indicada;
	 *  Por default si no se indica el tipo de medida se retorna en bytes
	 */
	directorySize(path, size) {
		/**
		 *	Obtiene todos los archivos del directorio
		 */
		function getFiles(dir) {
			dir = dir.replace(/\/$/, '');
			return _.flatten(fs.readdirSync(dir).map(function (file) {
				var fileOrDir = fs.statSync([dir, file].join('/'));
				if (fileOrDir.isFile()) {
					return (dir + '/' + file).replace(/^\.\/\/?/, '');
				} else if (fileOrDir.isDirectory()) {
					return getFiles([dir, file].join('/'));
				}
			}));
		}

		// Obtiene el contenido de los archivos y obtiene el tamaño en bytes
		var allFiles = getFiles(path).map(function (file) {
			return fs.readFileSync(file);
		}).join('\n').length;

		/**
		 * Convierte el valor dado en bytes en su equivalente mayor (kb, mg, gb)
		 */
		function getSize(value) {
			// Valida si el resultado es en kilobytes
			if (size.search(/kb/ig) >= 0) { return parseFloat(value) / 1024; }
			// Valida si el resultado es en kilobytes
			if (size.search(/mb/ig) >= 0) { return (parseFloat(value) / 1024) / 1024; }
			// Valida si el resultado es en kilobytes
			if (size.search(/gb/ig) >= 0) { return ((parseFloat(value) / 1024) / 1024) / 1024; }
			// Si no se indica lo retorna en bytes
			return value;
		}

		// Retorna el dato
		return getSize(allFiles.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,'));
	},
	/**
	 * @description Método encargado de generar una llave SHA de 256 y en base 64
	 * @param {any} datos Datos que se encriptaran con el hash
	 * @returns Hash generado a partir de los datos enviados
	 */
	generateSHA256(datos) {
		return crypto.createHash('sha256').update(datos).digest('base64');
	},
	/**
	 * @description Método encargado de obtener la ip del host que realiza una petición al servidor
	 * @param {any} request request del cliente
	 * @returns Retorna la dirección ip del host
	 */
	ipHostClient(request) {
		let ipHost = request.headers['x-forwarded-for'] ||
			request.connection.remoteAddress ||
			request.socket.remoteAddress ||
			request.connection.socket.remoteAddress;
		ipHost = ipHost.split(',')[0];
		ipHost = ipHost.split(':').slice(-1)[0]; //en caso de que la ip retornada sea del formato: "::ffff:146.xxx.xxx.xxx"
		// Retorna la IP
		return ipHost;
	},
	/**
 	* @description Método encargado de validar si una dirección de correo electrónico es válida
 	* @param email {string} Representa la dirección de correo electrónico
 	* @returns Retorna indicador de éxito (verdadero/falso)
 	*/
	isEmail(email) {
		const re = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
		return re.test(email);
	},
	/**
	 * @description Método encargado de validar si valor determinado es un objeto JSON (Un objeto JSON SIEMPRE es un OBJETO)
 	* @param value {any} Representa el valor a evaluar
 	* @returns Retorna indicador de éxito (verdadero/falso)
 	*/
	isJSON(value) {
		try {
			JSON.parse(value);
			return true;
		}
		catch (error) {
			return false;
		}
	},
	/**
	 * @description Método encargado de validar si un número teléfonico es válido
	 * @param phone {string} Representa el número teléfonico
	 * @returns Retorna indicador de éxito (verdadero/falso)
	 */
	isPhoneNumber(phone) {
		const re = new RegExp('^[0-9]{8}$'); // formato -> 12345678
		return re.test(phone);
	},
	/**
	 * Método encargado de convertir una cadena de texto (con formato JSON) a
	 * un objeto de tipo JSON
	 * @param str Cadena de texto (en formato JSON)
	 * @returns Retorna un objeto de tipo json; en caso contrario retorna nulo
	 */
	jsonize(str) {
		try {
			if (typeof str === 'string' || str instanceof String) {
				return JSON.parse(str
					// wrap keys without quote with valid double quote
					.replace(/([$\w]+)\s*:/g, function (_, $1) {
						return '"' + $1 + '":';
					})
					// replacing single quote wrapped ones to double quote
					.replace(/'([^']+)'/g, function (_, $1) {
						return '"' + $1 + '"';
					}));
			} else {
				if (str !== undefined && (str.constructor == Array || str.constructor == Object)) {
					return str;
				} else {
					return null;
				}
			}
		} catch (error) {
			return null;
		}
	},
	/**
	 * @description Método encargado de convertir una fecha local a su UTC (-6H)
	 * @param {Date} fecha Parámetro que representa una fecha
	 * @returns Retorna la fecha dada en formato UTC
	 */
	localDateToUTC(fecha) {
		// Valida si el dato es una fecha
		if (fecha instanceof Date) {
			// retorna el valor en formato de fecha local (-6 horas para Costa Rica)
			return moment(fecha).add(-6, 'h').toDate();
		}
		// Si no es fecha retorna nulo
		return null;
	},
	/**
	 * Método que permite convertir una cadena en formato XML a JSON
	 * @param {*} xml Cadena que representa un objeto en formato XML
	 * @param {*} callback Función de retorno con los datos solicitados
	 * @returns Retorna un objeto tipo JSON
	 */
	parseXMLtoJSON(xml, callback) {
		// Se ejecutar la función que pasea el dato
		parseXMLJSON(xml, function (error, result) {
			if (error) {
				//  Envia el error como respuesta
				return callback(error);
			}
			// retorna el resultado a la función callback
			return callback(null, result);
		});
	},
	/**
	 * Método que permite generar una contraseña aleatoria
	 * @param size {number} Tamaño de la contraseña a generar
	 * @returns Retorna una cadena que contiene la contraseña
	 */
	passwordGenerator(size) {
		var passwd = '';
		const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		for (let i = 0; i < size; i++) {
			var c = Math.floor(Math.random() * chars.length + 1);
			passwd += chars.charAt(c);
		}

		return passwd;
	},
	/**
	 * @description Método encargado de convertir una fecha UTC a la fecha local (+6H)
	 * @param {Date} fecha Parámetro que representa una fecha
	 * @returns Retorna la fecha dada en formato Local
	 */
	utcToLocalDate(fecha) {
		// Valida si el dato es una fecha
		if (fecha instanceof Date) {
			// retorna el valor en formato de fecha local (-6 horas para Costa Rica)
			return moment(fecha).add(6, 'h').toDate();
		}
		// Si no es fecha retorna nulo
		return null;
	},
	/**
	 * @description Método encargado de indicar si un token de tipo JWT es válido 
	 * @param {any} token Token de tipo JWT para validar
	 * @param {function} callback Función callback que recibe la respuesta
	 */
	validateToken(token, callback) {
		// Se importa el controlador de los parámetros
		const parametrosController = require('./../../admin/parametros/controllers/parametrosController');
		// Se obtiene la cantidad de minutos establecidos como limite para renovar un token
		parametrosController.getByGlobalNombre('limiteRenovacionJWT', function (param) {
			// Valida si el valor del parametro esta establecido;
			// por default el valor sera de 30 minutos en caso de que sea nulo el valor retornado
			const LIMITE = (param) ? parseInt(param.valor, 10) : 30;
			// Variable que indica los minutos transcurridos desde el momento en el que se genero el token hasta el actual
			let MINUTOS = 0;

			// Se intenta decodificar el token
			let tokenDecodificado = tokenService.decode(token, { complete: true });

			// Se verifica si el token NO se pudo decodificar
			if (!tokenDecodificado) {
				// Se establece la respuesta con el error (401 = Unauthorized)
				callback(new HttpResponse(false, 'El token de seguridad indicado es inválido.', {
					_status: 401
				}));
				return;
			}

			try {
				// Se verifica el token
				tokenService.verify(token);
				// Se establece la respuesta que todo bien
				callback(new HttpResponse(true, null, tokenDecodificado));
				return;
			}
			catch (err) {
				// Se declara una variable que contendra el mensaje a mostrar y una variable de estado
				let mensaje = null;
				let status = null;

				// Se validan los posibles errores
				switch (err.name) {
					// Token inválido
					case 'JsonWebTokenError':
						mensaje = 'El token de seguridad indicado es inválido.';
						status = 401; // 401 = Unauthorized
						break;
					// Token expirado
					case 'TokenExpiredError':
						mensaje = 'Su tiempo ha expirado.';
						// Si el token es vencido el objeto devuelto incluye una propiedad timestamp o se utiliza la que genera el error
						const _timestamp = (tokenDecodificado.timestamp) ? tokenDecodificado.timestamp : err.expiredAt;
						// Obtiene los minutos transcurridos entre la fecha que se genero el token y la hora actual del servidor
						MINUTOS = moment(new Date()).diff(new Date(_timestamp), 'minutes');

						// Se valida si el tiempo expirado ha excedido o no el limite establecido para renovación de tokens
						// * 403 = Forbidden (para los casos en que el token ya caduco y que el tiempo haya superado el limite de renovación)
						// * 408 = Request Timeout (para los casos en que el token ya caduco y que el tiempo esta por debajo del limite de renovación)
						status = (MINUTOS > LIMITE) ? 403 : 408;
						break;
				}
				// Se establece la respuesta con el error (403 = Forbidden / 408 = Request Timeout)
				callback(new HttpResponse(false, mensaje, {
					_status: status,
					_decoded: tokenDecodificado
				}));
				return;
			}
		});
	}
};
