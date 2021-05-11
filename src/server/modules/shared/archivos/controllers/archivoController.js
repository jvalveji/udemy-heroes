// Definición para el fichero archivoController.js V4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Fichero utilizado para el manejo de las operaciones REST, base de datos mongoDB (arca-archivos)
// Modificado: (06-07-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../interfaces/httpResponse');
// Se instancia administrador de conexiones a base de datos
const conn = require('./../../../../config/db')('mixin', 'archivos');
// se hace referencia a la librería de mongoose
const mongoose = require('mongoose');
// Se instancia el servicio de utilidades
const utils = require('./../../services/utilidadesService');
// se instancia colección fs.files de base de datos arca-archivos
const filesModel = require('./../models/archivoModel');

// se instancia librería gridfs-stream para el manejo de operaciones Grid de mongoDB
let Grid = require('gridfs-stream');
// se utiliza configuración de mongoose
Grid.mongo = mongoose.mongo;
// variable para el manejo de las operaciones CRUD de los documentos GridFS de mongoDB
let gfs = null;
// comprueba que la conexión exista y de ser así inicializa el objeto gfs para el uso del CRUD
if (conn) {
	conn.once('open', () => {
		gfs = Grid(conn.db);
	});
}

/**
 * archivoController.js
 *
 * @description :: Server-side logic for managing archivos.
 */
module.exports = {
	/**
	 * archivosController.confirm()
	 * @description método encargado de cambiar estado de los ficheros a confirmados atributo metadata.esConfirmado
	*/
	confirm: function (req, res) {
		// se recibe una lista array de caratúlas a confirmar en formato json
		var lista = req.body.list;
		// se recorre el array con el fin de actualizar cada uno de los elementos
		lista.forEach(function (element) {
			filesModel.updateOne({ _id: element._id }, { $set: { 'metadata.esConfirmado': true } }, function (err, _file) {
				if (err) {
					let respuesta = new HttpResponse(false, 'Error al confirmar ficheros ', null);
					return res.status(500).send(respuesta.getJSON());
				}
			});
		});
		// en el caso de que todos los ficheros hayan sido actualizados con éxito devuelve la respuesta
		let respuesta = new HttpResponse(true, 'Ficheros confirmados', lista);
		return res.status(200).send(respuesta.getJSON());
	},
	/**
	 * archivoController.show()
	 * @description devuelve un registro por ID ({file: StringBase64, filename: string, contentType:string  }) info recuperada de base de datos
	 */
	show: (req, res) => {
		let id = req.params.id;
		// representa array de bytes
		let data = [];
		// variable para almacenar los atributos del encabezado del fichero consultado
		var infoFichero = '';
		// se busca encabezado de archivo por id
		filesModel.findOne({
			_id: id
		}, function (err, fichero) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al cargar fichero', null);
				return res.status(500).send(respuesta.getJSON());
			}
			if (!fichero) {
				let respuesta = new HttpResponse(false, 'No se encontraron registros para ese id', null);
				return res.status(404).send(respuesta.getJSON());
			}
			// se obtiene el encabezado del fichero consultado
			infoFichero = JSON.parse(JSON.stringify(fichero));
			// se inicia la lectura mediante el id del archivo
			let readstream = gfs.createReadStream({
				_id: id
			});
			// se almacenan los pedazos asociados a la búsqueda 
			readstream.on('data', chunk => {
				data.push(chunk);
			});
			// se devuelve la información parseada a base64 y se cierra la lectura
			readstream.on('end', () => {
				data = Buffer.concat(data);
				// representa fichero en string base64
				let item = 'data:' + infoFichero.contentType + ';base64,' + Buffer.alloc(data.length, data).toString('base64');
				let respuesta = new HttpResponse(true, 'Archivo o documento encontrado con éxito!!', {
					file: item,
					filename: infoFichero.filename,
					contentType: infoFichero.contentType
				});
				// se envía respuesta con los datos
				return res.status(200).end(respuesta.getJSON());
			});
			// en caso de error devuelve el mensaje de error
			readstream.on('error', err => {
				let respuesta = new HttpResponse(false, 'Ocurrio un error en la búsqueda del fichero!!', err);
				return res.status(500).send(respuesta.getJSON());
			});
		});

	},
	/**
	 * archivoController.create()
	 * @description guarda un archivo en base de datos de mongo
	 */
	create: (req, res) => {
		// representa el archivo o documento
		let archivoReq = req.files.file;
		// representa retricción de tiempo en minutos por defecto -1 
		let deleteTime = -1;
		// se evalua si en el request viene retricción de tiempo de eliminación
		if (req.body.tiempoEliminacion) {
			deleteTime = parseInt(req.body.tiempoEliminacion, 10);
		}
		// se procede a declarar la carátula, ***campos content_type y allias en desuso favor no utilizar, la recomendación es agregar content_type en metadata
		let writeStream = gfs.createWriteStream({
			filename: archivoReq.name,
			content_type: archivoReq.mimetype,
			mode: 'w',
			metadata: {
				logs: {
					created: {
						usuario_id: req.userArcaRequest.user._id,
						usuario: req.userArcaRequest.user.usuario,
						nombre: req.userArcaRequest.user.nombre
					}
				},
				contentType: archivoReq.mimetype,
				sistema: req.body.sistema,
				tiempoEliminacion: deleteTime,
				esConfirmado: false
			}
		});
		writeStream.on('close', archivo => {
			// se verifica si se agrego el archivo
			if (!archivo) {
				let respuesta = new HttpResponse(false, 'Fichero no recibido!!', null);
				return res.status(400).send(respuesta.getJSON());
			}
			let fichero = JSON.parse(JSON.stringify(archivo));
			let respuesta = new HttpResponse(true, 'Registro agregado con éxito', {
				_id: fichero._id,
				filename: fichero.filename,
				contentType: fichero.contentType
			});
			return res.status(201).send(respuesta.getJSON());
		});
		// importante se deben de utilizar callbacks para un adecuado funcionamiento
		// writeStream debe finalizar la operación una vez escritos los datos en la base de datos
		writeStream.write(archivoReq.data, () => {
			writeStream.end();
		});
	},

	/**
	* archivoController.showSoloArchivo()
	* @description devuelve un registro por ID completo y en el formato correspondiente
	*/
	showSoloArchivo: (req, res) => {
		let id = req.params.id;
		// representa array de bytes
		let data = [];
		// variable para almacenar los atributos del encabezado del fichero consultado
		var infoFichero = '';
		// se busca encabezado de archivo por id
		filesModel.findOne({
			_id: id
		}, function (err, fichero) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al cargar fichero', null);
				return res.status(500).send(respuesta.getJSON());
			}
			if (!fichero) {
				let respuesta = new HttpResponse(false, 'No se encontraron registros para ese id', null);
				return res.status(404).send(respuesta.getJSON());
			}
			// se obtiene el encabezado del fichero consultado
			infoFichero = JSON.parse(JSON.stringify(fichero));
			// se inicia la lectura mediante el id del archivo
			let readstream = gfs.createReadStream({
				_id: id
			});
			// se almacenan los pedazos asociados a la búsqueda
			readstream.on('data', chunk => {
				data.push(chunk);
			});
			// se devuelve la información parseada a base64 y se cierra la lectura
			readstream.on('end', () => {
				data = Buffer.concat(data);

				res.writeHead(200, {
					'Content-Type': infoFichero.contentType,
					'Content-Disposition': 'attachment; filename=' + infoFichero.filename,
					'Content-Length': data.length
				});

				res.end(data);
			});
			// en caso de error devuelve el mensaje de error
			readstream.on('error', err => {
				let respuesta = new HttpResponse(false, 'Ocurrio un error en la búsqueda del fichero!!', err);
				return res.status(500).send(respuesta.getJSON());
			});
		});

	},

	/**
	 * archivoController.remove()
	 * @description elimina un registro de la base de datos
	 */
	remove: (req, res) => {
		var id = req.params.id;
		// representa el encabezado del registro a eliminar
		var infoFichero = '';
		// bandera para evaluar si un registro se puede o no eliminar por restricción de tiempo
		var eliminar = true;
		// se busca encabezado de archivo por id
		filesModel.findOne({
			_id: id
		}, function (err, fichero) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al cargar fichero', null);
				return res.status(500).send(respuesta.getJSON());
			}
			if (!fichero) {
				let respuesta = new HttpResponse(false, 'No se encontraron registros asociados', null);
				return res.status(404).send(respuesta.getJSON());
			}
			// se asigna el encabezado del fichero consultado
			infoFichero = JSON.parse(JSON.stringify(fichero));
			// se asigna usuario de creación del registro
			let usuarioCreacion = infoFichero.metadata[0].logs.created.usuario_id;
			// se asigna usuario actual
			let usuarioSesion = req.userArcaRequest.user._id;
			// se toma la hora de registro almacenada
			const horaCreacion = new Date(infoFichero.uploadDate);
			// se verifica si el fichero cuenta con restriccion de tiempo de ser así se realiza la asignación correspondiente y se procede a valorar validez
			if (infoFichero.metadata[0].tiempoEliminacion !== -1) {
				if (utils.diffDates(new Date(), horaCreacion, 'm') > infoFichero.metadata[0].tiempoEliminacion) {
					eliminar = false;
				}
			}
			// se evalua que no viole retricciones 
			if (eliminar && usuarioCreacion === usuarioSesion) {
				// se permite la eliminación del registro
				gfs.remove({
					_id: id
				}, function (err, _gridStore) {
					if (err) {
						let respuesta = new HttpResponse(false, 'Error al eliminar el registro', null);
						return res.status(500).send(respuesta.getJSON());
					}
					let respuesta = new HttpResponse(true, 'Registro eliminado con éxito', null);
					return res.status(200).send(respuesta.getJSON());
				});
			} else {
				let respuesta = new HttpResponse(false, 'No tiene permiso para eliminar registro!!', null);
				return res.status(200).send(respuesta.getJSON());
			}
		});
	}
};
