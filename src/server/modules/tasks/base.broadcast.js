// Definición para el fichero base.broadcast.js v3.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para la definición de las tareas programadas para los servicios de broadcast
// Modificado: (07-07-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero de funciones utilitarias
const utils = require('./../shared/services/utilidadesService');
// Se incluyen los fichero de modelos necesarios para mongoose
const broadcastModel = require('./../admin/broadcast/models/broadcastModel');
// Se obtiene la configuración basado en el ambiente actual
const config = require('./../../config/config')[process.env.NODE_ENV];
// Variable que contiene el periodo de tiempo del intervalo para la tarea
let tiempo = 30 * 1000; // 30 SEGUNDOS (el valor 1000 equivale a 1 segundo)

/**
 * Función que representa los servicios para los mensajes broadcast
 * @param {*} handler Manejador en memoria para la tarea
 * @param {*} app Instancia de Express.js
 */
let broadcastService = function (handler, app) {
	return {
		// Función que inicia la tarea
		start: function () {
			handler = setInterval(function () {
				// Fecha actual del server
				const today = new Date();
				// Variable para el SELECT
				const _select = {
					// mensaje: 1,
					// color: 1,
					// 'logs.created': 1
				};
				// Variable con los datos del WHERE
				const _where = {
					aplicacion_id: config.aplicacion, // Id de la aplicación
					estado: true,
					fechaInicio: {
						'$lt': utils.localDateToUTC(today)
					},
					fechaFinal: {
						'$gte': utils.localDateToUTC(today)
					}
				};

				// Consulta a la base de datos
				broadcastModel.find(_where, _select, function (err, broadcast) {
					// Valida si existen datos para enviarlos a los clientes
					if (!err) {
						// Obtiene el socket definido como variable global
						const socket = app.get('socketio');

						// Envia un mensaje al socket
						socket.emit('bitzu.broadcast', broadcast);
					}
				}).sort({
					'logs.created.fecha': 'desc'
				});
			}, tiempo);
		},
		// Función que termina la tarea
		stop: function () {
			clearInterval(handler);
			handler = 0;
		}
	};
};

module.exports = broadcastService;