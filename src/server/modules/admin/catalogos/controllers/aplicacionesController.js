// Definición JavaScript para el controlador catálogo aplicaciones v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jimenez <apicadoj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const aplicacionesModel = require('./../models/aplicacionesArcaModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');

/*
 * aplicacionesController.js
 * @description :: Server-side logic for managing aplicaciones-arca.
 */
module.exports = {
	/**
	 * @description Función encargada de obtener el catálogo de
	 * aplicaciones disponibles en el arca
	 */
	list: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};

		// Busca la información del catalogo
		aplicacionesModel.find(_where, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de aplicaciones-arca.',
					error: err
				});
			}
			if (!catalogo) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, catalogo);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @description Función encargada de obtener los datos de una aplicación arca por su id
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};

		// Busca la información del catalogo
		aplicacionesModel.findOne(_where, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de aplicaciones-arca.',
					error: err
				});
			}
			if (!catalogo) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, catalogo);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @description Función encargada de obtener los datos de una aplicación arca por nombre
	 */
	showByNombre: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'idApp': req.params.idApp
		};

		// Busca la información del catalogo
		aplicacionesModel.findOne(_where, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de aplicaciones-arca.',
					error: err
				});
			}
			if (!catalogo) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, catalogo);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * catalogosController.create()
	 * @description Método encargado de crear las aplicaciones arca
	 */
	create: function (req, res) {
		// Inicializa el objeto y establece los datos
		var app = new aplicacionesModel({
			idApp: req.body.idApp,
			nombre: req.body.nombre,
			descripcion: req.body.descripcion,
			estado: req.body.estado,
			logs: {
				created: {
					usuario_id: req.userArcaRequest.user._id,
					usuario: req.userArcaRequest.user.usuario,
					nombre: req.userArcaRequest.user.nombre
				}
			}
		});

		// Guarda el objeto nuevo
		app.save(function (err, data) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al guardar el registro actualizado', null);
				return res.status(500).send(respuesta.getJSON());
			}

			let respuesta = new HttpResponse(true, 'Registro actualizado con éxito', data);
			// devuelve la respuesta de exito
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * catalogosController.update()
	 * @description Método encargado de actualizar las aplicaciones arca
	 */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};

		aplicacionesModel.findOne(_where, function (err, data) {
			if (err) {
				return res.status(500).json({
					message: 'Error buscando los datos de los item.',
					error: err
				});
			}

			data.set({
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				estado: req.body.estado,
				logs: {
					modified: {
						fecha: utils.localDateToUTC(new Date()),
						usuario_id: req.userArcaRequest.user._id,
						usuario: req.userArcaRequest.user.usuario,
						nombre: req.userArcaRequest.user.nombre
					}
				}
			});

			data.save(function (err, data) {
				if (err) {
					let respuesta = new HttpResponse(false, 'Error al guardar el registro actualizado', null);
					return res.status(500).send(respuesta.getJSON());
				}

				let respuesta = new HttpResponse(true, 'Registro actualizado con éxito', data);
				// devuelve la respuesta de exito
				return res.status(200).send(respuesta.getJSON());
			});
		});
	}
};
