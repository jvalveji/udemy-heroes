// Definición JavaScript para el controlador catálogo Tipos de Partidad Presupuestaria v1.0.0
// Proyecto: Arca - Nutrición
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr> (26-05-2020)
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// se incluye librería para el manejo de fechas y horas para el valor de los logs
let moment = require('moment');
// se estable el formato moment local
moment.locale = require('moment/locale/es');
// Se incluyen los modelos necesarios para mongoose
var catalogoModel = require('./../models/tiposPartidaPresupuestariaModel');

/**
 * tiposPartidaPresupuestariaController.js
 *
 * @description :: Server-side logic for managing tiposPartidaPresupuestarias.
 */
module.exports = {

	/*
	 * Método encargado de listar los items del catálogo.
	 */
	list: function (req, res) {
		// Busca la información del catalogo
		catalogoModel.find({}, function (err, catalogo) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al buscar los registros', null);
				return res.status(500).send(respuesta.getJSON());
			}
			if (!catalogo) {
				let respuesta = new HttpResponse(false, 'No existe la definición del catálogo.', null);
				return res.status(404).send(respuesta.getJSON());
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, catalogo);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},

	/*
	 * Método encargado de buscar un item del catálogo.
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.id
		};
		catalogoModel.findOne(_where, function (err, item) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error no se pudo encontrar el registro', null);
				return res.status(500).send(respuesta.getJSON());
			}
			if (!item) {
				let respuesta = new HttpResponse(false, 'Registro no encontrado', null);
				return res.status(404).send(respuesta.getJSON());
			}
			let respuesta = new HttpResponse(true, 'Información obtenida con exito', item);
			return res.status(200).send(respuesta.getJSON());
		});
	},

	/**
	 * Método encargado de crear un nuevo registro.
	 */
	create: function (req, res) {
		// Se crea un nuevo objeto tipo schema mongodb
		var item = new catalogoModel({
			descripcion: req.body.descripcion,
			codigo: req.body.codigo,
			estado: req.body.estado,
			'logs.created': {
				usuario_id: req.userArcaRequest.user._id,
				usuario: req.userArcaRequest.user.usuario,
				nombre: req.userArcaRequest.user.nombre
			}
		});
		item.save(function (err, data) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al guardar nuevo registro', null);
				return res.status(500).send(respuesta.getJSON());
			}

			let respuesta = new HttpResponse(true, 'Registro agregado con exito', data);
			// devuelve la respuesta de exito
			return res.status(200).send(respuesta.getJSON());
		});
	},

	/**
	 * Método encargado de actualizar/crear.
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
				descripcion: req.body.descripcion,
				codigo: req.body.codigo,
				estado: req.body.estado,
				'logs.modified': {
					fecha: moment(new Date()).add(-6, 'h').toDate(),
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
};
