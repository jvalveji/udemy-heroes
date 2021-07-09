// Definición para el fichero articulosController.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Fabián Cascante Arce <fcascant@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de ARTÍCULOS para interactuar la base de datos mongo.
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const articulosModel = require('./../models/articulosModel');
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../interfaces/httpResponse');
const mongoose = require('mongoose');

/**
 * articulosController.js
 *
 * @description :: Server-side logic for managing articuloss.
 */
module.exports = {

	/**
   * @name list()
   * @description Método encargado de listar todos los artículos existentes de la base de datos de artículos de SIGES
   */
	list: function (req, res) {
		// Variable que establece los campos a retornar en la consulta (SELECT)
		const _select = {
			_id: true,
			codigo: true,
			descripcion: true,
			clase_id: true,
			subclase_id: true,
			grupo_id: true,
			unidadesMedida: true
		};
		articulosModel.find(null, _select, function (err, articulos) {
			if (err) {
				return res.status(500).json({
					message: 'Error al obtener los artículos.',
					error: err
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, articulos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());

		});
	},

	/**
   * @name showByClase()
   * @description Método encargado de obtener y mostrar todos los artículos filtrado por la clase.
   */
	showByClase: function (req, res) {
		// Variable que establece la identificación tipo objeto para proceder a realizar el filtro respectivamente.
		var id = mongoose.Types.ObjectId(req.params.id);
		// Variable que establece los campos a retornar en la consulta (SELECT)
		const _select = {
			_id: true,
			codigo: true,
			descripcion: true,
			clase_id: true,
			subclase_id: true,
			grupo_id: true,
			unidadesMedida: true
		};
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			clase_id: id
		};
		articulosModel.find(_where, function (err, articulos) {
			if (err) {
				return res.status(500).json({
					message: 'Error al obtener los artículos filtrado por la clase.',
					error: err
				});
			}
			if (!articulos) {
				return res.status(404).json({
					message: 'No se encontró ningún artículo realizacionado con la clase seleccionada.'
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, articulos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},

	/**
   * @name showBySubClase()
   * @description Método encargado de obtener y mostrar todos los artículos filtrado por la subclase.
   */
	showBySubClase: function (req, res) {
		// Variable que establece la identificación tipo objeto para proceder a realizar el filtro respectivamente.
		var id = req.params.id;
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			subclase_id: id
		};
		articulosModel.find(_where, function (err, articulos) {
			if (err) {
				return res.status(500).json({
					message: 'Error al obtener los artículos filtrado por la subclase.',
					error: err
				});
			}
			if (!articulos) {
				return res.status(404).json({
					message: 'No se encontró ningún artículo realizacionado con la subclase seleccionada.'
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, articulos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},

	/**
   * @name showByGrupo()
   * @description Método encargado de obtener y mostrar todos los artículos filtrado por el grupo.
   */
	showByGrupo: function (req, res) {
		// Variable que establece la identificación tipo objeto para proceder a realizar el filtro respectivamente.
		var id = req.params.id;
		articulosModel.findOne({
			_id: id
		}, function (err, articulos) {
			if (err) {
				return res.status(500).json({
					message: 'Error al obtener los artículos filtrado por el grupo.',
					error: err
				});
			}
			if (!articulos) {
				return res.status(404).json({
					message: 'No se encontró ningún artículo realizacionado con el grupo seleccionado.'
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, articulos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},

	/**
   * @name showByFiltro()
   * @description Método encargado de obtener y mostrar todos los artículos filtrado por el grupo.
   */
	showByFiltro: function (req, res) {
		// Variable que contiene el ObjectId del articulo en general.
		var id = req.params.id;
		// Variable que contiene el ObjectId de la clase.
		let clase_id = req.params.clase;
		// Variable que contiene el ObjectId de la subclase.
		let subclase_id = req.params.subClase;
		// Variable que contiene el ObjectId del grupo.
		let grupo_id = req.params.grupo;
		// Variable que contiene el texto ingresado por el usuario para realizar el filtro.
		let filtro = req.params.filtro;
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		var _where = {};
		// Condición que verifica si no hubo filtro
		if (clase_id == 'null') {
			_where = {
				'descripcion': {
					'$regex': filtro,
					'$options': 'i'
				}
			};

		}
		// Ingresa al Else si hubo filtro por clase
		else {
			// Condición que verifica si no hubo filtro por la subclase y por el grupo.
			if (subclase_id == 'null' && grupo_id == 'null') {
				// Se establece el filtro solo por la clase
				_where = {
					'clase_id': clase_id,
					'descripcion': {
						'$regex': filtro,
						'$options': 'i'
					}
				};
			}
			// Ingresa al Else si hubo filtro por subclase y por grupo
			else {
				// Condición que verifica si se filtro por la subclase y no por el grupo
				if (grupo_id == 'null' && subclase_id != 'null') {
					// Se establece el filtro solo por la clase y la subclase
					_where = {
						'clase_id': clase_id,
						'subclase_id': subclase_id,
						'descripcion': {
							'$regex': filtro,
							'$options': 'i'
						}
					};
				}
				// Condición que verifica que también se filtro por el grupo
				if (grupo_id != 'null') {
					// Se establece el filtro por la clase, subclase y por el grupo.
					_where = {
						'clase_id': clase_id,
						'subclase_id': subclase_id,
						'grupo_id': grupo_id,
						'descripcion': {
							'$regex': filtro,
							'$options': 'i'
						}
					};
				}
			}
		}
		articulosModel.find(_where, function (err, articulos) {
			if (err) {
				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(false, 'Error en servidor al tratar de obtener los ingredientes', null);
				return res.status(500).send(respuesta.getJSON());
			}
			if (articulos.length === 0) {
				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(false, 'No se encontraron artículos con esa descripción.', null);
				return res.status(404).send(respuesta.getJSON());
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, articulos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},


};
