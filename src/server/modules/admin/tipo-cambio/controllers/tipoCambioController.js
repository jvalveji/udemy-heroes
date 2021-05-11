// Definición para el fichero tipoCambioController.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Descripción: Controlador con las operaciones del tipo de cambio para interactuar con el servicio del BCCR.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
const mongoose = require('mongoose');
const request = require('request'); // Módulo request para solicitudes http
const format = require('date-format');
const xml2js = require('xml2js');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../shared/services/utilidadesService');
// Módelo de la estructura de tipoCambioHistorial
const tipoCambioHistorialModel = require('./../models/tipoCambioHistorialModel');

/**
 * @name IndicadoresEconomicosBCCR()
 * @description Método encargado de realizar la consulta al servicio del BCCR segun el indicador
 */
let IndicadoresEconomicosBCCR = function (params, callback) {
	try {
		// Representa la fecha de inicio del rango de busqueda escogida
		let fechaI = new Date(params.fechaInicio);
		// Representa la fecha final del rango de busqueda escogida
		let fechaF = new Date(params.fechaFinal);
		// se establece la fecha de inicio en el formato correcto para el WS del BCCR
		let fechaInicio = format('dd/MM/yyyy', fechaI);
		// se establece la fecha final en el formato correcto para el WS del BCCR
		let fechaFinal = format('dd/MM/yyyy', fechaF);
		// Se establece el indicador economico enviado como parametro
		let indicadorEconomico = params.indicador;
		// se define el modelo de valores
		let valores = {
			Indicador: "",
			Fecha: "",
			Valor: ""
		};
		// se establece un arreglo de valores cuando la consulta devuelve varios valores
		var arrayValores = [];
		// Se establece en options los parametros para la consulta de BCCR
		var options = {
			'method': 'POST',
			'url': 'https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML',
			'headers': {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			timeout: 20000, // 20 segundos
			proxy: 'http://172.30.37.44:8090',
			/**Los valores de nombre, subnivel correo y token  */
			form: {
				'Indicador': indicadorEconomico,
				'FechaInicio': fechaInicio,
				'FechaFinal': fechaFinal,
				'Nombre': 'Felipe Jimenez Calderon',
				'SubNiveles': 'S',
				'CorreoElectronico': 'fjimenca@ccss.sa.cr',
				'Token': 'LNSCPIMOE0'
			}
		};

		request(options, function (error, response) {
			if (error) {
				//se captura el error de la petición para poder extraer el mensaje de error que es enviada desde el servicio
				let respuesta = new HttpResponse(false, error, null);
				let mensaje = JSON.parse(respuesta.respuesta.mensaje).status_message;
				// se devuelve el mensaje de error de la petición
				callback(mensaje);
				return;
			} else {
				var parser = new xml2js.Parser({
					explicitArray: false,
					trim: true
				});
				parser.parseString(response.body, (err, result) => {
					if (err) {
						//se captura el error de la petición para poder extraer el mensaje de error que es enviada desde el servicio
						let respuesta = new HttpResponse(false, err, null);
						let mensaje = JSON.parse(respuesta.respuesta.mensaje).status_message;
						// se devuelve el mensaje de error de la petición
						callback(mensaje);
						return;
					} else {
						let xml = "";
						xml = result['string']['_'];
						parser.parseString(xml, (err, result) => {
							if (err) {
								//se captura el error de la petición para poder extraer el mensaje de error que es enviada desde el servicio
								let respuesta = new HttpResponse(false, error, null);
								let mensaje = JSON.parse(respuesta.respuesta.mensaje).status_message;
								// se devuelve el mensaje de error de la petición
								callback(mensaje);
								return;
							} else {
								if (result['Datos_de_INGC011_CAT_INDICADORECONOMIC']['INGC011_CAT_INDICADORECONOMIC']) {
									if (result['Datos_de_INGC011_CAT_INDICADORECONOMIC']['INGC011_CAT_INDICADORECONOMIC'].length) {
										for (const i in result['Datos_de_INGC011_CAT_INDICADORECONOMIC']['INGC011_CAT_INDICADORECONOMIC']) {
											let valores = {
												Indicador: "",
												Fecha: "",
												Valor: ""
											};
											valores.Indicador = result['Datos_de_INGC011_CAT_INDICADORECONOMIC']['INGC011_CAT_INDICADORECONOMIC'][i]['COD_INDICADORINTERNO'];
											valores.Fecha = result['Datos_de_INGC011_CAT_INDICADORECONOMIC']['INGC011_CAT_INDICADORECONOMIC'][i]['DES_FECHA'];
											valores.Valor = result['Datos_de_INGC011_CAT_INDICADORECONOMIC']['INGC011_CAT_INDICADORECONOMIC'][i]['NUM_VALOR'];
											arrayValores.push(valores);
										}

										let respuesta = new HttpResponse(true, 'Exito!', arrayValores);
										callback(respuesta);
										return;
									} else {
										valores.Indicador = result['Datos_de_INGC011_CAT_INDICADORECONOMIC']['INGC011_CAT_INDICADORECONOMIC']['COD_INDICADORINTERNO']
										valores.Fecha = result['Datos_de_INGC011_CAT_INDICADORECONOMIC']['INGC011_CAT_INDICADORECONOMIC']['DES_FECHA']
										valores.Valor = result['Datos_de_INGC011_CAT_INDICADORECONOMIC']['INGC011_CAT_INDICADORECONOMIC']['NUM_VALOR']
										let respuesta = new HttpResponse(true, 'Exito!', valores);
										callback(respuesta);
										return;
									}
								}

								let respuesta = new HttpResponse(false, 'Indicador no encontrado en la fecha especificada', null);
								//let mensaje = JSON.parse(respuesta.respuesta.mensaje).status_message;
								// se devuelve el mensaje de error de la petición
								callback(respuesta);
								return;
							}
						});
					}
				});
			}
		});
	}
	catch (error) {
		// se devuelve el mensaje de error de la petición
		callback(new HttpResponse(false, error, null).getJSON());
		return;
	}
};

/**
 * tipoCambioController.js
 *
 * @description :: Server-side logic for managing tipoCambio.
 */
module.exports = {
	/**
	 * @name list()
	 * @description Método encargado de listar todos los indicadores economicos por bancos
	 */
	list: function (req, res) {
		tipoCambioHistorialModel.find(null, null, function (err, bancos) {
			if (err) {
				//Se returna la respuesta de error al obtener los indicadores
				return res.status(500).json({
					message: 'Error al obtener los indicadores.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, 'Lista de indicadores economicos', bancos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @name create()
	 * @description Método encargado de crear un nuevo registro.
	 */
	create: function (req, res) {
		// Se crea un nuevo objeto tipo schema mongodb
		var item = new tipoCambioHistorialModel({
			indicadorCompra: req.body.indicadorCompra,
			indicadorVenta: req.body.indicadorVenta,
			fechaCompra: req.body.fechaCompra,
			fechaVenta: req.body.fechaVenta,
			valorCompra: req.body.valorCompra,
			valorVenta: req.body.valorVenta,
			nombreBanco: req.body.nombreBanco,
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
	 * @name 	IndicadoresEconomicosWS
	 * @descripcion Método encargado de obtener el indicador según el BCCR
	 */
	IndicadoresEconomicosWS: function (req, res) {
		// Representa la fecha de inicio del rango de busqueda
		let fechaI = req.body.items.fechaInicio;
		// Representa la fecha final del rango de busqueda
		let fechaF = req.body.items.fechaFinal;
		// Representa el indicador para obtener el valor de la compra del dolar
		let indicador = req.body.items.indicador;
		// Se establecen los valores de la consulta como parametros
		params = {
			fechaInicio: fechaI,
			fechaFinal: fechaF,
			indicador: indicador
		};
		// Llamado al metodo  que realiza la consulta al servicio del BCCR
		IndicadoresEconomicosBCCR(params, function (callback) {
			// Se devuelve la respuesta del  servicio
			res.status(200).send(callback.respuesta);

		});
	},
	/**
	 * @name 	IndicadoresEconomicos
	 * @descripcion Método encargado de obtener el indicador según el BCCR
	 */
	IndicadoresEconomicos: function (req, callback) {
		// Representa la fecha de inicio del rango de busqueda
		let fechaI = req.body.items.fechaInicio;
		// Representa la fecha final del rango de busqueda
		let fechaF = req.body.items.fechaFinal;
		// Representa el indicador para obtener el valor de la compra del dolar
		let indicador = req.body.items.indicador;
		params = {
			fechaInicio: fechaI,
			fechaFinal: fechaF,
			indicador: indicador
		}
		IndicadoresEconomicosBCCR(params, function (fn) {
			//tipoCambioHistorialController.create(callback.respuesta, res);
			return callback(fn);
		});

	},
	/**
	 * @name ObtenerIndicadoresPorDia()
	 * @description Método encargado de obtener los indicadores por dia
	 */
	ObtenerIndicadoresPorDia: function (req, res) {
		// Se recibe la fecha
		let fechaCompleta = req.body.items;
		// Se establece el formato necesario para poder realizar la busqueda
		let fecha = fechaCompleta.split('T');
		const fechaConsulta = fecha[0] + 'T00:00:00-06:00';
		// Se establece el formato que busqueda
		const _where = {
			fechaCompra: fechaConsulta,
			fechaVenta: fechaConsulta
		};
		tipoCambioHistorialModel.find(_where, null, function (err, indicadoresBancos) {
			if (err) {
				//Se returna la respuesta de error al obtener los indicadores
				return res.status(500).json({
					message: 'Error al obtener los indicadores de la base de datos.',
					error: err
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, 'Lista de indicadores', indicadoresBancos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @name ObtenerIndicadoresPorDiaCreacion
	 * @description Método encargado de buscar por medio de la fecha de creacion
	 */
	ObtenerIndicadoresPorDiaCreacion: function (req, res) {
		let fechaCompleta = new Date(req.body.items);
		const _where = {
			'logs.created.fecha': {
				$gte: new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate()),
				$lte: new Date(fechaCompleta.getFullYear(), fechaCompleta.getMonth(), fechaCompleta.getDate()),
			}
		};
		tipoCambioHistorialModel.find(_where, null, function (err, indicadoresBancos) {
			if (err) {
				//Se returna la respuesta de error al obtener las monedas
				return res.status(500).json({
					message: 'Error al obtener los indicadores de la base de datos.',
					error: err
				});
			}
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, 'Lista de indicadores', indicadoresBancos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @name update()
	 * @description Método encargado de actualizar.
	 */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.id
		};
		tipoCambioHistorialModel.findOne(_where, function (err, data) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al buscar el registro a actualizar', null);
				return res.status(500).send(respuesta.getJSON());
			}
			data.set({
				indicadorCompra: req.body.indicadorCompra,
				indicadorVenta: req.body.indicadorVenta,
				fechaCompra: req.body.fechaCompra,
				fechaVenta: req.body.fechaVenta,
				valorCompra: req.body.valorCompra,
				valorVenta: req.body.valorVenta,
				nombreBanco: req.body.nombreBanco,
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
	}
};
