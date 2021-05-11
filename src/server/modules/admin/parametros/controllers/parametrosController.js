// Definición para el fichero parametrosController.js v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de PARAMETROS para interactuar la base de datos mongo.
// Modificado por: (29-06-2020) Ing. Dagoberto Gómez Jiménez

// Módulo async para manejo solicitudes asincronas
const async = require('async');
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');
// Se incluyen los modelos a utilizar
const parametroModel = require('./../models/parametrosModel');

/**
 * parametrosController.js
 *
 * @description :: Server-side logic for managing parametros.
 */
module.exports = {
	/**
	 * parametrosController.list()
	 * @description Función que obtiene todos los parámetros 
	 */
	list: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};

		// Busca la información de los parámetros
		parametroModel.find(_where, function (err, parametros) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener los parámetros del generales del arca.',
					error: err
				});
			}
			if (!parametros) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo de parámetros.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, parametros);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * parametrosController.listByGlobal()
	 * @description Función que obtiene los parámetros globales
	 */
	listByGlobal: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: {
				$exists: false // Donde no exista la unidad programática
			},
			unidadProgramatica_id: {
				$exists: false // Donde no exista la unidad programática
			}
		};

		// Busca la información de los parámetros
		parametroModel.find(_where, function (err, parametros) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener los parámetros del generales del arca.',
					error: err
				});
			}
			if (!parametros) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo de parámetros.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, parametros);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * parametrosController.listByAplicacion()
	 * @description Función que obtiene los parámetros por aplicación
	 */
	listByAplicacion: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: req.params.id,
			unidadProgramatica_id: {
				$exists: false // Donde no exista la unidad programática
			}
		};

		// Busca la información de los parámetros
		parametroModel.find(_where, function (err, parametros) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener los parámetros del generales del arca.',
					error: err
				});
			}
			if (!parametros) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo de parámetros.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, parametros);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * parametrosController.listByUnidadProgramatica()
	 * @description Función que obtiene los parámetros por unidad programática
	 */
	listByUnidadProgramatica: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: req.params.app,
			unidadProgramatica_id: req.params.up
		};

		// Busca la información de los parámetros
		parametroModel.find(_where, function (err, parametros) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener los parámetros del generales del arca.',
					error: err
				});
			}
			if (!parametros) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo de parámetros.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, parametros);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * parametrosController.show()
	 * @description Método encargado de retornar la información de un parámetro por su id
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.id
		};

		// Busca la información de los parámetros
		parametroModel.findOne(_where, function (err, parametros) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el parámetro solicitado.',
					error: err
				});
			}
			if (!parametros) {
				return res.status(404).json({
					message: 'No existe la definición del parámetro solicitado en el catálogo de parámetros.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, parametros);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * parametrosController.showByGlobalNombre()
	 * @description Método encargado de retornar la información de un parámetro GLOBAL por su nombre
	 */
	showByGlobalNombre: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			nombre: req.params.nombre
		};

		// Busca la información de los parámetros
		parametroModel.findOne(_where, function (err, parametros) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el parámetro solicitado.',
					error: err
				});
			}
			if (!parametros) {
				return res.status(404).json({
					message: 'No existe la definición del parámetro solicitado en el catálogo de parámetros.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, parametros);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * parametrosController.getByGlobalNombre()
	 * @description Método encargado de retornar la información de un parámetro GLOBAL por su nombre
	 * @param {String} name Nombre del parámetro a buscar
	 * @param {Object} callback Función callback
	 * @return Retorna la función callback
	 */
	getByGlobalNombre: function (name, callback) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			nombre: name,
			estado: true
		};

		// Busca el parámetro indicado en la base de datos
		parametroModel.findOne(_where, function (err, parametro) {
			if (err) {
				// En caso de error retorna nulo
				callback(null);
			}

			// Retorna los datos del parámetro
			callback(parametro ? parametro.toJSON() : null);
		});
	},
	/**
	 * parametrosController.showByAplicacionNombre()
	 * @description Método encargado de retornar la información de un parámetro de APLICACIÓN por su nombre
	 */
	showByAplicacionNombre: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: req.params.app,
			nombre: req.params.nombre
		};

		// Busca la información de los parámetros
		parametroModel.findOne(_where, function (err, parametros) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el parámetro solicitado.',
					error: err
				});
			}
			if (!parametros) {
				return res.status(404).json({
					message: 'No existe la definición del parámetro solicitado en el catálogo de parámetros.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, parametros);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * parametrosController.showByUnidadProgramaticaNombre()
	 * @description Método encargado de retornar la información de un parámetro de UNIDAD PROGRAMATICA por su nombre
	 */
	showByUnidadProgramaticaNombre: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: req.params.app,
			unidadProgramatica_id: req.params.up,
			nombre: req.params.nombre
		};

		// Busca la información de los parámetros
		parametroModel.findOne(_where, function (err, parametros) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el parámetro solicitado.',
					error: err
				});
			}
			if (!parametros) {
				return res.status(404).json({
					message: 'No existe la definición del parámetro solicitado en el catálogo de parámetros.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, parametros);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * parametrosController.createUpdate()
	 * @description Método encargado de insertar/actualizar los datos de la colección
	 */
	createUpdate: function (req, res) {
		// Dats del usuario que efectua la transacción
		const _usuario = {
			usuario_id: req.userArcaRequest.user._id,
			usuario: req.userArcaRequest.user.usuario,
			nombre: req.userArcaRequest.user.nombre
		};

		// Función que ejecuta de forma sincrona funciones asincronas en un bucle(for, foreach, while); en este caso las de mongoose
		// Se recorren los parametros enviados por el usuario para INSERTAR/MODIFICAR
		async.eachSeries(req.body, function (parametro, callback) {

			// Variable que establece el filtro de la consulta a la base de datos (WHERE)
			const _where = {
				_id: parametro._id
			};

			parametroModel.findOne(_where, function (err, _parametro) {
				if (err) {
					// Retorna el error
					callback(err);
				}
				// Variable para los logs
				let _logs = null;

				// Valida si el dato existe
				if (!_parametro) {
					// Crea el objeto
					_parametro = new parametroModel();
					// Establece logs
					_logs = {
						created: _usuario
					};
				} else {
					// Establece logs
					_logs = {
						modified: _usuario
					};
					_logs.modified['fecha'] = utils.localDateToUTC(new Date());
				}

				// Se establecen los campos a los cuales se le actualizará la información
				_parametro.set({
					aplicacion_id: parametro.aplicacion_id,
					unidadProgramatica_id: parametro.unidadProgramatica_id,
					nombre: parametro.nombre,
					descripcion: parametro.descripcion,
					valor: parametro.valor,
					estado: parametro.estado,
					// Datos del log para el registro de actualización
					logs: _logs
				});

				// Actualiza los datos de la colección
				_parametro.save(function (err, _data) {
					if (err) {
						// Retorna el error
						callback(err);
					}
					// Continua el flujo
					callback(null);
				});
			});
		}, function (err) {
			if (err) {
				return res.status(500).json({
					message: 'Error actualizando los datos de los parámetros.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, 'Los parámetros se actualizaron de forma satisfactoria.', null);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	}
};
