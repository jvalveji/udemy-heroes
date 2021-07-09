// Definición para el fichero jobsController.js v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones sobre los JOBS que se ejecutan desde el servidor de PENTAHO
// Modificado por: (29-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluyen módulos a utilizar
const request = require('request'); // Módulo para solicitudes http
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../interfaces/httpResponse');
// Obtiene las variables de configuración según entorno
const config = require('./../../../../../config/config')[process.env.NODE_ENV];
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../../shared/services/utilidadesService');
// Variable para definir el tiempo TIMEOUT (15 segundos)
const timeout = 15 * 1000; // Milisegundos (1000 ms = 1 s)

// Se declaran las credenciales de conexión para la plataforma pentaho
let credencialesPentaho = {
	user: 'pentaho_hsvp',
	pass: 'DWH.CGI.2208'
};
// Variable para manejar el usuario y contraseña enviado desde el cliente (Ej.: {user:'JDoe',pass:'12345'})
let credencialesUsuario = null;

/**
 * Función encargada de obtener el estado de las tareas ejecutadas por el servidor (TODAS)
 * @param {*} id Identificador del proceso
 * @param {*} callback Función de retorno con los datos solicitados
 */
let ObtenerEstadoTareasServidor = function (id, callback) {
	// Se establecen las variables de usuario y contraseña para conectar a Pentaho
	let _user = (credencialesUsuario && credencialesUsuario.user) ? credencialesUsuario.user : credencialesPentaho.user;
	let _pass = (credencialesUsuario && credencialesUsuario.pass) ? credencialesUsuario.pass : credencialesPentaho.pass;

	// Instrucción para ver el estado de  todos los Jobs en Pentaho
	// La respuesta XML contiene un tag llamado "jobstatuslist" donde se obtiene la lista de jobs y sus estados
	// Ej.: http://localhost:8080/pentaho/kettle/status?userid=_user&password=_pass&xml=Y

	try {
		// Realiza un request con la instrucción para obtener los estados de los Jobs
		request({
			rejectUnauthorized: false, // Si la aplicación es HTTPS no ocupa este flag (en teoría :D)
			url: config.pentaho.home + '/kettle/status',
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: 'userid=' + _user + '&password=' + _pass + '&xml=Y',
			timeout: timeout
		}, function (error, estado) {
			// Valida si hay errores
			if (error) {
				//  Envia el error como respuesta
				callback(error);
				return;
			}
			// Ejecuta la función que parsea los datos a JSON
			utils.parseXMLtoJSON(estado.body, function (error, _estado) {
				if (error) {
					//  Envia el error como respuesta
					callback(error);
					return;
				}
				// Si todo anda bien retorna el estado
				callback(null, _estado.serverstatus);
				return;
			});
		});
	} catch (err) {
		// Retorna el error
		callback(err);
		return;
	}
};

/**
 * Función encargada de obtener el estado actual de un job
 * @param {*} id Identificador del proceso
 * @param {*} nameJob Nombre del job
 * @param {*} idJob Id del proceso en el servidor Carter de Pentaho
 * @param {*} callback Función de retorno con los datos solicitados
 */
let ObtenerEstadoActualJob = function (id, nameJob, idJob, callback) {
	// Se establecen las variables de usuario y contraseña para conectar a Pentaho
	let _user = (credencialesUsuario && credencialesUsuario.user) ? credencialesUsuario.user : credencialesPentaho.user;
	let _pass = (credencialesUsuario && credencialesUsuario.pass) ? credencialesUsuario.pass : credencialesPentaho.pass;

	// Instrucción para ver el estado de un job en Pentaho
	// Ej.: http://localhost:8080/pentaho/kettle/jobStatus?userid=_user&password=_pass&name=TestJOB&xml=y

	try {
		// Realiza un request con la instrucción para ver el estado del Job
		request({
			rejectUnauthorized: false, // Si la aplicación es HTTPS no ocupa este flag (en teoría :D)
			url: config.pentaho.home + '/kettle/jobStatus',
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: 'userid=' + _user + '&password=' + _pass + '&name=' + nameJob + (idJob ? '&id=' + idJob : '') + '&xml=y',
			timeout: timeout
		}, function (error, estado) {
			// Valida si hay errores
			if (error) {
				//  Envia el error como respuesta
				callback(error);
				return;
			}
			// Ejecuta la función que parsea los datos a JSON
			utils.parseXMLtoJSON(estado.body, function (error, _estado) {
				if (error) {
					//  Envia el error como respuesta
					callback(error);
					return;
				}
				// Se debe validar la propiedad que contiene la información
				// jobstatus -> Si encontro el Job / webresult -> NO encontro el Job y genero una respuesta de error
				let resp = (_estado.jobstatus) ? _estado.jobstatus : _estado.webresult;
				// Retorna el estado del Job
				callback(null, resp);
				return;
			});
		});
	} catch (err) {
		// Retorna el error
		callback(err);
		return;
	}
};

/**
 * Función encargada de ejecutar un Job en la plataforma de Pentaho
 * @param {*} id Identificador del proceso
 * @param {*} rootJob Ruta del job (incluyendo nombre) en el servidor de Pentaho
 * @param {*} parametros Parametros enviados al Job
 * @param {*} callback Función de retorno con los datos solicitados
 */
let EjecutarJob = function (id, rootJob, parametros, callback) {
	// Se establecen las variables de usuario y contraseña para conectar a Pentaho
	let _user = (credencialesUsuario && credencialesUsuario.user) ? credencialesUsuario.user : credencialesPentaho.user;
	let _pass = (credencialesUsuario && credencialesUsuario.pass) ? credencialesUsuario.pass : credencialesPentaho.pass;

	// IMPORTANTE: Se sustituyen espacios en blanco en el nombre/ruta del JOB por el signo de [+] (si existiesen espacios en blanco)
	rootJob = rootJob.replace(/ /g, '+');

	// Instrucción para ejecutar un job en Pentaho
	// Ej.: http://localhost:8080/pentaho/kettle/executeJob/?userid=_user&password=_pass&rep=reponame&job=/home/test/TestJOB&level=INFO

	try {
		// Si existiesen parámetros para el JOB se obtienen para enviarlos como parámetros en la consulta
		let _parametros = (parametros) ? ObtenerListaParametrosJob(parametros) : '';

		// Realiza un request con la instrucción para ejecutar un Job
		request({
			rejectUnauthorized: false, // Si la aplicación es HTTPS no ocupa este flag (en teoría :D)
			url: config.pentaho.home + '/kettle/executeJob/',
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: 'userid=' + _user + '&password=' + _pass + '&rep=' + config.pentaho.repo + '&job=' + rootJob + _parametros + '&level=INFO',
			timeout: timeout
		}, function (error, estado) {
			// Valida si hay errores
			if (error) {
				//  Envia el error como respuesta
				callback(error);
				return;
			}
			// Ejecuta la función que parsea los datos a JSON
			utils.parseXMLtoJSON(estado.body, function (error, _estado) {
				if (error) {
					//  Envia el error como respuesta
					callback(error);
					return;
				}
				// Si todo anda bien retorna el estado de la ejecución
				callback(null, _estado.webresult);
				return;
			});
		});
	} catch (err) {
		// Retorna el error
		callback(err);
		return;
	}
};

/**
 * Función que se encarga de recibir un objeto JSON con los parámetros a enviar al Job
 * para convertirlos en una sola cadena de variables a pasar por la URL
 * @param {*} parametros Parametro de tipo JSON con los datos de los parámetros a enviar al Job
 * @return Retorna un cadena que representa los parametros
 */
let ObtenerListaParametrosJob = function (parametros) {
	// Se declara variable que contredra el resultado
	var resultado = '';
	try {
		// Recorre el arreglo de parámetros
		parametros.forEach(param => {
			// Recorre cada una de las propiedades de cada objeto
			for (let key in param) {
				// Valida cuando el objeto es padre (si es padre es el KEY)
				if (param.hasOwnProperty(key)) {
					// Construye la variable (&key=value)
					resultado += '&' + key + '=' + param[key];
				}
			}
		});
		// Retorna el resultado como una cadena
		// (Se aplica función que reemplaza espacios en blanco por el caracter "+")
		return resultado.replace(/ /g, '+');
	} catch (error) {
		// En caso de error solo retorna vacio
		return '';
	}
};

/**
 * jobsTaskController.js
 *
 * @description :: Server-side logic for managing jobsTask.
 */
module.exports = {
	/**
	 * @description Función encargada de listar TODOS los JOBS que se ejecutaron en el servidor de Pentaho
	 */
	list: function (req, res) {
		try {
			// Se obtiene los datos enviados
			const _idProceso = req.userArcaRequest.user._id; // Se toma como identificador del proceso el id del usuario

			// Se obtiene el estado de los procesos job
			ObtenerEstadoTareasServidor(_idProceso, function (err, estados) {
				if (err) {
					return res.status(500).json({
						message: 'Error tratando de obtener los estados de los procesos del servidor.\nContacte con el administrador.',
						error: err
					});
				}

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, estados);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
		}
		catch (err) {
			return res.status(500).json({
				message: 'Error tratando de obtener los estados de los procesos del servidor.\nContacte con el administrador.',
				error: err
			});
		}
	},
	/**
	 * @description Función encargada de mostrar el estado actual de un Job
	 */
	show: function (req, res) {
		try {
			// Se obtiene los datos enviados
			const _idProceso = req.userArcaRequest.user._id; // Se toma como identificador del proceso el id del usuario

			// Se obtiene el estado del job
			ObtenerEstadoActualJob(_idProceso, req.params.nameJob, req.params.idJob, function (err, estado) {
				if (err) {
					return res.status(500).json({
						message: 'Error tratando de obtener el estado del proceso indicado.\nContacte con el administrador.',
						error: err
					});
				}

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, estado);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
		}
		catch (err) {
			return res.status(500).json({
				message: 'Error tratando de obtener el estado del proceso indicado.\nContacte con el administrador.',
				error: err
			});
		}
	},
	/**
	 * @description Función encargada de ejecutar un Job
	 */
	create: function (req, res) {
		try {
			// Se obtiene los datos enviados
			const _idProceso = req.userArcaRequest.user._id; // Se toma como identificador del proceso el id del usuario
			credencialesUsuario = req.body.credenciales;

			// Se ejecuta el proceso
			EjecutarJob(_idProceso, req.body.rootJob, req.body.parametros, function (err, estado) {
				if (err) {
					return res.status(500).json({
						message: 'Error tratando de iniciar el proceso.\nContacte con el administrador.',
						error: err
					});
				}

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, null, estado);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			});
		}
		catch (err) {
			return res.status(500).json({
				message: 'Error tratando de iniciar el proceso.\nContacte con el administrador.',
				error: err
			});
		}
	}
};
