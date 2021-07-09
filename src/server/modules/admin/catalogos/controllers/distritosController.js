// Definición JavaScript para el controlador catálogo distritos v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jimenez <apicadoj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const catalogoModel = require('./../models/distritosModel');
// Instancia a la libreria de mongoose
const mongoose = require('mongoose');
// Se incluye el modelo de cantones
const cantonesModel = require('./../models/cantonesModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');

/*
 * distritosController.js
 * @description :: Server-side logic for managing catalogos.
 */
module.exports = {
	/**
	 * @description Función encargada de obtener el catálogo de
	 * distritos
	 */
	list: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};
		// Busca la información del catalogo
		catalogoModel.find(_where)
			.populate({
				path: 'idCanton',
				model: cantonesModel
			}).sort({
				'codigo': 1
			}).exec((err, catalogo) => {
				if (err) {
					return res.status(500).json({
						message: 'No se pudo obtener el catálogo de Distritos.',
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
	 * @description Función encargada de obtener de los items
	 * del catálogo de distritos aquellos que pertenezcan al cantón específico
	 */

	showByCanton: function (req, res) {
		// Obtien el id del grupo y lo almacena en una variable local
		const idCanton = req.params.idCanton;
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			idCanton: mongoose.Types.ObjectId(idCanton)
		};
		// Ejecuta una función de agregación para obtener los datos por el filtro
		catalogoModel.find(_where)
			.populate({
				path: 'idCanton',
				model: cantonesModel
			}).sort({
				'codigo': 1
			})
			.exec((err, items) => {
				if (err) {
					return res.status(500).json({
						message: 'No se pudo obtener el catálogo de distritos basado en el cantón indicado.',
						error: err
					});
				}
				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, items);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
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
				idSIAH: req.body.idSIAH,
				idCantonSIAH: req.body.idCantonSIAH,
				idCanton: req.body.idCanton,
				codigo: req.body.codigo,
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
			idSIAH: req.body.idSIAH,
			idCantonSIAH: req.body.idCantonSIAH,
			idCanton: req.body.idCanton,
			codigo: req.body.codigo,
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
