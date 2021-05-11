// Definición para el fichero tiposMonedaController.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de cambioMoneda para interactuar la base de datos mongo.
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

// Módelo de la estructura de monedas
const monedasModel = require('./../models/tiposMonedaModel');
// Módulo HttpResponse para el manejo de solicitudes HTTP y HTTPS
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');
const tipoCambioController = require('./../../tipo-cambio/controllers/tipoCambioController');

/**
 * tiposMonedaController.js
 *
 * @description :: Server-side logica para el manejo  del catalogo de moneda.
 */
module.exports = {

	/**
	 * @name list()
	 * @description Método encargado de listar todos las monedas disponibles en la base de datos
	 */
	list: function (req, res) {
		monedasModel.find(null, null, function (err, monedas) {
			if (err) {
				//Se returna la respuesta de error al obtener las monedas
				return res.status(500).json({
					message: 'Error al obtener las monedas.',
					error: err
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, 'Lista de monedas', monedas);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @name show()
	 * @description Función encargada de obtener los datos de una moneda por su id
	 */
	show: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'_id': req.params.id
		};
		// Busca la información del catalogo
		monedasModel.findOne(_where, function (err, moneda) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener el catálogo de monedas.',
					error: err
				});
			}
			if (!moneda) {
				return res.status(404).json({
					message: 'No existe la definición del catálogo.'
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, moneda);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({
			'codigo': 1
		});
	},
	/**
	 * @name create()
	 * @description Método encargado de crear un nuevo registro.
	 */
	create: function (req, res) {
		// Se crea un nuevo objeto tipo schema mongodb
		var item = new monedasModel({
			indicador: req.body.indicador,
			descripcion: req.body.descripcion,
			simbolo: req.body.simbolo,
			estado: true,
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
				// devuelve la respuesta de error
				let respuesta = new HttpResponse(false, 'Error al guardar nuevo registro', null);
				return res.status(500).send(respuesta.getJSON());
			}
			let respuesta = new HttpResponse(true, 'Registro agregado con éxito', data);
			// devuelve la respuesta de exito
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @name update()
	 * @description Método encargado de actualizar la moneda por medio de su id.
	 */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.id
		};

		monedasModel.findOne(_where, function (err, data) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al buscar el registro a actualizar', null);
				return res.status(500).send(respuesta.getJSON());
			}
			data.set({
				indicador: req.body.indicador,
				descripcion: req.body.descripcion,
				simbolo: req.body.simbolo,
				estado: req.body.estado,
				'logs.modified': {
					fecha: utils.localDateToUTC(new Date()),
					usuario_id: req.userArcaRequest.user._id,
					usuario: req.userArcaRequest.user.usuario,
					nombre: req.userArcaRequest.user.nombre
				}
			});
			data.save(function (err, data) {
				if (err) {
					// devuelve la respuesta de error
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
	 * @name convertirDivisa()
	 * @description Método encargado realizar la conversion de divisas
	 */
	convertirDivisa: function (req, res) {
		// Se crean las variables para los calculos de convertir las divisas
		let fecha1 = new Date(),
			fecha2 = new Date(),
			moneda1 = req.body.items.moneda1,
			moneda2 = req.body.items.moneda2,
			valorMonedaCambio, valorMonedaCambiar, cantidadConvertir = req.body.items.cantidadConvertir,
			total;
		// se crea el modelo de los parametros para la funcion IndicadoresEconomicos
		let request = {
			body: {
				items: {
					fechaInicio: fecha1,
					fechaFinal: fecha2,
					indicador: moneda1
				}
			}
		};
		// Se verifica que la moneda base no sea el dolar americano
		if (moneda1 !== '0') {
			// Se llama al método que retorna el valor exacto de los indicadores economicos para realizar la conversión
			tipoCambioController.IndicadoresEconomicos(request, function (response) {
				// Se verifica que la respuesta sea exitosa
				if (response.respuesta.exito) {
					// Se asigna el Valor retornado por la función IndicadoresEconomicos para realizar los calculos
					valorMonedaCambio = response.respuesta.data.Valor;
					// Se verifica que la moneda a convertir no sea el dolar
					if (moneda2 !== '0') {
						// Se realiza el cambio del indicador por la segunda moneda para obtener el valor segun el BCCR
						request.body.items.indicador = moneda2;
						// Se llama al método que retorna el valor exacto de los indicadores economicos para realizar la conversión
						tipoCambioController.IndicadoresEconomicos(request, function (response) {
							// Se verifica que la respuesta sea exitosa
							if (response.respuesta.exito) {
								// Se asigna el Valor retornado por la función IndicadoresEconomicos para realizar los calculos
								valorMonedaCambiar = response.respuesta.data.Valor;
								/* Se realiza la conversión de las divisas pasando por una moneda intermedia como es el dolar
								Ej: total = (montoColones / tipoCambioDolarBCCR) * tipoCambioYenesBCCR
								*/
								total = (cantidadConvertir / valorMonedaCambio) * valorMonedaCambiar;
								// Se crea un objeto respuesta y los datos se encapsulan en este
								const respuesta = new HttpResponse(true, 'Conversion lista', total);
								// Se obtiene el JSON del mensaje y se envia (200 = OK)
								res.status(200).send(respuesta.getJSON());
							} else {
								// Se crea un objeto respuesta y los datos se encapsulan en este
								const respuesta = new HttpResponse(true, 'Error al convertir la divisa', null);
								// Se obtiene el JSON del mensaje y se envia (500 = ERROR)
								res.status(500).send(respuesta.getJSON());
							}
						});
					} else {
						/*Si la moneda a convertir es el dolar la formula es mas simple.
						Ej: total = montoColones / tipoCambioDolarBCCR */
						total = cantidadConvertir / valorMonedaCambio;
						// Se crea un objeto respuesta y los datos se encapsulan en este
						const respuesta = new HttpResponse(true, 'Conversion lista', total);
						// Se obtiene el JSON del mensaje y se envia (200 = OK)
						res.status(200).send(respuesta.getJSON());
					}
				} else {
					// Se crea un objeto respuesta y los datos se encapsulan en este
					const respuesta = new HttpResponse(true, 'Error al convertir la divisa', null);
					// Se obtiene el JSON del mensaje y se envia (500 = ERROR)
					res.status(500).send(respuesta.getJSON());
				}
			});
		} else {
			// Se establece el indicador de los parametros en la moneda a convertir
			request.body.items.indicador = moneda2;
			// Se llama al método que retorna el valor exacto de los indicadores economicos para realizar la conversión
			tipoCambioController.IndicadoresEconomicos(request, function (response) {
				// Se verifica que la respuesta sea exitosa
				if (response.respuesta.exito) {
					// Se asigna el Valor retornado por la función IndicadoresEconomicos para realizar los calculos
					valorMonedaCambio = response.respuesta.data.Valor;
					// Ej: total = cantidadDolares * tipoCambioDolarBCCR
					total = cantidadConvertir * valorMonedaCambio;
					// Se crea un objeto respuesta y los datos se encapsulan en este
					const respuesta = new HttpResponse(true, 'Conversion lista', total);
					// Se obtiene el JSON del mensaje y se envia (200 = OK)
					res.status(200).send(respuesta.getJSON());
				} else {
					// Se crea un objeto respuesta y los datos se encapsulan en este
					const respuesta = new HttpResponse(true, 'Error al convertir la divisa', null);
					// Se obtiene el JSON del mensaje y se envia (500 = ERROR)
					res.status(500).send(respuesta.getJSON());
				}
			});
		}
	}
};
