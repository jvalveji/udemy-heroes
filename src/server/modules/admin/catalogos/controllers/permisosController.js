// Definición JavaScript para el controlador catálogo permisos v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez Jimenez <dgomezj@ccss.sa.cr> 
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos n./../../../shared/interfaces/httpResponse
const permisosModel = require('./../models/permisosModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('././../../../shared/services/utilidadesService');

/*
 * permisosController.js
 * @description :: Server-side logic for managing permisos.
 */
module.exports = {
	/**
	 * permisosController.list()
	 * @description Función encargada de obtener el catálogo de permisos
	 */
	list: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			esLocal: true // Solo permisos locales y NO los de MISE
		};

		// Busca la información del catalogo
		permisosModel.find(_where, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de permisos.',
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
		}).sort({ 'idPermiso': 1 });
	},
	/**
	 * permisosController.show()
	 * @description Función encargada de obtener un item especifico 
	 * del catálogo de permisos
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.id,
			esLocal: true // Solo permisos locales y NO los de MISE
		};

		// Busca la información del catalogo
		permisosModel.findOne(_where, function (err, item) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de permisos.',
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
	 * permisosController.showByAplicacion()
	 * @description Función encargada de obtener el catálogo de
	 * permisos por aplicación
	 */
	showByAplicacion: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: req.params.id,
			esLocal: true // Solo permisos locales y NO los de MISE
		};

		// Busca la información del catalogo
		permisosModel.find(_where, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de permisos.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, catalogo);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({ 'idPermiso': 1 });
	},
	/**
	 * permisosController.showByNombre()
	 * @description Función encargada de obtener los datos de un Permiso basado por un nombre
	 */
	showByNombre: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: req.params.app,
			idPermiso: req.params.nombre,
			esLocal: true // Solo permisos locales y NO los de MISE
		};

		// Busca la información del catalogo
		permisosModel.find(_where, function (err, _permiso) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el Permiso solicitado.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, _permiso);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * permisosController.create()
	 * @description Método encargado de crear los permisos
	 */
	create: function (req, res) {
		// Inicializa el objeto y establece los datos
		var Permiso = new permisosModel({
			aplicacion_id: req.body.aplicacion_id,
			idPermiso: req.body.idPermiso,
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
		Permiso.save(function (err, data) {
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
	 * permisosController.update()
	 * @description Función encargada de actualizar los permisos por aplicación
	 */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		let _where = {
			_id: req.params.id
		};

		permisosModel.findOne(_where, function (err, _permiso) {
			if (err) {
				return res.status(500).json({
					message: 'Error actualizando los datos de los permisos.',
					error: err
				});
			}

			_permiso.set({
				idPermiso: req.body.idPermiso,
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
			_permiso.save(function (err, data) {
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
	 * permisosController.delete()
	 * @description Método encargado de eliminar el permiso
	 */
	delete: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};

		permisosModel.findOneAndRemove(_where, function (err) {
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
