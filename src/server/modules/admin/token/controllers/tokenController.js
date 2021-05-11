// Definición para el fichero tokenController.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con definiciones de funciones par el módulo de TOKEN
// Modificado por:

const HttpResponse = require('./../../../shared/interfaces/httpResponse'); // Modelo para el manejo de la respuesta HTTP genérica
const utils = require('./../../../shared/services/utilidadesService'); // Se incluye el fichero de funciones utilitarias
// Importación del servicio para el manejo de tokens (JWT)
const tokenService = require('./../../../shared/services/jsonWebTokenService');
// Se agrega el controlador de unidades programáticas
const unidadesProgramaticas = require('./../../catalogos/controllers/unidadesProgramaticasController');

/**
 * Función encargada de generar el token
 * @param {*} res Función response
 * @param {*} payload Datos para el token
 * @param {*} config Configuración para el token
 */
let GenerarToken = function (res, payload, config) {
	try {
		// Genera el token
		const _token = tokenService.sign(payload, config);
		// Se instancia el objeto para la respuesta http
		const hr = new HttpResponse(true, 'Token generado por el sistema Arca.', _token);
		// Se obtiene el JSON del mensaje y se envia
		res.send(hr.getJSON());
	} catch (err) {
		// Se crea un mensaje para responder la validación
		const resp = new HttpResponse(false, 'Se produjo un error tratando de generar el token.', null);
		// Se retorna el mensaje de respuesta
		return res.status(500).send(resp.getJSON());
	}
};

/**
 * tokenController.js
 *
 * @description :: Server-side logic for managing utilidades.
 */

module.exports = {
	/**
	 * @description Retorna un token generado
	 */
	create: function (req, res) {
		// Variable que almacena los datos a tokenizar
		let payload = {};

		// Válida la existencia de datos
		const config = {
			ttl: req.params.ttl ? req.params.ttl : 60, // Se indica default 60 minutos
			medida: req.params.medida ? req.params.medida : 'm' // m = Minutos / h = Horas / d = Días / a = Años
		};

		// Trata de convertir la data enviada en el body de la petición (en caso contrario es nulo)
		payload = utils.jsonize(req.body.payload);

		// Para hacer uso por parte de TERCEROS de las funcionalidades de la plataforma Arca - MEAN
		// debe de existir en el payload AL MENOS la propiedad con el id mongo de la unidad programática: payload.up._id
		// Por tanto; si no existe se establece de forma DEFAULT mediante la propiedad idUP
		if (!payload || !payload.up || (!payload.up.idUP && !payload.up._id)) {
			// Se crea un mensaje para responder la validación
			const resp = new HttpResponse(false, 'No se puede generar el token ya que no sumnistro el identificador de la unidad programática (idUP).', null);
			// Se retorna el mensaje de respuesta
			return res.status(200).send(resp.getJSON());
		}

		// Valida si NO existe el id mongo de la unidad programática
		if (!payload.up._id) {
			// Como NO existe se establece de forma AUTOMATICA
			unidadesProgramaticas.showByIdUP(payload.up.idUP, function (error, _up) {
				if (error) {
					// Se crea un mensaje para responder la validación
					const resp = new HttpResponse(false, 'Se produjo un error tratando de generar el token.', null);
					// Se retorna el mensaje de respuesta
					return res.status(500).send(resp.getJSON());
				}

				// Valida que el criterio de búsqueda retornara un resultado
				if (!_up) {
					// Se crea un mensaje para responder la validación
					const resp = new HttpResponse(false, 'El identificador de la unidad programática no coincide (idUP).', null);
					// Se retorna el mensaje de respuesta
					return res.status(200).send(resp.getJSON());
				}
				// Se establecen los datos del id mongo de la unidad programática
				payload.up._id = _up._id;
				// Genera el token
				GenerarToken(res, payload, config);
			});
		}
		else {
			// Genera el token
			GenerarToken(res, payload, config);
		}
	},
	/**
	 * Función encargada de decodificar un token emitido por el servicio rest de login
	 * para las aplicaciones arca
	 */
	decodeAuthArcaToken: function (req, res) {
		try {
			// Genera el token
			const _token = tokenService.decode(req.body.token);
			// Se instancia el objeto para la respuesta http
			const hr = new HttpResponse(true, 'Token decodificado por el sistema Arca.', {
				'arca-key': _token.payload.token,
				'arca-user': _token.payload.usuario
			});
			// Se obtiene el JSON del mensaje y se envia
			res.send(hr.getJSON());
		} catch (err) {
			// Se crea un mensaje para responder la validación
			const resp = new HttpResponse(false, 'Se produjo un error tratando de decodificar el token.', null);
			// Se retorna el mensaje de respuesta
			return res.status(500).send(resp.getJSON());
		}
	}
};
