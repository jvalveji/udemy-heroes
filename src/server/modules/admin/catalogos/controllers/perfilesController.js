// Definición JavaScript para el controlador catálogo perfiles v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jimenez <apicadoj@ccss.sa.cr> 
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const perfilesModel = require('./../models/perfilesModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('././../../../shared/services/utilidadesService');

/*
 * perfilesController.js
 * @description :: Server-side logic for managing perfiles.
 */
module.exports = {
	/**
	 * perfilesController.list()
	 * @description Función encargada de obtener el catálogo de perfiles
	 */
	list: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};

		// Busca la información del catalogo
		perfilesModel.find(_where, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de perfiles.',
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
	 * perfilesController.show()
	 * @description Función encargada de obtener un item especifico 
	 * del catálogo de perfiles
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.id
		};

		// Busca la información del catalogo
		perfilesModel.findOne(_where, function (err, item) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de perfiles.',
					error: err
				});
			}
			if (!item) {
				return res.status(404).json({
					message: 'No existe la definición del item.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, item);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * perfilesController.showByAplicacion()
	 * @description Función encargada de obtener el catálogo de
	 * perfiles por aplicación
	 */
	showByAplicacion: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: req.params.id
		};

		// Busca la información del catalogo
		perfilesModel.find(_where, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de perfiles.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, catalogo);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * perfilesController.showByNombre()
	 * @description Función encargada de obtener los datos de un perfil basado por un nombre
	 */
	showByNombre: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: req.params.app,
			idPerfil: req.params.nombre
		};

		// Busca la información del catalogo
		perfilesModel.find(_where, function (err, _perfil) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el perfil solicitado.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, _perfil);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * perfilesController.create()
	 * @description Método encargado de crear los perfiles
	 */
	create: function (req, res) {
		// Inicializa el objeto y establece los datos
		var perfil = new perfilesModel({
			aplicacion_id: req.body.aplicacion_id,
			idPerfil: req.body.idPerfil,
			nombre: req.body.nombre,
			descripcion: req.body.descripcion,
			estado: req.body.estado,
			esLocal: req.body.esLocal,
			logs: {
				created: {
					usuario_id: req.userArcaRequest.user._id,
					usuario: req.userArcaRequest.user.usuario,
					nombre: req.userArcaRequest.user.nombre
				}
			}
		});

		// Guarda el objeto nuevo
		perfil.save(function (err, data) {
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
	 * perfilesController.update()
	 * @description Función encargada de actualizar los perfiles por aplicación
	 */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		let _where = {
			_id: req.params.id
		};

		perfilesModel.findOne(_where, function (err, _perfil) {
			if (err) {
				return res.status(500).json({
					message: 'Error actualizando los datos de los perfiles.',
					error: err
				});
			}

			_perfil.set({
				idPerfil: req.body.idPerfil,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				estado: req.body.estado,
				esLocal: req.body.esLocal,
				logs: {
					modified: {
						fecha: utils.localDateToUTC(new Date()),
						usuario_id: req.userArcaRequest.user._id,
						usuario: req.userArcaRequest.user.usuario,
						nombre: req.userArcaRequest.user.nombre
					}
				}
			});

			// Actualiza los datos del catalogo
			_perfil.save(function (err, data) {
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
