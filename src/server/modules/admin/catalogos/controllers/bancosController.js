// Definición para el fichero bancosController.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de bancos para interactuar la base de datos mongo.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Módelo de la estructura de bancos
const bancosModel = require('./../models/bancosModel');
// Módulo HttpResponse para el manejo de solicitudes HTTP y HTTPS
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');

/**
 * bancosController.js
 *
 * @description :: Server-side logica para el manejo  de los bancos.
 */
module.exports = {

	/**
	 * @name list()
	 * @description Método encargado de listar todos los bancos disponibles en la base de datos.
	 */
	list: function (req, res) {
		bancosModel.find(null, null, function (err, bancos) {
			if (err) {
				//Se returna la respuesta de error al obtener los bancos
				return res.status(500).json({
					message: 'Error al obtener los bancos.',
					error: err
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, 'Lista de bancos', bancos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @name listBancosHabilitados()
	 * @description Método encargado de listar todos los bancos habilitados en la base de datos.
	 */
	listBancosHabilitados: function (req, res) {
		const _where = {
			estado: true
		};
		bancosModel.find(_where, null, function (err, bancos) {
			if (err) {
				//Se returna la respuesta de error al obtener los bancos
				return res.status(500).json({
					message: 'Error al obtener los bancos.',
					error: err
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, 'Lista de bancos', bancos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @name show()
	 * @description Función encargada de obtener los datos de un banco por su id
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};
		// Busca la información del catalogo
		bancosModel.findOne(_where, function (err, bancos) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de bancos.',
					error: err
				});
			}
			if (!bancos) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo.'
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, bancos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},

	/**
	 * @name showByName()
	 * @description Función encargada de obtener los datos de un banco por su id
	 */
	showByName: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'nombreBanco': req.body.nombreBanco
		};
		// Busca la información del catalogo
		bancosModel.findOne(_where, function (err, bancos) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de bancos.',
					error: err
				});
			}
			if (!bancos) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo.'
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, bancos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @name update()
	 * @description Método encargado de actualizar un banco por su id.
	 */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.id
		};
		// Ejecuta una función de busqueda para obtener los datos por el filtro
		bancosModel.findOne(_where, function (err, data) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al buscar el registro a actualizar', null);
				return res.status(500).send(respuesta.getJSON());
			}
			//Se establece los valores que se van a actualizar segun el modelo del banco
			data.set({
				nombreBanco: req.body.nombreBanco,
				indicadorVenta: req.body.indicadorVenta,
				idicadorCompra: req.body.idicadorCompra,
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
					// devuelve la respuesta de error
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
	 * @name create()
	 * @description Método encargado de crear un nuevo registro.
	 */
	create: function (req, res) {
		// Se crea un nuevo objeto tipo schema mongodb
		var item = new bancosModel({
			nombreBanco: req.body.nombreBanco,
			indicadorVenta: req.body.indicadorVenta,
			indicadorCompra: req.body.indicadorCompra,
			estado: true,
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
				// devuelve la respuesta de error
				let respuesta = new HttpResponse(false, 'Error al guardar nuevo registro', null);
				return res.status(500).send(respuesta.getJSON());
			}
			let respuesta = new HttpResponse(true, 'Registro agregado con éxito', data);
			// devuelve la respuesta de exito
			return res.status(200).send(respuesta.getJSON());
		});
	}
};
