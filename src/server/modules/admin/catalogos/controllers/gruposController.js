// Definición JavaScript para el controlador catálogo grupos siges v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jimenez <apicadoj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const catalogoModel = require('./../models/gruposArticulosModel');
// instancia a la libreria de mongoose
const mongoose = require('mongoose');
// Módulo async para manejo solicitudes asincronas
const async = require('async');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');

/*
 * gruposController.js
 * @description :: Server-side logic for managing catalogos.
 */
module.exports = {
	/**
	 * @description Función encargada de obtener el catálogo de
	 * grupos de artículos que provienen de la collection creada con información de SIGES.
	 */
	list: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};
		// Busca la información del catalogo
		catalogoModel.find(_where, function (err, catalogos) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener los grupos de articulos.',
					error: err
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, catalogos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({
			'descripcion': 1
		});
	},
	/**
	 * @description Función encargada de obtener el catálogo de
	 * grupos de artículos por ID que provienen de la collection creada con información de SIGES.
	 */
	showByGrupo: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};
		// Busca la información del catalogo
		catalogoModel.find(_where, function (err, catalogos) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener los grupos de articulos.',
					error: err
				});
			}
			var grupo_id = mongoose.Types.ObjectId(req.params.id);
			var gruposObtenidos = [];
			async.eachSeries(catalogos, function (grupo, callbackInicial) {
				if (grupo.subclase_id.equals(grupo_id)) {
					let grupoEncontrado = {
						'_id': grupo._id,
						'subclase_id': grupo.subclase_id,
						'descripcion': grupo.descripcion,
						'idSIGES': grupo.idSIGES
					};
					gruposObtenidos.push(grupoEncontrado);
				}
				callbackInicial();
			}, function (err) {
				// Valida si existe un error
				if (err) {
					// Se crea un objeto respuesta y los datos se encapsulan en este
					const respuesta = new HttpResponse(false, 'Error tratando de obtener el grupo de articulos.', null);
					// Se obtiene el JSON del mensaje y se envia (500 = Internal Server Error)
					return res.status(500).send(respuesta.getJSON());
				}

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, gruposObtenidos);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
		}).sort({
			'descripcion': 1
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
				descripcion: req.body.descripcion,
				subclase_id: req.body.subclase_id,
				idSIGES: req.body.idSIGES,
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
			descripcion: req.body.descripcion,
			subclase_id: req.body.subclase_id,
			idSIGES: req.body.idSIGES,
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
