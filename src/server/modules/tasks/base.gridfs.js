// Definición para el fichero base.gridfs.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: * Ing. Alexánder Picado Jiménez <apicadoj@ccss.sa.cr>
//					 * Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para la definición de las tareas programadas para los servicios de gridfs
// Modificado: 

// Se instancia administrador de conexiones a base de datos
const conn = require('./../../config/db')('mixin', 'archivos');
// Se incluye el fichero de funciones utilitarias
const utils = require('../shared/services/utilidadesService');
// se hace referencia a la librería de mongoose
const mongoose = require('mongoose');
// se instancia librería gridfs-stream para el manejo de operaciones Grid de mongoDB
let Grid = require('gridfs-stream');
// se utiliza configuración de mongoose
Grid.mongo = mongoose.mongo;
// Variable que contiene el periodo de tiempo del intervalo para la tarea
let tiempo = 4 * 3600000; // 4 Horas (el valor 3600000 equivale a 1 hora)
// Variable que contiene el periodo de tiempo de validación para determinar si un fichero es borrado
let tiempoConfirmacion = 60; // en minutos

/**
 * Función que representa los servicios para gridfs
 * @param {*} handler Manejador en memoria para la tarea
 */
let gridFsService = function (handler) {
	return {
		// Función que inicia la tarea
		start: function () {
			handler = setInterval(function () {
				// variable para el manejo de las operaciones CRUD de los documentos GridFS de mongoDB
				let gfs = null;
				// comprueba que la conexión exista
				if (conn) {
					// Crea la conexión a la BD de gridfs
					gfs = Grid(conn.db);
					// Mensaje informativo
					console.info('Task GridFS -> Inicio del proceso.');
					// se procede a buscar todos los ficheros con estado NO CONFIRMADO
					gfs.files
						.find({
							'metadata.esConfirmado': false
						})
						.toArray(function (err, files) {
							// valida si no hay errores
							if (err) {
								console.error('Task GridFS -> Error al ejecutar daemon archivos', err);
							} else {
								if (files && files.length > 0) {
									// se procede a eliminar los registros sin confirmar con más de una hora de almacenamiento en BD
									files.forEach(function (element) {
										// se toma la hora de registro almacenada
										const horaCreacion = new Date(element.uploadDate);
										// se verifica el tiempo de creación del fichero y si es MAYOR al tiempo de confirmación
										if (utils.diffDates(new Date(), horaCreacion, 'm') > tiempoConfirmacion) {
											// se procede a eliminar el registro
											gfs.remove({
												_id: element._id
											}, function (err, _gridStore) {
												// valida si no hay errores
												if (err) {
													console.error('Task GridFS -> Error al eliminar registro no confirmado (' + element._id + ')');
												}
												console.info('Task GridFS -> Fichero eliminado exitosamente (' + element._id + ')');
											});
										}
									});
								}
								else {
									console.info('Task GridFS -> No hay ficheros que procesar.');
								}
								console.info('Task GridFS -> Fin del proceso.');
							}
						});
				}
			}, tiempo);
		},
		// Función que termina la tarea
		stop: function () {
			clearInterval(handler);
			handler = 0;
		}
	};
};

module.exports = gridFsService;