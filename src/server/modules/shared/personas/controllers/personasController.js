// Definición para el fichero personasController.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de PERSONAS para interactuar la base de datos mongo.
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluyen módulos a utilizar
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const personasModel = require('./../models/personasModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../services/utilidadesService');

/**
 * personasController.js
 *
 * @description :: Lógica del lado del servidor con las funcionalidades necesarias para el modelo de las personas.
 */
module.exports = {

	/**
	 * Método encargado de listar las personas del Padrón Nacional según el filtro (identificación o nombre)
	 */
	showByFilter: (req, res) => {
		// Variable búsqueda con condición
		let _where = {};
		// Variable que contiene el objeto de filtro
		let filtro = req.params.filtro;
		// Condición que verifica si el filtro es de tipo numérico o no (si es una identificación o nombre de la persona)
		if (!Number.isNaN(parseInt(filtro, 10))) {
			// Propiedad que contiene las condiciones necesarias para realizar el filtro por la identificación.
			_where = {
				'identificacion': filtro
			};
			// Se realiza la funcionalidad de búsqueda para proceder con la búsqueda por la identificación.
			personasModel.find(_where).sort({
				nombre: -1
			}).exec((err, personas) => {
				// Condición que verifica si hubo algún error después de haber filtrado.
				if (err) {
					// Se crea un objeto respuesta y los datos se encapsulan en este
					const respuesta = new HttpResponse(
						false,
						'Error al obtener la información de las personas filtradas.',
						null
					);
					// Se obtiene el JSON del mensaje y se envia (50'Error de al desactivar la orden de compra'0 = Internal Server Error)
					return res.status(500).send(respuesta.getJSON());
				}
				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, personas);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
		} else {
			// Ejecuta una función de agregación para obtener los datos por el filtro
			personasModel.aggregate([{
				$project: {
					_id: 1,
					identificacion: 1,
					'tipoIdentificacion_id._id': 1,
					'tipoIdentificacion_id.descripcion': 1,
					nombre: 1,
					apellido1: 1,
					apellido2: 1,
					fechaNacimiento: 1,
					'genero_id._id': 1,
					'genero_id.descripcion': 1,
					esUsuarioArca: 1,
					'fullname': {
						$concat: ['$apellido1', ' ', '$apellido2', ' ', '$nombre']
					}
				}
			},
			{
				$match: {
					'fullname': {
						$regex: filtro,
						$options: 'gi' // i=case-insensitive / g= equivale a un % como en SQL
					}
				}
			}
			]).exec(function (err, personas) {
				if (err) {
					// Se crea un objeto respuesta y los datos se encapsulan en este
					const respuesta = new HttpResponse(
						false,
						'Error al obtener las información de las personas filtradas.',
						null
					);
					// Se obtiene el JSON del mensaje y se envia (50'Error de al desactivar la orden de compra'0 = Internal Server Error)
					return res.status(500).send(respuesta.getJSON());
				}
				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, personas);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
		}
	},
	/**
	 * Método encargado de listar las personas del Padrón Nacional según el filtro (identificación o nombre)
	 */
	showByFallecidosFilter: (req, res) => {
		// Se obtiene los parámetros de las fechas desde y hasta en formato DDMMYYYY
		var desde = req.params.desde;
		var hasta = req.params.hasta;

		// Propiedad que contiene las condiciones necesarias para realizar el filtro por la identificación.
		let _where = {
			'esFallecido': true,
			'$and': [{
				'$or': [{
					'$and': [{
						'logs.modified.fecha': {
							'$exists': false
						}
					},
					{
						'logs.created.fecha': {
							'$gte': utils.localDateToUTC(new Date(desde.substring(4, 8), parseInt(desde.substring(2, 4), 10) - 1, desde.substring(0, 2)))
						}
					},
					{
						'logs.created.fecha': {
							'$lt': utils.localDateToUTC(new Date(hasta.substring(4, 8), parseInt(hasta.substring(2, 4), 10) - 1, hasta.substring(0, 2), 23, 59))
						}
					}
					]
				},
				{
					'$or': [{
						'$and': [{
							'logs.modified.fecha': {
								'$gte': utils.localDateToUTC(new Date(desde.substring(4, 8), parseInt(desde.substring(2, 4), 10) - 1, desde.substring(0, 2)))
							}
						},
						{
							'logs.modified.fecha': {
								'$lt': utils.localDateToUTC(new Date(hasta.substring(4, 8), parseInt(hasta.substring(2, 4), 10) - 1, hasta.substring(0, 2), 23, 59))
							}
						}
						]
					}]
				}
				]
			}]
		};

		// Se realiza la funcionalidad de búsqueda para proceder con la búsqueda por la identificación.
		personasModel.find(_where).sort({
			identificacion: 1
		}).exec((err, personas) => {
			// Condición que verifica si hubo algún error después de haber filtrado.
			if (err) {
				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(
					false,
					'Error al obtener la información de las personas filtradas.',
					null
				);
				// Se obtiene el JSON del mensaje y se envia (50'Error de al desactivar la orden de compra'0 = Internal Server Error)
				return res.status(500).send(respuesta.getJSON());
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, personas);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	}
};
