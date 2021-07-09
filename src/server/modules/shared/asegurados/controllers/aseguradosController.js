// Definición aseguradosController para el manejo de consulta de asegurados por medio del SIAC  v2.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (07-07-2020) Ing. Dagoberto Gómez Jiménez

// Se incluyen módulos a utilizar
// Módulo soap para poder consultar el servicio Web del MISE
const soap = require('soap');
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../interfaces/httpResponse');
// Obtiene las variables de configuración según entorno
const config = require('./../../../../config/config')[process.env.NODE_ENV];
// Módulo request para solicitudes http
const request = require('request');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../services/utilidadesService');
// Variable de opciones que se utiliza en las consultas MISE para establecer
// el tiempo máximo de espera por la respuesta
let opcionesMISE = {
	'request': request.defaults({
		'timeout': 10000 // Milisegundos
	})
};

/**
 * método se encarga de almacenar la información del contacto de emergencia
 * @param {*} nombreContacto nombre de la persona de contacto
 * @param {*} numerosTel números de telefóno en caso de emergencia
 * @return devuelve object con la información del contacto de emergencia
 */
let AddContactoAgendaPersonaEmerg = function (nombreContacto, numerosTel) {
	let tels = [];
	let nombrePersona = utils.capitalizeText(nombreContacto);
	let numeros = Split(numerosTel, '/');
	for (let i = 0; i < numeros.length; i++) {
		tels.push({
			tipo: ComprobarTipoTel(numeros[i]),
			numero: numeros[i]
		});
	}
	return [{
		nombrePersona: nombrePersona,
		tipoPersona: 'Otro familiar',
		contacto: tels
	}];
};

/**
 * método se encarga de almacenar la información del contacto de emergencia
 * @param {*} tel número de telefóno registrado en SIAC
 * @return devuelve json con la información del telefono e icono material asociado
 */
let AddTelefono = function (tel) {
	return [{
		tipo: ComprobarTipoTel(tel),
		numero: tel
	}];
};

/**
 * @description se encarga de evaluar el tipo de número para asignar el nombre del icono de material 
 * @param tel representa el número de telefono
 * @return devuelve string con el nombre del icono de angular material correspondiente a telefóno móvil o telefóno fijo
 */
let ComprobarTipoTel = function (tel) {
	if (tel.toString()[0] == '6' || tel.toString()[0] == '7' || tel.toString()[0] == '8') {
		return 'smartphone';
	} else {
		return 'phone';
	}
};

/**
 * método se encarga de convertir una cadena de texto en un objeto tipo array
 * @param {*} string representa cadena de texto 
 */
let Split = function (string, separador) {
	string = string.toString();
	return (string.split(separador));
};

/**
 * Método se encarga de procesar los datos obtenidos de la consulta
 * @param {*} _data representa los datos referentes a la consulta de asegurado 
 */
let ProcesarDatosAsegurado = function (_data) {
	// objeto que representa el modelo Asegurado en formato json
	let asegurado = {};

	// se procesa la información validando si el _data[posicion] esta definido es asignado a la variable del modelo y sino no lo agrega a la variable

	(_data[0]) ? asegurado['inscritoSistema'] = _data[0] : null;
	(_data[1]) ? asegurado['tipoIdentificacion'] = _data[1] : null;
	(_data[2]) ? asegurado['identificacion'] = _data[2] : null;
	(_data[3]) ? asegurado['nombrePaciente'] = utils.capitalizeText((_data[3])) : null;
	(_data[4]) ? asegurado['apellidoUnoPaciente'] = utils.capitalizeText((_data[4])) : null;
	(_data[5]) ? asegurado['apellidoDosPaciente'] = utils.capitalizeText((_data[5])) : null;
	(_data[6]) ? asegurado['fechaNacimiento'] = _data[6] : null;
	(_data[7]) ? asegurado['sexo'] = utils.capitalizeText(Split(_data[7], '/')[1]) : null;
	(_data[8]) ? asegurado['fallecido'] = utils.capitalizeText(_data[8]) : null;
	((_data[9]) && (_data[9] !== '0')) ? asegurado['telefono'] = AddTelefono(_data[9]) : null;
	(_data[10]) ? asegurado['direccionPermanente'] = utils.capitalizeText(_data[10]) : null;
	(_data[11]) ? asegurado['estadoCivil'] = utils.capitalizeText(Split(_data[11], '/')[1]) + '(a)' : null;
	(_data[12]) ? asegurado['codigoPaisNacimiento'] = Split(_data[12], '/')[0] : null;
	(_data[13]) ? asegurado['descripcionPaisNacimiento'] = utils.capitalizeText(Split(_data[13], '/')[1]) : null;
	(_data[14]) ? asegurado['descripcionProvinciaNacimiento'] = utils.capitalizeText(Split(_data[14], '/')[1]) : null;
	(_data[15]) ? asegurado['descripcionCantonNacimiento'] = utils.capitalizeText(Split(_data[15], '/')[1]) : null;
	(_data[16]) ? asegurado['descripcionDistritoNacimiento'] = utils.capitalizeText(Split(_data[16], '/')[1]) : null;
	(_data[17]) ? asegurado['descripcionDistritoPermanente'] = utils.capitalizeText(Split(_data[17], '/')[1]) : null;
	(_data[18]) ? asegurado['descripcionCantonPermanente'] = utils.capitalizeText(Split(_data[18], '/')[1]) : null;
	(_data[19]) ? asegurado['descripcionProvinciaPermanente'] = utils.capitalizeText(Split(_data[19], '/')[1]) : null;
	(_data[20]) ? asegurado['correo'] = Split(_data[20], '/')[1] : null;
	(_data[21]) ? asegurado['nombreAseguradoDirecto'] = utils.capitalizeText(_data[21]) : null;
	(_data[22]) ? asegurado['ModalidadAseguramiento'] = _data[22] : null;
	(_data[23]) ? asegurado['ocupacion'] = _data[23] : null;
	(_data[24]) ? asegurado['padreFallecido'] = utils.capitalizeText(_data[24]) : null;
	(_data[25]) ? asegurado['nombrePadre'] = utils.capitalizeText(_data[25]) : null;
	(_data[26]) ? asegurado['apellidoUnoPadre'] = utils.capitalizeText(_data[26]) : null;
	(_data[27]) ? asegurado['apellidoDosPadre'] = utils.capitalizeText(_data[27]) : null;
	(_data[28]) ? asegurado['madreFallecida'] = utils.capitalizeText(_data[28]) : null;
	(_data[29]) ? asegurado['nombreMadre'] = utils.capitalizeText(_data[29]) : null;
	(_data[30]) ? asegurado['apellidoUnoMadre'] = utils.capitalizeText(_data[30]) : null;
	(_data[31]) ? asegurado['apellidoDosMadre'] = utils.capitalizeText(_data[31]) : null;
	(_data[32]) ? asegurado['nombrePersonaLlamaEmergencia'] = _data[32] : null;
	(_data[33]) ? asegurado['telefonoEmergencia'] = _data[33] : null;
	(_data[34]) ? asegurado['direccionEmergencia'] = _data[34] : null;
	(_data[35]) ? asegurado['escolaridad'] = _data[35] : null;
	(_data[36]) ? asegurado['estadoExpediente'] = _data[36] : null;
	(_data[37]) ? asegurado['observaciones'] = _data[37] : null;
	(_data[38]) ? asegurado['actividadEconomica'] = _data[38] : null;
	(_data[39]) ? asegurado['conyugueFallecido'] = _data[39] : null;
	(_data[40]) ? asegurado['nombreConyugue'] = utils.capitalizeText(_data[40]) : null;
	(_data[41]) ? asegurado['apellidoUNoConyugue'] = utils.capitalizeText(_data[41]) : null;
	(_data[42]) ? asegurado['apellidoDosConyugue'] = utils.capitalizeText(_data[42]) : null;
	(_data[43]) ? asegurado['centroSaludAdscripcion'] = _data[43] : null;
	(_data[44]) ? asegurado['centroSaludAtencion'] = _data[44] : null;
	(_data[45]) ? asegurado['tipoAsegurado'] = _data[45] : null;
	(_data[46]) ? asegurado['fechaUltimaActualizacionDatosPaciente'] = _data[46] : null;
	(_data[47]) ? asegurado['conocidoComo'] = _data[47] : null;
	(_data[48]) ? asegurado['categoriaGrupoEtnico'] = _data[48] : null;
	(_data[49]) ? asegurado['grupoEtnico'] = _data[49] : null;
	(_data[32] && _data[33]) ? asegurado['libretaPersonaEmergencia'] = AddContactoAgendaPersonaEmerg(_data[32], _data[33]) : null;

	// retorna el asegurado
	return asegurado;

};

/**
 * Función que obtiene informacion del paciente por identificación
 * @param {string[]} argumentos Arreglo de parámetros a enviar al servicio SOAP
 * @param {object} callback Función callback que retorna el resultado
 */
let ObtenerInfoIDE = function (argumentos, res, callback) {

	let exito = true;
	//mensaje de la respuresta
	let mensaje = null;
	//variable que representa el tipo de asegurado 0,6 ó 7
	let tipoIdentificacion = argumentos.tipoIdentificacion;
	//variable que representa la identificacion a consultar
	let identificacionPaciente = parseFloat(argumentos.identificacion);

	// Crea el cliente SOAP que consume el servicio Web del MISE
	soap.createClient(config.ws['mise'].url, opcionesMISE, function (err, client) {
		// Valida si hubo algún tipo de error la conectar el servicio del MISE
		if (err || typeof client === 'undefined') {
			// retorn el error
			return res.status(500).json({
				message: 'Error tratando de acceder al servicio del SIAC.',
				error: err
			});
		}
		// Solicita el servicio para obtener los datos del paciente del SIAC mediante tipo de identificación e identificación
		client.moBuscarEdusSfaTse({
			tipoIdentificacion: tipoIdentificacion,
			identificacion: identificacionPaciente,
			usuario: argumentos.usuario,
			idUnidadProgramatica: argumentos.idUnidadProgramatica,
			idSistema: argumentos.idSistema
		}, function (err2, result) {
			// Valida si hubo algún tipo de error en el inicio de sesión del MISE
			if (err2) {
				// Obtiene el mensaje de error
				exito = false;
				mensaje = err2;
				let respuesta = new HttpResponse(false, 'Se produjo un error en el servicio del SIAC', mensaje);
				return res.status(500).send(respuesta.getJSON());
			}
			// si no se presenta ningun error continua con el procesamiento de la información
			else {
				if (result) {
					// variable para el manejo del array con los datos devueltos por SIAC
					let _data = result.moBuscarEdusSfaTseResult.string;
					// objeto que representa el modelo Asegurado en formato json
					let asegurado = ProcesarDatosAsegurado(_data);
					// se envían los datos al cliente
					exito = true;
					mensaje = 'Se encontraron datos asociados';
					callback(new HttpResponse(exito, mensaje, asegurado));
					// si no encontro el paciente devuelve el error
				} else {
					// Devuelve el mensaje de que no se encontraron datos para la consulta
					exito = false;
					mensaje = 'No existen datos';
					callback(new HttpResponse(exito, mensaje, null));
				}
			}
		}, opcionesMISE);
	});
};

/**
 * Función que obtiene informacion del paciente mediante filtro
 * @param {string[]} argumentos Arreglo de parámetros a enviar al servicio SOAP
 * @param {object} callback Función callback que retorna el resultado
 */
let ObtenerInfoByFiltro = function (argumentos, res, callback) {

	let exito = true;
	//mensaje de la respuresta
	let mensaje = null;

	// Crea el cliente SOAP que consume el servicio Web del MISE
	soap.createClient(config.ws['mise'].url, opcionesMISE, function (err, client) {
		// Valida si hubo algún tipo de error la conectar el servicio del MISE
		if (err || typeof client === 'undefined') {
			// retorn el error
			return res.status(500).json({
				message: 'Error tratando de acceder al servicio del SIAC.',
				error: err
			});
		}
		// Solicita el servicio para obtener los datos del paciente del SIAC mediante filtros
		client.moBuscarNA1A2Ocurrente({
			tipoIdentificacion: argumentos.tipoIdentificacion,
			nombre: argumentos.nombre,
			primerApellido: argumentos.primerApellido,
			segundoApellido: argumentos.segundoApellido,
			sexo: argumentos.sexo
		}, function (err2, result) {
			// Valida si hubo algún tipo de error en el inicio de sesión del MISE
			if (err2) {
				// Obtiene el mensaje de error
				exito = false;
				mensaje = err2;
				let respuesta = new HttpResponse(false, 'Se produjo un error en el servicio del SIAC', mensaje);
				return res.status(500).send(respuesta.getJSON());
			}
			// si no se presenta ningun error continua con el procesamiento de la información
			else {
				if (result) {
					// variable para el manejo del array con los datos devueltos por SIAC
					let _data = [];
					// se realiza validación para que siempre _data sea Array debido a que en el caso de que solo exista un resultado el servicio devuelve un string
					if (Array.isArray(result.moBuscarNA1A2OcurrenteResult.string)) {
						_data = result.moBuscarNA1A2OcurrenteResult.string;
					} else {
						_data.push(result.moBuscarNA1A2OcurrenteResult.string);
					}


					// objeto que representa el modelo Asegurado en formato json
					let asegurados = [];
					// se procesan los resultados string para convertirlos a Array y luego se convierten a objetos json
					_data.forEach(element => {
						asegurados.push(ProcesarDatosAsegurado(Split(element, '|')));
					});

					// se envían los datos al cliente
					exito = true;
					mensaje = 'Se encontraron datos asociados';
					callback(new HttpResponse(exito, mensaje, asegurados));
				} else {
					// Obtiene el mensaje de que no se encontraron registros 
					exito = false;
					mensaje = 'No existen datos';
					callback(new HttpResponse(exito, mensaje, null));
				}
			}
		}, opcionesMISE);
	});
};

/**
 * aseguradosSearchController.js
 *
 * @description :: Server-side logic for managing logins.
 */
module.exports = {
	/**
	 * Permite realizar búsqueda mediante identificación y tipo de identificación
	 * aseguradosSearchController.showByID
	 */
	showByID: function (req, res) {

		// Arreglo de parametros a enviar para las consultas
		let argumentos = {
			tipoIdentificacion: req.params.tipoIdentificacion,
			identificacion: req.params.identificacion,
			usuario: req.userArcaRequest.user.usuario,
			idUnidadProgramatica: req.userArcaRequest.up.idUP,
			idSistema: 13
		};
		/** Método para gestionar la consulta  */
		ObtenerInfoIDE(argumentos, res, function (resultPaciente) {
			// Se obtiene la data y se envia del SIAC
			res.send(resultPaciente.getJSON());
		});
	},

	/**
	 * Permite realizar búsqueda mediante tipo de identificación, nombre, primerApellido, segundoApellido
	 * aseguradosSearchController.showByFilter
	 */
	showByFilter: function (req, res) {

		// Arreglo de parametros a enviar para las consultas verifica que los parametros no vengan en nulo
		let argumentos = {
			tipoIdentificacion: req.params.tipoIdentificacion,
			nombre: (req.params.nombre),
			primerApellido: (req.params.primerApellido),
			segundoApellido: (req.params.segundoApellido === 'null') ? '' : (req.params.segundoApellido),
			sexo: req.params.sexo
		};
		/** Método para gestionar la consulta  */
		ObtenerInfoByFiltro(argumentos, res, function (resultPaciente) {
			// Se obtiene la data y se envia del SIAC
			res.send(resultPaciente.getJSON());
		});
	}
};
