// Definición para el fichero broadcastController.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de BROADCAST para interactuar la base de datos mongo.
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const broadcastModel = require('./../models/broadcastModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');

/**
 * broadcastController.js
 *
 * @description :: Server-side logic for managing broadcasts.
 */
module.exports = {
	/**
	 * broadcastController.list()
	 */
	list: function (req, res) {
		broadcastModel.find(function (err, broadcasts) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting broadcast.',
					error: err
				});
			}
			return res.json(broadcasts);
		});
	},
	/**
	 * broadcastController.listByAplicacion()
	 * Función que se encagar de mostrar los mensajes por aplicación
	 * para el mantenimiento de mensajes tipo broadcast
	 */
	listByAplicacion: function (req, res) {
		// Obtiene el id de la aplicacion
		var idApp = req.params.idApp;
		broadcastModel.find({
			aplicacion_id: idApp
		}, function (err, broadcast) {
			if (err) {
				return res.status(500).json({
					message: 'Error obteniendo la lista de mensajes.',
					error: err
				});
			}
			if (!broadcast) {
				return res.status(404).json({
					message: 'No such broadcast'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			// Si no existen unidades programáticas asociadas se envia un arreglo vacio de datos
			const respuesta = new HttpResponse(true, null, broadcast);
			// Se obtiene el JSON del mensaje y se envia (201 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({
			'logs.created.fecha': 'desc'
		});
	},
	/**
	 * broadcastController.showByEstadoActivo()
	 * Función que se encarga de mostrar los mensajes por aplicación
	 * y que se encuentren en estado activo; esto para mostrarlos en 
	 * el área de notificaciones o el chat
	 */
	showByEstadoActivo: function (req, res) {
		// Fecha actual del server
		const today = new Date();

		// Obtiene el id de la aplicacion
		var idApp = req.params.idApp;
		broadcastModel.find({
			aplicacion_id: idApp,
			estado: true,
			fechaInicio: {
				'$lt': utils.localDateToUTC(today)
			},
			fechaFinal: {
				'$gte': utils.localDateToUTC(today)
			}
		}, function (err, broadcast) {
			if (err) {
				return res.status(500).json({
					message: 'Error obteniendo la lista de mensajes.',
					error: err
				});
			}
			if (!broadcast) {
				return res.status(404).json({
					message: 'No such broadcast'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			// Si no existen unidades programáticas asociadas se envia un arreglo vacio de datos
			const respuesta = new HttpResponse(true, null, broadcast);
			// Se obtiene el JSON del mensaje y se envia (201 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({
			'logs.created.fecha': 'desc'
		});
	},
	/**
	 * broadcastController.create()
	 * Función encargada de guardar el dato del mensaje broadcast
	 */
	create: function (req, res) {
		// Asiganción d elos valores al modelo
		var broadcast = new broadcastModel({
			aplicacion_id: req.params.id,
			mensaje: req.body.mensaje,
			color: req.body.color,
			fechaInicio: utils.localDateToUTC(new Date(req.body.fechaInicio)),
			fechaFinal: utils.localDateToUTC(new Date(req.body.fechaFinal)),
			estado: true,
			enviado: false,
			logs: {
				created: {
					usuario_id: req.userArcaRequest.user._id,
					usuario: req.userArcaRequest.user.usuario,
					nombre: req.userArcaRequest.user.nombre
				}
			}
		});

		broadcast.save(function (err, data) {
			if (err) {
				return res.status(500).json({
					message: 'Error creando el mensaje.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			// Si no existen unidades programáticas asociadas se envia un arreglo vacio de datos
			const respuesta = new HttpResponse(true, 'Los datos se registraron de forma satisfactoria.', data);
			// Se obtiene el JSON del mensaje y se envia (201 = OK)
			return res.status(201).send(respuesta.getJSON());
		});
	},
	/**
	 * broadcastController.update()
	 */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};

		broadcastModel.findOne(_where, function (err, broadcast) {
			if (err) {
				return res.status(500).json({
					message: 'Error buscando los datos de los item.',
					error: err
				});
			}

			broadcast.set({
				mensaje: req.body.mensaje,
				color: req.body.color,
				dia: req.body.dia,
				hora: req.body.hora,
				permanencia: req.body.permanencia,
				enviado: req.body.enviado
			});

			broadcast.save(function (err, broadcast) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating broadcast.',
						error: err
					});
				}

				return res.json(broadcast);
			});
		});
	},
	/**
	 * broadcastController.remove()
	 */
	remove: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};

		broadcastModel.findByIdAndRemove(_where, function (err) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al buscar el registro a actualizar', null);
				return res.status(500).send(respuesta.getJSON());
			}

			let respuesta = new HttpResponse(true, 'Registro actualizado con éxito', null);
			// devuelve la respuesta de exito
			return res.status(200).send(respuesta.getJSON());
		});
	}
};
