// Definición JavaScript para el controlador catálogo para plantillas de documentos 
// para imprimir mediante arcaprinters v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jimenez <apicadoj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD del catálogo para interactuar con la base de datos mongo.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const catalogoModel = require('./../models/catalogosModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');

/*
 * documentoPrinterController.js
 * @description :: Server-side logic for managing catalogos.
 */
module.exports = {
	// #region    ===============================   MÉTODOS OBTENER/LISTAR    ===============================

	// #region  MÉTODO list()
	/*
	 * Método encargado de listar los items del catálogo.
	 */
	list: function (req, res) {

		// Busca la información del catalogo
		catalogoModel.find({}, function (err, catalogo) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al buscar los registros', null);
				return res.status(500).send(respuesta.getJSON());
			}
			if (!catalogo) {
				let respuesta = new HttpResponse(false, 'No existe la definición del catálogo.', null);
				return res.status(404).send(respuesta.getJSON());
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, catalogo);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	// #endregion
	// #region  MÉTODO show()
	/*
	 * Método encargado de buscar un item del catálogo.
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.id
		};
		catalogoModel.findOne(_where, function (err, item) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error no se pudo encontrar el registro', null);
				return res.status(500).send(respuesta.getJSON());
			}
			if (!item) {
				let respuesta = new HttpResponse(false, 'Registro no encontrado', null);
				return res.status(404).send(respuesta.getJSON());
			}
			let respuesta = new HttpResponse(true, 'Información obtenida con éxito', item);
			return res.status(200).send(respuesta.getJSON());
		});
	},
	// #endregion
	// #endregion ===============================   MÉTODOS OBTENER/LISTAR    ===============================

	// #region    =============================== MÉTODOS ACTUALIZAR/INSERTAR ===============================

	// #region  MÉTODO update()
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
				printerName: req.body.printerName,
				paperSize: req.body.paperSize,
				paperSizeCustomWidth: req.body.paperSizeCustomWidth,
				paperSizeCustomHeight: req.body.paperSizeCustomHeight,
				topMargin: req.body.topMargin,
				rightMargin: req.body.rightMargin,
				bottomMargin: req.body.bottomMargin,
				leftMargin: req.body.leftMargin,
				textAlignment: req.body.textAlignment,
				lineas: req.body.lineas,
				descripcion: req.body.descripcion,
				estado: req.body.estado,
				barcode: req.body.barcode,
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
	//#endregion
	// #region  MÉTODO create()
	/**
	 * catalogosController.create()
	 * @description Método encargado de crear un nuevo registro.
	 */
	create: function (req, res) {
		// Se crea un nuevo objeto tipo schema mongodb

		var item = new catalogoModel({
			printerName: req.body.printerName,
			paperSize: req.body.paperSize,
			paperSizeCustomWidth: req.body.paperSizeCustomWidth,
			paperSizeCustomHeight: req.body.paperSizeCustomHeight,
			topMargin: req.body.topMargin,
			rightMargin: req.body.rightMargin,
			bottomMargin: req.body.bottomMargin,
			leftMargin: req.body.leftMargin,
			textAlignment: req.body.textAlignment,
			lineas: req.body.lineas,
			descripcion: req.body.descripcion,
			estado: req.body.estado,
			barcode: req.body.barcode,
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
	//#endregion

	// #endregion ===============================  MÉTODOS ACTUALIZAR/INSERTAR  ===============================

};
