// Definición JavaScript para el controlador catálogo diagnósticos v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jimenez <apicadoj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// instancia a la libreria de mongoose
const mongoose = require('mongoose');
// Se incluyen los modelos necesarios para mongoose
const capitulosCIE10Model = require('./../models/capitulosCIE10Model');
const gruposCIE10Model = require('./../models/gruposCIE10Model');
const categoriasCIE10Model = require('./../models/categoriasCIE10Model');
const cie10Model = require('./../models/cie10Model');

/*
 * diagnosticosController.js
 * @description :: Server-side logic for managing catalogos.
 */
module.exports = {
	/**
	 * @description Función encargada de obtener el catálogo de capítulos del CIE10
	 */
	showByCapitulosCIE10: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};
		// Busca la información del catalogo
		capitulosCIE10Model.find(_where, function (err, items) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el item correspondiente al catálogo de Unidades Programáticas.',
					error: err
				});
			}
			if (!items) {
				return res.status(404).json({
					message: 'No existe la definición del item.'
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, items);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({
			'descripcion': 1
		});
	},

	/**
	 * @description Función encargada de obtener el catálogo de grupos del CIE10
	 *              por capitulo
	 */
	showByGruposCIE10: function (req, res) {
		// Obtien el id del capitulo y lo almacena en una variable local
		const capituloID = req.params.capitulo;
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			capitulo_id: mongoose.Types.ObjectId(capituloID)
		};
		// Ejecuta una función de agregación para obtener los datos por el filtro
		gruposCIE10Model.find(_where, function (err, items) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de grupos basado en el capítulo indicado.',
					error: err
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, items);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({
			'descripcion': 1
		});
	},

	/**
	 * @description Función encargada de obtener el catálogo de categorías del CIE10
	 *              por grupo
	 */
	showByCategoriasCIE10: function (req, res) {
		// Obtien el id del grupo y lo almacena en una variable local
		const grupoID = req.params.grupo;
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			grupo_id: mongoose.Types.ObjectId(grupoID)
		};
		// Ejecuta una función de agregación para obtener los datos por el filtro
		categoriasCIE10Model.find(_where, function (err, items) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de categorías basado en el grupo indicado.',
					error: err
				});
			}
			// Variable que retornara los datos
			let datos = [{
				items: []
			}];
			// Mapea los datos para agregar a la descripción el código de categoría
			if (items) {
				// Asigna los datos mapeados
				datos[0] = items[0].map(function (_item) {
					// Retorna por cada item un nuevo objeto mapeable en el autocompletar
					return {
						_id: _item._id,
						grupo_id: _item.grupo_id,
						idUCore: _item.idUCore,
						categoria: _item.categoria,
						descripcion: _item.descripcion + ' [' + _item.categoria + ']',
						estado: _item.estado
					};
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, datos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({
			'descripcion': 1
		});
	},

	/**
	 * @description Función encargada de obtener el diagnóstico CIE10 por código
	 */
	showDiagnosticoByCodigo: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'cie10': req.params.codigo
		};
		// Busca la información del catalogo
		cie10Model.find(_where, function (err, items) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el diagnóstico.',
					error: err
				});
			}
			if (!items) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo.'
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, items);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({
			'descripcion': 1
		});
	},

	/**
	 * @description Función encargada de obtener el diagnóstico CIE10 por descripción
	 * (Se aplica un TOP patra no devolver demasiados resultados)
	 */
	showDiagnosticoByDescripcion: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		let _where = {
			descripcion: {
				'$regex': req.params.descripcion, // Equivale a un LIKE
				'$options': 'i' // Consulta la hace in-case-sensitive
			}
		};
		// Valida si existen los demás filtros para agregarlos
		if (req.params.capitulo !== '0') {
			_where['capitulo_id'] = mongoose.Types.ObjectId(req.params.capitulo);
		}
		if (req.params.grupo !== '0') {
			_where['grupo_id'] = mongoose.Types.ObjectId(req.params.grupo);
		}
		if (req.params.categoria !== '0') {
			_where['categoria_id'] = mongoose.Types.ObjectId(req.params.categoria);
		}

		// Busca la información del catalogo
		cie10Model.find(_where, function (err, items) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el diagnóstico.',
					error: err
				});
			}
			if (!items) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo.'
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, items);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).limit(50).sort({
			'descripcion': 1
		});
	},
};
