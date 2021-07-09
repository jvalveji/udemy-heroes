// Definición JavaScript para el controlador catálogo paths v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jimenez <apicadoj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluye la referencia a las utilidades
const utils = require('././../../../shared/services/utilidadesService');
// Se incluyen los modelos necesarios para mongoose
const pathsModel = require('./../models/pathsModel');

/*
 * pathsController.js
 * @description :: Server-side logic for managing catalogos.
 */
module.exports = {
	/**
	 * @description Función encargada de obtener el catálogo de
	 * rutas (paths) por aplicación
	 */
	listPathsByAplicacion: function (req, res) {
		// Variable que establece los campos a retornar en la consulta (SELECT)
		const _select = {
			'nombre': true,
			'descripcion': true,
			'path': true,
			'items.$': true
		};

		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			idCatalogo: 'paths',
			'items.aplicacion_id': req.params.id
		};

		// Busca la información del catalogo
		pathsModel.findOne(_where, _select, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de Paths.',
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
	 * @description Función encargada de obtener los datos de un path
	 * asociado una aplicación
	 */
	showPathByNombre: function (req, res) {
		// Variable que establece los campos a retornar en la consulta (SELECT)
		const _select = {
			'items.$': true
		};

		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'idCatalogo': 'paths',
			'items.aplicacion_id': req.params.app,
			'items.idPath': req.params.nombre
		};

		// Busca la información del catalogo
		pathsModel.findOne(_where, _select, function (err, _paths) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el perfil solicitado.',
					error: err
				});
			}
			// Variable para retornar los datos
			let resp = null;
			// Se valida si existen los paths
			if (_paths) {
				// Se recorre la lista de paths
				_paths[0].some(_path => {
					// Se valida si el path existen dentro de los paths del usuario
					if (_path.idPath === req.params.nombre) {
						// Guarda el perfil encontrado
						resp = _path;
						// Retorna verdadero y sale del ciclo
						return true;
					}
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, resp);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @description Función encargada de actualizar los paths por aplicación
	 */
	updateByPathsPorAplicacion: function (req, res) {
		// Variable que establece los campos a retornar en la consulta (SELECT)
		let _select = {
			'items.aplicacion_id.$': true
		};

		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		let _where = {
			'idCatalogo': 'paths',
			'items.aplicacion_id': req.params.id
		};

		// variable con las opciones para la actualización
		let _options = null;
		let _set = null;

		pathsModel.findOne(_where, _select, function (err, paths) {
			if (err) {
				return res.status(500).json({
					message: 'Error actualizando los datos de los paths.',
					error: err
				});
			}

			// Valida si inserta o actualiza
			if (!paths) {
				// Inserta nueva aplicación con sus paths

				// Variable que establece los campos a retornar en la consulta (SELECT)
				_options = {
					upsert: true,
					select: {
						'items.$': true
					}
				};

				// Variable que establece el filtro de la consulta a la base de datos (WHERE)
				_where = {
					'idCatalogo': 'paths'
				};

				// Variable que establece la actualización de los datos (UPDATE)
				_set = {
					'$push': {
						'items': {
							'aplicacion_id': req.params.id,
							'items': req.body
						}
					},
					// Datos del log para el registro de inserción
					logs: {
						created: {
							usuario_id: req.userArcaRequest.user._id,
							usuario: req.userArcaRequest.user.usuario,
							nombre: req.userArcaRequest.user.nombre
						}
					}
				};

			} else {
				// Actualiza la aplicación con sus paths

				// Variable que establece los campos a retornar en la consulta (SELECT)
				_options = {
					select: {
						'items.aplicacion_id.$': true
					}
				};

				// Variable que establece la actualización de los datos (UPDATE)
				_set = {
					$set: {
						'items.$': req.body,
						// Datos del log para el registro de actualización
						'logs.modified': {
							fecha: utils.localDateToUTC(new Date()),
							usuario_id: req.userArcaRequest.user._id,
							usuario: req.userArcaRequest.user.usuario,
							nombre: req.userArcaRequest.user.nombre
						}
					}
				};
			}

			// Actualiza los datos del catalogo
			pathsModel.updateOne(_where, _set, _options, function (err) {
				if (err) {
					return res.status(500).json({
						message: 'Error actualizando los datos de los paths.',
						error: err
					});
				}

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, 'Los paths se actualizaron de forma satisfactoria.', null);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
		});
	}
};
