// Definición JavaScript para el controlador catálogo mes v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr> (24-04-2019)
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const catalogoModel = require('./../models/mesModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');

/**
 * mesController.js
 *
 * @description :: Server-side logic for managing catalogos.
 */
module.exports = {

	/**
	 * @description Función encargada de obtener el catálogo de
	 * tipos de identificación
	 */
	list: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};
		// Busca la información del catalogo
		catalogoModel.find(_where, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de meses.',
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
		}).sort({
			'idMes': 1
		});
	},

	/**
	 * @description Función encargada de obtener los datos de un tipo de identificación por su id
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};
		// Busca la información del catalogo
		catalogoModel.findOne(_where, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de meses.',
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
		}).sort({
			'idMes': 1
		});
	},

	/**
	 * catalogosController.update()
	 * @description Método encargado de actualizar/crear.
	 */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.id
		};
		catalogoModel.findOne(_where, function (err, data) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al buscar el registro a actualizar', null);
				return res.status(500).send(respuesta.getJSON());
			}
			data.set({
				idMes: req.body.idMes,
				descripcion: req.body.descripcion,
				estado: req.body.estado,
				'logs.modified': {
					fecha: utils.localDateToUTC(new Date()),
					usuario_id: req.userArcaRequest.user._id,
					usuario: req.userArcaRequest.user.usuario,
					nombre: req.userArcaRequest.user.nombre
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
	},

	/**
	 * catalogosController.create()
	 * @description Método encargado de crear un nuevo registro.
	 */
	create: function (req, res) {
		// Se crea un nuevo objeto tipo schema mongodb
		var item = new catalogoModel({
			idMes: req.body.idMes,
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
		item.save(function (err, data) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al guardar nuevo registro', null);
				return res.status(500).send(respuesta.getJSON());
			}
			let respuesta = new HttpResponse(true, 'Registro agregado con éxito', data);
			// devuelve la respuesta de exito
			return res.status(200).send(respuesta.getJSON());
		});
	},
};
