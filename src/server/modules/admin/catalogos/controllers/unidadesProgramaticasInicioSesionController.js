// Definición JavaScript para el controlador catálogo unidades programáticas inicio de sesión v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye la libreria lodash para clonación de objetos
const cloneDeep = require('lodash/cloneDeep');
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const unidadesProgramaticasInicioSesionModel = require('./../models/unidadesProgramaticasInicioSesionModel');
const unidadesProgramaticasModel = require('./../models/unidadesProgramaticasModel');
const aplicacionesModel = require('./../models/aplicacionesArcaModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('././../../../shared/services/utilidadesService');
// Obtiene las variables de configuración según entorno
const config = require('./../../../../config/config')[process.env.NODE_ENV];

/**
 * Función que se encarga de mapear la lista de unidades y a las descripciones les
 * agrega los código de UP
 * @param {*} unidades Lista de unidades programáticas
 */
let mapeoUpsDescripcion = function (unidades) {
	// Se modifican los datos para poder mapearlos
	let _ups = [];

	// Valida si el objeto es un Array
	if (Array.isArray(unidades)) {
		// Recorre el arreglo
		unidades.forEach(item => {
			// Copia el objeto completo
			let _unidad = cloneDeep(item);
			// Agrega el id de la up a la descripción
			_unidad.unidadProgramatica_id.descripcion = _unidad.unidadProgramatica_id.idUP.toString() + ' - ' + _unidad.unidadProgramatica_id.descripcion;
			// Agrega al arreglo de respuesta el objeto
			_ups.push(_unidad);
		});
		// Ordena el arreglo resultante
		_ups.sort(function (a, b) {
			return a.unidadProgramatica_id.idUP - b.unidadProgramatica_id.idUP;
		});
	} else {
		// Agrega el id de la up a la descripción
		unidades.descripcion = unidades.idUP.toString() + ' - ' + unidades.descripcion;
		// Agrega al arreglo de respuesta el objeto
		_ups.push(unidades);
	}

	// Retorna las unidades programáticas
	return _ups;
};

/*
 * unidadesProgramaticasInicioSesionController.js
 * @description :: Server-side logic for managing unidades-programaticas-inicio-sesion.
 */
module.exports = {
	/*
	 * Método encargado de listar los items del catálogo.
	 */
	list: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};

		// Busca la información del catalogo
		unidadesProgramaticasInicioSesionModel.find(_where)
			.populate({
				path: 'aplicacion_id',
				model: aplicacionesModel
			})
			.populate({
				path: 'unidadProgramatica_id',
				model: unidadesProgramaticasModel
			})
			.exec(function (err, catalogo) {
				if (err) {
					return res.status(500).json({
						message: 'No se pudo obtener el catálogo de unidades-programaticas-inicio-sesion.',
						error: err
					});
				}

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, mapeoUpsDescripcion(catalogo));
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
	},
	/*
	 * Método encargado de obtener una unidad-programatica-inicio-sesion por su id
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};

		// Busca la información del catalogo
		unidadesProgramaticasInicioSesionModel.findOne(_where)
			.populate({
				path: 'aplicacion_id',
				model: aplicacionesModel
			})
			.populate({
				path: 'unidadProgramatica_id',
				model: unidadesProgramaticasModel
			})
			.exec(function (err, catalogo) {
				if (err) {
					return res.status(500).json({
						message: 'No se pudo obtener el catálogo de unidades-programaticas-inicio-sesion.',
						error: err
					});
				}

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, mapeoUpsDescripcion(catalogo));
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
	},
	/*
	 * Método encargado de listar los items del catálogo para la aplicación actual
	 */
	showByAplicacionLocal: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'aplicacion_id': config.aplicacion // Id de la aplicación
		};

		// Busca la información del catalogo
		unidadesProgramaticasInicioSesionModel.find(_where)
			.populate({
				path: 'unidadProgramatica_id',
				model: unidadesProgramaticasModel
			})
			.exec(function (err, catalogo) {
				if (err) {
					return res.status(500).json({
						message: 'No se pudo obtener el catálogo de unidades-programaticas-inicio-sesion.',
						error: err
					});
				}

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, mapeoUpsDescripcion(catalogo));
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
	},
	/*
	 * Método encargado de listar los items del catálogo por el id de la aplicación
	 */
	showByIdAplicacion: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'aplicacion_id': req.params.id // Id de la aplicación
		};

		// Busca la información del catalogo
		unidadesProgramaticasInicioSesionModel.find(_where)
			.populate({
				path: 'unidadProgramatica_id',
				model: unidadesProgramaticasModel
			})
			.exec(function (err, catalogo) {
				if (err) {
					return res.status(500).json({
						message: 'No se pudo obtener el catálogo de unidades-programaticas-inicio-sesion.',
						error: err
					});
				}

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, mapeoUpsDescripcion(catalogo));
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
	},
	/**
	 * catalogosController.create()
	 * @description Método encargado de crear las unidades programáticas inicio sesion
	 */
	create: function (req, res) {
		// Inicializa el objeto y establece los datos
		var unidades = new unidadesProgramaticasInicioSesionModel({
			aplicacion_id: req.body.aplicacion_id,
			unidadProgramatica_id: req.body.unidadProgramatica_id,
			estado: req.body.estado,
			logs: {
				created: {
					usuario_id: req.userArcaRequest.user._id,
					usuario: req.userArcaRequest.user.usuario,
					nombre: req.userArcaRequest.user.nombre
				}
			}
		});

		// Guarda el objeto nuevo
		unidades.save(function (err, data) {
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
	 * unidadesProgramaticasInicioSesionController.update()
	 * @description Método encargado de actualizar las unidades programáticas inicio sesion
	 */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};

		unidadesProgramaticasInicioSesionModel.findOne(_where, function (err, data) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al buscar el registro a actualizar', null);
				return res.status(500).send(respuesta.getJSON());
			}

			data.set({
				aplicacion_id: req.body.aplicacion_id,
				unidadProgramatica_id: req.body.unidadProgramatica_id,
				estado: req.body.estado,
				logs: {
					modified: {
						fecha: utils.localDateToUTC(new Date()),
						usuario_id: req.userArcaRequest.user._id,
						usuario: req.userArcaRequest.user.usuario,
						nombre: req.userArcaRequest.user.nombre
					}
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
	 * unidadesProgramaticasInicioSesionController.delete()
	 * @description Método encargado de eliminar las unidades programáticas inicio sesion
	 */
	delete: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};

		unidadesProgramaticasInicioSesionModel.findOneAndRemove(_where, function (err) {
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
