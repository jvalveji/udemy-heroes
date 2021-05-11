// Definición para el fichero procesoSIGESController.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones sobre el proceso de cargar del catálogos del SIGES
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye la libreria para el manejo de archivos
const fs = require('fs');
const async = require('async'); // Módulo async para manejo solicitudes asincronas
const _scp = require('scp2'); //  Módulo para copia ficheros entre servidores
const exec = require('child_process').exec; // Módulo para ejecutar bash local
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Obtiene las variables de configuración según entorno
const config = require('../../../../config/config')[process.env.NODE_ENV];
// Se declara variable con la ruta del directorio temporal (para las cookies)
let dirTMP = '/tmp/';
// Se declaran las credenciales de conexión SSH
let credencialesSSH = {
	user: 'arca',
	pass: 'Hsvp.CGI.2208'
};

/**
 * Función encargada de crear el fichero localmente a partir de los datos
 * recibidos en el request
 * @param {*} id Identificador del proceso
 * @param {*} data Datos del archivo a escribir
 * @param {*} callback Función de retorno con los datos solicitados
 */
let CrearArchivoSIGESLocal = function (id, data, callback) {

	// Crea un objeto para escribir el flujo de datos en un archivo físico
	var uploadFile = fs.createWriteStream(dirTMP + id + '.xlsx', {
		encoding: 'utf-8',
	});
	// Escribe el flujo de datos recibido
	uploadFile.write(data);
	// Se agrega el evento que indica cuando existe un error
	uploadFile.on('error', function (error) {
		// Envia el error como respuesta
		return callback(error);
	});
	// Se finaliza el proceso de escritura del archivo
	uploadFile.end(function () {
		// Concluido el proceso se retorna nulo al callback para indicar que todo bien
		return callback(null);
	});
};


/**
 * Función encargada de enviar el fichero local hacia el servidor de Pentaho
 * para su procesamiento
 * @param {*} id Identificador del proceso
 * @param {*} callback Función de retorno con los datos solicitados
 */
let EnviarArchivoSIGESPentaho = function (id, callback) {
	// Obtiene la ruta local del archivo a subir
	const localFile = dirTMP + id + '.xlsx';
	// Se establecen los valores default para la conexión SCP
	_scp.defaults({
		port: 22,
		host: config.pentaho.ssh,
		username: credencialesSSH.user,
		password: credencialesSSH.pass
	});
	// Se valida/crea la carpeta SIGES que contendra los archivos de catálogo SIGES en el server
	_scp.mkdir('/tmp/SIGES', ['-m777'], function (error) {
		if (error) {
			// Envia el error como respuesta
			return callback(error);
		}
		// Se llama al método que se encarga de subir el fichero al servidor
		_scp.upload(localFile, '/tmp/SIGES/' + id + '.xlsx', function (error) {
			// Se cierran todas las conexiones
			_scp.close();

			// Valida si existen errores
			if (error) {
				// Envia el error como respuesta
				return callback(error);
			}

			// Se establece la instrucción para eliminar el fichero del servidor local
			const cmd = 'rm -f ' + dirTMP + id + '.xlsx';

			// Ejecuta la instrucción a nivel de bash 
			exec(cmd, function (error, stdout, stderr) {
				if (error) {
					// Envia el error como respuesta
					return callback(error);
				}
				// Concluido el proceso se retorna nulo al callback para indicar que todo bien
				return callback(null);
			});
		});
	});
};

/**
 * procesoSIGESController.js
 *
 * @description :: Server-side logic for managing procesoSIGES.
 */
module.exports = {
	/**
	 * @description Función encargada de listar TODOS los JOBS que se ejecutaron en el servidor de Pentaho
	 */
	upload: function (req, res) {
		// Se obtiene los datos enviados
		const _idProceso = req.userArcaRequest.user._id; // Se toma como identificador del proceso el id del usuario
		// Se obtiene los datos que representan al archivo cargado
		const dataFile = req.files.sigesExcel.data;

		// Se realiza la ejecución de las funciones asincronas de forma sincrona
		// (IMPORTANTE: El primer parámetro que se envia a las funciones callback cuando NO es nulo indica un ERROR)
		async.waterfall([
			function (callback) {
				// Se valida que el archivo Excel cumpla con lo minimo
				if (req.files.sigesExcel.truncated) {
					// Retorna el error
					return callback('Archivo no válido (tamaño|tipo de archivo|corrupto).');
				}
				// Continua el flujo normal
				return callback(null);
			},
			function (callback) {
				// Se crea el archivo cargado localmente
				CrearArchivoSIGESLocal(_idProceso, dataFile, callback);
			},
			function (callback) {
				// Se envia el archivo local al servidor de Pentaho para el procesamiento
				EnviarArchivoSIGESPentaho(_idProceso, callback);
			},
		], function (err) {
			if (err) {
				return res.status(500).json({
					message: 'Error tratando de subir el archivo al servidor.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, 'Carga del archivo satisfactoria. Puede proceder a ejecutar el proceso.', null);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	}
};
