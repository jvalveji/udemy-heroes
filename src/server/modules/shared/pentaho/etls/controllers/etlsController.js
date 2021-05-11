// Definición para el fichero etlsController.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones sobre los ETLS que se ejecutan desde el servidor de PENTAHO
// Modificado por: (25-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluyen módulos a utilizar
const request = require('request'); // Módulo para solicitudes http
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../interfaces/httpResponse');
// Obtiene las variables de configuración según entorno
const config = require('./../../../../../config/config')[process.env.NODE_ENV];
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../services/utilidadesService');
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

	// Instrucción para ver el estado de  todos los Etls en Pentaho
	// La respuesta XML contiene un tag llamado "transstatuslist" donde se obtiene la lista de etls y sus estados
	// Ej.: http://localhost:8080/pentaho/kettle/status?userid=_user&password=_pass&xml=Y

	try {
		// Realiza un request con la instrucción para obtener los estados de los Etls
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
 * Función encargada de obtener el estado actual de un etl
 * @param {*} id Identificador del proceso
 * @param {*} nameEtl Nombre del etl
 * @param {*} callback Función de retorno con los datos solicitados
 */
let ObtenerEstadoActualEtl = function (id, nameEtl, callback) {
	// Se establecen las variables de usuario y contraseña para conectar a Pentaho
	let _user = (credencialesUsuario && credencialesUsuario.user) ? credencialesUsuario.user : credencialesPentaho.user;
	let _pass = (credencialesUsuario && credencialesUsuario.pass) ? credencialesUsuario.pass : credencialesPentaho.pass;

	// Instrucción para ver el estado de un etl en Pentaho
	// Ej.: http://localhost:8080/pentaho/kettle/transStatus?userid=_user&password=_pass&name=TestETL&xml=y

	try {
		// Realiza un request con la instrucción para ver el estado del Etl
		request({
			rejectUnauthorized: false, // Si la aplicación es HTTPS no ocupa este flag (en teoría :D)
			url: config.pentaho.home + '/kettle/transStatus',
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: 'userid=' + _user + '&password=' + _pass + '&name=' + nameEtl + '&xml=y',
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
				// transstatus -> Si encontro el Etl / webresult -> NO encontro el Etl y genero una respuesta de error
				let resp = (_estado.transstatus) ? _estado.transstatus : _estado.webresult;
				// Retorna el estado del Etl
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
 * Función encargada de ejecutar un Etl en la plataforma de Pentaho
 * @param {*} id Identificador del proceso
 * @param {*} rootEtl Ruta del etl (incluyendo nombre) en el servidor de Pentaho
 * @param {*} isDataService Indica si el ETL se ejecutará como un Data Service y retornará datos (JSON/XML)
 * @param {*} parametros Parametros enviados al Etl
 * @param {*} callback Función de retorno con los datos solicitados
 */
let EjecutarEtl = function (id, rootEtl, isDataService, parametros, callback) {
	// Se establecen las variables de usuario y contraseña para conectar a Pentaho
	let _user = (credencialesUsuario && credencialesUsuario.user) ? credencialesUsuario.user : credencialesPentaho.user;
	let _pass = (credencialesUsuario && credencialesUsuario.pass) ? credencialesUsuario.pass : credencialesPentaho.pass;

	// IMPORTANTE: Se sustituyen espacios en blanco en el nombre/ruta del ETL por el signo de [+] (si existiesen espacios en blanco)
	rootEtl = rootEtl.replace(/ /g, '+');

	// Instrucción para ejecutar un etl en Pentaho
	// Ej.: http://localhost:8080/pentaho/kettle/executeTrans/?userid=_user&password=_pass&rep=reponame&trans=/home/test/TestETL&level=INFO

	try {
		// Si existiesen parámetros para el ETL se obtienen para enviarlos como parámetros en la consulta
		let _parametros = (parametros) ? ObtenerListaParametrosEtl(parametros) : '';

		// Realiza un request con la instrucción para ejecutar un Etl
		request({
			rejectUnauthorized: false, // Si la aplicación es HTTPS no ocupa este flag (en teoría :D)
			url: config.pentaho.home + '/kettle/executeTrans/',
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: 'userid=' + _user + '&password=' + _pass + '&rep=' + config.pentaho.repo + '&trans=' + rootEtl + _parametros + '&level=INFO',
			timeout: timeout
		}, function (error, estado) {
			// Valida si hay errores
			if (error) {
				//  Envia el error como respuesta
				callback(error);
				return;
			}

			// Valida si el ETL retorna datos; ya que el api de Pentaho retorna VACIO el body cuando solo ejecuta el ETL
			if (estado && estado.body !== "") {
				// Valida el tipo de respuesta esperada por el usuario
				if (isDataService) {
					// Retorna la respuesta tal cual es dada por Pentaho (JSON / XML)
					callback(null, estado.body);
					return;
				} else {
					// En caso contrario se retorna la respuesta en formato JSON y como un objeto HttpResponse
					// La respuesta esta en formato XML; por lo que se pasa a JSON
					// Ejecuta la función que parsea los datos a JSON
					utils.parseXMLtoJSON(estado.body, function (error, _estado) {
						if (error) {
							//  Envia el error como respuesta
							callback(error);
							return;
						}
						// Si todo anda bien retorna el estado de la ejecución
						callback(null, _estado);
						return;
					});
				}
			} else {
				// Retorna como resultado del ETL que respondio todo bien en la ejecución
				// (eso no quiere decir que el resultado sea OK del proceso del ETL, para eso hay que ver el status del mismo)
				callback(null, { resultado: 'El proceso ETL inicio de forma correcta.\n Verifique su estado actual.' });
				return;
			}
		});
	} catch (err) {
		// Retorna el error
		callback(err);
		return;
	}
};

/**
 * Función que se encarga de recibir un objeto JSON con los parámetros a enviar al Etl
 * para convertirlos en una sola cadena de variables a pasar por la URL
 * @param {*} parametros Parametro de tipo JSON con los datos de los parámetros a enviar al Etl
 * @return Retorna un cadena que representa los parametros
 */
let ObtenerListaParametrosEtl = function (parametros) {
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
 * etlsTaskController.js
 *
 * @description :: Server-side logic for managing etlsTask.
 */
module.exports = {
	/**
	 * @description Función encargada de listar TODOS los ETLS que se ejecutaron en el servidor de Pentaho
	 */
	list: function (req, res) {
		try {
			// Se obtiene los datos enviados
			const _idProceso = req.userArcaRequest.user._id; // Se toma como identificador del proceso el id del usuario

			// Se obtiene el estado de los procesos etl
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
	 * @description Función encargada de mostrar el estado actual de un Etl
	 */
	show: function (req, res) {
		try {
			// Se obtiene los datos enviados
			const _idProceso = req.userArcaRequest.user._id; // Se toma como identificador del proceso el id del usuario

			// Se obtiene el estado del etl
			ObtenerEstadoActualEtl(_idProceso, req.params.nameEtl, req.params.idEtl, function (err, estado) {
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
	 * @description Función encargada de ejecutar un Etl
	 */
	create: function (req, res) {
		// Variable para retornar la respuesta al usuario
		let respuesta = null;

		try {
			// Se obtiene los datos enviados
			const _idProceso = req.userArcaRequest.user._id; // Se toma como identificador del proceso el id del usuario
			credencialesUsuario = req.body.credenciales;
			// Valida si se incluye el parámetro par indicar que el ETL se consumira como un DataService (JSON y XML)
			// Normal=0 / JSON=1 / XML=2
			const isDataService = (!req.body.isDataService) ? 0 : req.body.isDataService;

			// Se ejecuta el proceso
			EjecutarEtl(_idProceso, req.body.rootEtl, isDataService, req.body.parametros, function (err, estado) {
				if (err) {
					return res.status(500).json({
						message: 'Error tratando de iniciar el proceso.\nContacte con el administrador.',
						error: err
					});
				}

				// Valida el tipo de respuesta que espera obtener el usuario
				if (isDataService === 0) {
					// Se crea un objeto respuesta y los datos se encapsulan en este
					respuesta = new HttpResponse(true, null, estado).getJSON();
				} else {
					// Valida el tipo de respuesta que espera obtener el usuario
					if (isDataService === 2) {
						// Agrega el encabezado xml a la respuesta (solo cuando es XML)
						res.set('Content-Type', 'text/xml');
					}
					// Asigna los datos en su estado "puro" (JSON/XML)
					respuesta = estado;
				}

				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta);
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
