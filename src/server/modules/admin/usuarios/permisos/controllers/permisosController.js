// Definición para el fichero permisosController.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de PERMISOS USUARIOS para interactuar la base de datos mongo.
// Modificado: (25-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

// Se incluyen módulos a utilizar
const async = require('async'); // Módulo async para manejo solicitudes asincronas
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../../shared/interfaces/httpResponse');
const permisosModel = require('./../../../../admin/catalogos/models/permisosModel');
const permisosUsuariosModel = require('./../models/permisosModel');

/**
 * permisosUsuariosController.js
 *
 * @description :: Server-side logic for managing permisoss.
 */
module.exports = {
	/**
	 * permisosUsuariosController.listByUsuarioAplicacionUnidadProgramatica()
   	* @description Función encargada de obtener los permisos del usuario por unidad programática
   	*/
	listByUsuarioAplicacionUnidadProgramatica: function (req, res) {

		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'usuario_id': req.params.usuario,
			'aplicacion_id': req.params.app,
			'unidadProgramatica_id': req.params.up
		};

		permisosUsuariosModel.find(_where, function (err, permisos) {
			if (err) {
				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(false, 'Error tratando de obtener los datos los usuarios.', null);
				// Se obtiene el JSON del mensaje y se envia (500 = Internal Server Error)
				return res.status(500).send(respuesta.getJSON());
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			// Si no existen unidades programáticas asociadas se envia un arreglo vacio de datos
			const respuesta = new HttpResponse(true, null, permisos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({
			'idPermiso': 1
		});
	},
	/**
	 * permisosUsuariosController.updateByUsuarioYUnidadProgramatica()
     * @description Función encargada de actualizar los permisos del usuario por unidad programática
     */
	updateByUsuarioYUnidadProgramatica: function (req, res) {
		// Se realiza la ejecución de las funciones asincronas de forma sincrona
		// (IMPORTANTE: El primer parámetro que se envia a las funciones callback cuando NO es nulo indica un ERROR)
		async.waterfall([
			function (callback) {
				// Valida si NO hay datos para pasar a la siguiente función SIN HACER NADA
				if (req.body.eliminados.length === 0) { callback(null); return; }

				// Se busca y eliminar TODOS los permisos marcados
				permisosUsuariosModel.remove({ _id: { $in: req.body.eliminados } }, function (error) {
					if (error) {
						callback(error);
						return;
					}
					// Si todo va bien continua
					callback(null);
					return;
				});
			},
			function (callback) {
				// Agrega todos los nuevos permisos
				const inserts = req.body.agregados.map(function (_permiso) {
					// Retorna por cada item un nuevo objeto mapeable en el autocompletar
					return {
						'aplicacion_id': req.params.app,
						'unidadProgramatica_id': req.params.up,
						'usuario_id': req.params.usuario,
						'permiso_id': _permiso,
					};
				});

				// Valida si NO hay datos para pasar a la siguiente función SIN HACER NADA
				if (inserts.length === 0) { callback(null); return; }

				// Es un registro nuevo de permisos con el criterio de búsqueda
				// Actualiza los datos del catalogo
				permisosUsuariosModel.create(inserts, function (error) {
					if (error) {
						callback(error);
						return;
					}
					// Si todo va bien continua
					callback(null);
					return;
				});
			}
		], function (err) {
			if (err) {
				return res.status(500).json({
					message: 'Error actualizando los datos de permisos para el usuario.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, 'Los datos se actualizaron de forma satisfactoria.', null);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * permisosUsuariosController.validarPermisoUsuarioPorNombre()
	 * @description Función encargada de validar si el usuario posee el permiso asignado
	 */
	validarPermisoUsuarioPorNombre: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'aplicacion_id': req.params.app,
			'idPermiso': req.params.permiso
		};

		// Buaca el permiso en el catálogo
		permisosModel.findOne(_where, function (err, _permiso) {
			if (err || !_permiso) {
				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(false, 'No posee permisos.', null);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			}

			// Variable que establece el filtro de la consulta a la base de datos (WHERE)
			const _where2 = {
				'aplicacion_id': req.params.app,
				'unidadProgramatica_id': req.params.up,
				'usuario_id': req.params.usuario,
				'permiso_id': _permiso._id,
			};
			// Busca si el usuario posee el permiso
			permisosUsuariosModel.findOne(_where2, function (err2, _permisoUsuario) {
				if (err2 || !_permisoUsuario) {
					// Se crea un objeto respuesta y los datos se encapsulan en este
					const respuesta = new HttpResponse(false, 'No posee permisos.', null);
					// Se obtiene el JSON del mensaje y se envia (200 = OK)
					return res.status(200).send(respuesta.getJSON());
				}

				// Se crea un objeto respuesta y los datos se encapsulan en este
				// Si no existen unidades programáticas asociadas se envia un arreglo vacio de datos
				const respuesta = new HttpResponse(true, 'El usuario posee permisos.', null);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
		});
	}
};
