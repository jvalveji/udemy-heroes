// Definición para el fichero jsonWebTokenService.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Servicio (middleware) encargado de gestionar todo lo relacionado
//				a los tokens mediante el uso del módulo jsonWebToken
// Referencia: https://github.com/auth0/node-jsonwebtoken
// Modificación por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const fs = require('fs');
const jwt = require('jsonwebtoken');

// Obtiene las variables de configuración según entorno
const config = require('./../../../config/config')[process.env.NODE_ENV];

/**
 * Función encargada de obtener la llave (pública/privada) para generar el JWT
 * de la aplicación arca. Tambien dependera 
 * @param {string} tipo Indica el tipo de llave (private/public)
 * @returns Retorna la llave (pública/privada)
 */
let ObtenerLlaves = function (tipo) {
	// Valida el tipo de llave a obtener (pública o privada)
	if (tipo === 'private') return fs.readFileSync(config.sslRootPath.key);
	else return fs.readFileSync(config.sslRootPath.cert);
};

/**
 * Función que obtiene la cantidad de segundos según medida de tiempo indicada
 * @param {char} medida Indica la medida a obtener (m = Minutos / h = Horas / d = Días / a = Años)
 * @return Retorna la cantidad de segundos para el certificado basado en la medida indicada
 */
let ObtenerSegundosExpiracion = function (medida) {
	// Variable que almacena la cantidad de 
	var segundos = null;

	switch (medida) {
		case 'm':
			segundos = 60; // 1 minuto en segundos
			break;

		case 'h':
			segundos = 3600; // 1 hora en segundos
			break;

		case 'd':
			segundos = 86400; // 1 día en segundos
			break;

		case 'a':
			segundos = 31536000; // 1 año en segundos
			break;

		default:
			segundos = 60; // 1 minuto en segundos
			break;
	}
	// Retorna el resultado
	return segundos;
};

/**
 * Módulo para gestionar el manejo de las llaves JWT
 */
module.exports = {
	/**
	 * Función que genera el token
	 * @param {object} payload Datos para generar el token
	 * @param {object} options Indica las opciones para el token
	 * 
	 * Opciones :
	 * 		* medida: Indica la medida de tiempo (m = Minutos / h = Horas / d = Días / a = Años)
	 * 		* ttl: Valor númerico
	 * 
	 * @returns Retorna un nuevo token
	 */
	sign: (payload, options) => {
		// Opciones para generar el token
		var signOptions = {
			// issuer: options.issuer,
			// subject: options.subject,
			// audience: options.audience,
			expiresIn: ObtenerSegundosExpiracion(options.medida) * options.ttl,
			algorithm: 'RS256'
		};

		try {
			// Obtiene la llave privada
			const privateKEY = ObtenerLlaves('private');
			// Retorna la firma del token
			return jwt.sign(payload, privateKEY, signOptions);
		} catch (err) {
			throw err;
		}
	},
	/**
	 * Función que verifica un token
	 * @param {object} token Datos que representan el token
	 * @returns Retorna la verificación del token
	 */
	verify: (token) => {
		// Opciones para generar el token
		var verifyOptions = {
			// issuer: $Option.issuer,
			// subject: $Option.subject,
			// audience: $Option.audience,
			//bexpiresIn: ObtenerSegundosExpiracion(options.medida) * options.ttl,
			algorithm: ['RS256']
		};
		try {
			// Obtiene la llave publica
			const publicKEY = ObtenerLlaves('public');
			// Retorna la verificación del token
			return jwt.verify(token, publicKEY, verifyOptions);
		} catch (err) {
			throw err;
		}
	},
	/**
	 * Función que decodifica un token
	 * @param {object} token Datos que representan el token
	 * @returns Retorna el token decodificado
	 */
	decode: (token) => {
		// Retorna el token decodificado
		// En caso de ser inválido retorna null
		return jwt.decode(token, { complete: true });
	}
};