// Definición JavaScript para el controlador catálogo unidades programaticas v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jimenez <apicadoj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const unidadesProgramaticasModel = require('./../models/unidadesProgramaticasModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');

/**
 * Función que se encarga de mapear la lista de unidades y a las descripciones les
 * agrega los código de UP
 * @param {*} unidades Lista de unidades programáticas
 */
let mapeoUpsDescripcion = function (unidades) {
	// Valida si el objeto es un Array
	if (Array.isArray(unidades)) {
		// Recorre el arreglo
		unidades.map((_unidad) => {
			// Agrega el id de la up a la descripción
			_unidad.descripcion = _unidad.idUP.toString() + ' - ' + _unidad.descripcion;
			return _unidad;
		});
	} else {
		// Agrega el id de la up a la descripción
		unidades.descripcion = unidades.idUP.toString() + ' - ' + unidades.descripcion;
	}

	// Retorna las unidades programáticas
	return unidades;
};

/**
 * unidadesProgramaticasController.js
 * @description :: Server-side logic for managing unidades-programaticas.
 */
module.exports = {
	/**
	 * unidadesProgramaticasController.list()
	 * @description Función encargada de obtener el catálogo de unidades programáticas
	 */
	list: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};

		// Busca la información del catalogo
		unidadesProgramaticasModel.find(_where, function (err, catalogo) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de unidades-programaticas.',
					error: err
				});
			}
			if (!catalogo) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, mapeoUpsDescripcion(catalogo));
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * unidadesProgramaticasController.show()
	 * @description Función encargada de obtener un item especifico 
	 * del catálogo de unidades programáticas
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};

		// Busca la información del catalogo
		unidadesProgramaticasModel.findOne(_where, function (err, item) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de unidades-programaticas.',
					error: err
				});
			}
			if (!item) {
				return res.status(404).json({
					message: 'No existe la definición del item.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, mapeoUpsDescripcion(item));
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * unidadesProgramaticasController.showByIdUP()
	 * @description Función encargada de obtener un item especifico 
	 * del catálogo de unidades programáticas por el id numérico de la UP
	 * @params idUP Indentificador numérico de la unidad programática
	 * @params callback Función callback de retorno
	 */
	showByIdUP: function (idUP, callback) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'idUP': idUP
		};

		// Busca la información del catalogo
		unidadesProgramaticasModel.findOne(_where, function (err, item) {
			if (err) {
				callback({
					message: 'No se pudo obtener el catálogo de unidades-programaticas.',
					error: err
				});
			}

			// Retorna el resultado
			callback(null, item);
		});
	},
	/**
	 * unidadesProgramaticasController.create()
	 * @description Método encargado de crear las unidades programáticas
	 */
	create: function (req, res) {
		// Inicializa el objeto y establece los datos
		var unidades = new unidadesProgramaticasModel({
			idUP: req.body.idUP,
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
	 * unidadesProgramaticasController.update()
	 * @description Método encargado de actualizar las unidades programáticas
	 */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};

		unidadesProgramaticasModel.findOne(_where, function (err, data) {
			if (err) {
				return res.status(500).json({
					message: 'Error buscando los datos de los item.',
					error: err
				});
			}

			data.set({
				descripcion: req.body.descripcion,
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
	}
};
