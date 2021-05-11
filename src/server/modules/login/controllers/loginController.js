// Definición para el fichero loginController.js v12.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD del LOGIN para interactuar la base de datos mongo.
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluyen módulos a utilizar
const async = require('async'); // Módulo async para manejo solicitudes asincronas
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../shared/interfaces/httpResponse');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../shared/services/utilidadesService');
// Importación del servicio para el manejo de tokens (JWT)
const tokenService = require('./../../shared/services/jsonWebTokenService');
// Se importa el servicio del MISE
const miseService = require('./../../shared/services/miseService');
// Se importa el controlador de los parámetros
const parametrosController = require('./../../admin/parametros/controllers/parametrosController');

// Se incluyen los modelos necesarios para mongoose
const aplicacionModel = require('./../../admin/catalogos/models/aplicacionesArcaModel');
const usuarioModel = require('./../../admin/usuarios/main/models/usuariosModel');
const personaModel = require('./../../shared/personas/models/personasModel');
const permisosModel = require('./../../admin/catalogos/models/permisosModel');
const permisosUsuariosModel = require('./../../admin/usuarios/permisos/models/permisosModel');
const tiposIdentificacionModel = require('./../../admin/catalogos/models/tiposIdentificacionModel');
const parametrosModel = require('./../../admin/parametros/models/parametrosModel');
const unidadProgramaticaModel = require('./../../admin/catalogos/models/unidadesProgramaticasModel');
const preferenceModel = require('./../../admin/usuarios/preferencias/models/preferenciasModel');

// Se incluye el enumerador de los servicios MISE
const enumMISE = require('./../../shared/enums/mise-servicios');

// Obtiene las variables de configuración según entorno
const config = require('./../../../config/config')[process.env.NODE_ENV];

/**
 * Función que obtiene el parámetro dque indica si el inicio se sesión se hace a traves
 * del MISE o no
 * @param {object} idAPP Parámetro que indica el id de la aplicación actual
 * @param {object} callback Función callback que retorna el resultado
 */
let ObtenerParametroTipoInicioSesion = function (idAPP, callback) {
	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _where = {
		nombre: 'esInicioSesionMISE',
		aplicacion_id: idAPP,
		estado: true
	};
	// Se busca la info del parámetro
	parametrosModel.findOne(_where, function (err, parametro) {
		// Se valida si hubo un error
		if (err) {
			// Si no se obtiene respuesta; por default se retorna VERDADERO (true)
			callback(null, true);
			return;
		} else {
			// Retorna el dato del parámetro
			callback(null, (parametro) ? (/1/i).test(parametro.valor) : true);
			return;
		}
	});
};

/**
 * Función que busca el id asociado a la unidad programática
 * @param {number} idUP Identificador numérico de la unidad programática
 * @param {object} callback Función callback que retorna el resultado
 */
let ObtenerIdUnidadProgramatica = function (idUP, callback) {
	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _where = {
		'idUP': idUP
	};

	// Se busca la info de la unidad propgramática
	unidadProgramaticaModel.findOne(_where, function (err, up) {
		if (err) {
			// Se establece un objeto de tipo HttpResponse indicando un error
			const resp = new HttpResponse(false, 'No se pudo obtener los datos de la unidad programática (ID).', null);

			// SE DEBE RETORNAR EL MENSAJE INDICANDO ERROR
			// (ERROR PARA OBTENER LOS DATOS)
			callback(resp);
			return;
		} else {
			// Retorna los datos de la aplicación
			callback(null, up._id);
			return;
		}
	});
};

/**
 * Función que busca el id asociado a la aplicación actual
 * @param {string} nombreApp Nombre de la aplicación actual
 * @param {object} callback Función callback que retorna el resultado
 */
let ObtenerIdAplicacionArcaActual = function (nombreApp, callback) {
	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _where = {
		'idApp': nombreApp
	};

	// Se busca la info de la aplicación actual
	aplicacionModel.findOne(_where, function (err, app) {
		if (err) {
			// Se establece un objeto de tipo HttpResponse indicando un error
			const resp = new HttpResponse(false, 'No se pudo obtener los datos de la aplicación arca.', null);

			// SE DEBE RETORNAR EL MENSAJE INDICANDO ERROR
			// (ERROR PARA OBTENER LOS DATOS)
			callback(resp);
			return;
		} else {
			// Retorna los datos de la aplicación
			callback(null, app._id);
			return;
		}
	});
};

/**
 * Función que busca la información del usuario en la base de datos local
 * @param {string[]} args Arreglo de parámetros
 * @param {boolean} esMISE Indica si la aplicación esta usando la validación por MISE
 * @param {object} callback Función callback que retorna el resultado
 */
let ObtenerUsuarioArcaSeguridad = function (args, esMISE, callback) {
	// Variable que establece los campos a retornar en la consulta (SELECT)
	const _select = {
		persona_id: true, // Validación para que se incluyan este campo en la respuesta
		usuario: true,
		esMise: true,
		password: true,
		estado: true
	};

	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _where = {
		usuario: args.usuario
	};

	// Se crea un objeto JSON que contenga la respuesta con los datos del usuario y persona
	let userPerson = {
		usuario_id: null,
		persona_id: null,
		usuario: args.usuario,
		aplicacion_id: args.app,
		unidadProgramatica_id: args.up,
		esMise: null,
		nombreCompleto: null,
		permisos: null
	};

	// Busca los datos del usuario en la base de datos de seguridad
	// Una vez obtenido el resultado (si no existen datos retorna NULO) se envia a la función callback
	usuarioModel.findOne(_where, _select).populate({
		path: 'persona_id',
		model: personaModel
	}).exec(function (err, usuario) {
		if (err) {
			// Se establece un objeto de tipo HttpResponse indicando un error
			const resp = new HttpResponse(false, 'No se pudo obtener los datos del usuario local arca.', {
				credencialesInvalidas: true
			});

			// SE DEBE RETORNAR EL MENSAJE INDICANDO EL ERROR CON LAS CREDENCIALES
			// (ERROR PARA OBTENER LOS DATOS)
			callback(resp);
			return;
		} else {
			// Se valida si el usuario existe en la base de datos local
			if (usuario) {
				// Se valida si existe la contraseña (por default los usuarios nuevos NO POSEEN CONTRASEÑA)
				// Todo usuario sin contraseña indica que NO HA ACCEDIDO A LA APLICACION NUNCA
				if (!esMISE && usuario.password !== null && usuario.password !== utils.generateSHA256(args.clave)) {
					// Se establece un objeto de tipo HttpResponse indicando un error
					const resp = new HttpResponse(false, 'Las contraseña indicada es inválida.', {
						credencialesInvalidas: true
					});

					// SE DEBE RETORNAR EL MENSAJE INDICANDO EL ERROR CON LAS CREDENCIALES
					// (CONTRASEÑA INVALIDA)
					callback(resp);
					return;
				} else {
					// Se valida si el usuario esta deshabilitado y si la validación es SIN MISE, SOLO LOCAL
					if (!esMISE && !usuario.estado) {
						// Al ser una validación contra la base local y al estar deshabilitado es un indicativo
						// de que el usuario esta bloqueado en MISE o se deshabilito localmente por un administrador
						// Se establece un objeto de tipo HttpResponse indicando un error
						const resp = new HttpResponse(false, 'Su usuario se encuentra deshabilitado o bloqueado en MISE.', {
							usuarioBloqueado: true
						});

						// SE DEBE RETORNAR EL MENSAJE INDICANDO EL ERROR CON LAS CREDENCIALES
						// (CONTRASEÑA INVALIDA)
						callback(resp);
						return;
					} else {
						// Variable que establece los campos a retornar (SELECT)
						const _select = {
							_id: false,
							permiso_id: true
						};

						// Variable que establece el filtro de la consulta a la base de datos (WHERE)
						const _where = {
							usuario_id: usuario._id,
							unidadProgramatica_id: args.up,
							'$and': [{
								'$or': [
									{ aplicacion_id: '5a8c62efc4560fa41a3797be' }, // Id aplicación BASE
									{ aplicacion_id: args.app } // Aplicación actual
								]
							}]
						};

						// Se llama al modelo de permisos para buscar los datos de permisos y paths
						permisosUsuariosModel.find(_where, _select)
							.populate({
								path: 'permiso_id',
								model: permisosModel,
								select: 'idPermiso'
							}).exec((err, _permisos) => {
								if (err) {
									// Se establece un objeto de tipo HttpResponse indicando un error
									const resp = new HttpResponse(false, 'No se pudo obtener los datos de los perfiles del usuario.', null);
									// SE DEBE RETORNAR EL MENSAJE INDICANDO EL ERROR CON LAS CREDENCIALES
									// (CONTRASEÑA INVALIDA)
									callback(resp);
									return;
								}

								// Valida si el usuario posee permisos bajo el criterio:
								// * Si la validación es solo LOCAL; es decir, NO SE HACE CONTRA MISE
								// * Si NO existen permisos locales (al no ser por MISE ni poseer permisos locales)
								// * Si el usuario NO fuese el super usuario
								if (!esMISE && _permisos.length === 0 && usuario.usuario !== 'arcasuper') {
									// Se establece un objeto de tipo HttpResponse indicando un error
									const resp = new HttpResponse(false, 'El usuario NO posee permisos para la unidad programática.', null);
									// SE DEBE RETORNAR EL MENSAJE INDICANDO EL ERROR CON LAS CREDENCIALES
									// (CONTRASEÑA INVALIDA)
									callback(resp);
									return;
								}

								// Se establece la respuesta con los datos del usuario y persona
								userPerson.usuario_id = usuario._id;
								userPerson.persona_id = usuario.persona_id.id;
								userPerson.esMise = usuario.esMise;
								userPerson.nombreCompleto = usuario.persona_id.nombre + ' ' + usuario.persona_id.apellido1 + ' ' + usuario.persona_id.apellido2;
								// Se mapean los permisos para dejarlos en un arreglo más simple
								userPerson.permisos = _permisos.map((permiso, _index) => {
									return {
										_id: permiso.permiso_id._id,
										nombre: permiso.permiso_id.idPermiso
									};
								});

								// Retorna los datos del usuario
								callback(null, userPerson);
								return;
							});
					}
				}
			} else {
				// Retorna NULO al no existir pero el flujo debe continuar
				callback(null, null);
				return;
			}
		}
	});
};

/**
 * Función que se encarga de validar y unificar los datos del usuario obtenidos del MISE y 
 * de la base de datos de seguridad del arca
 * @param {string[]} args Arreglo de parámetros con los datos del usuario que loguea
 * @param {object} datosMISE Representa los datos de la sesión a nivel MISE del usuario (incluyendo permisos)
 * @param {object} datosARCA Representa los datos del usuario obtenidos desde la base de datos de seguridad del arca
 * @param {object} callback Función callback que retorna el resultado
 */
let ValidarDatosIngresoUsuario = function (args, datosMISE, datosARCA, callback) {
	// Valida que existan datos presentes al menos uno para permitir la conexión
	if ((datosMISE.sesion === null && datosMISE.permisos === null) && datosARCA === null) {
		let mensaje = 'No se pudo establecer una conexión al sistema.<br>';
		mensaje += 'Posibles causas:<br>';
		mensaje += '<ul><li>Datos de usuario y contraseña incorrectos.</li>';
		mensaje += '<li>El servicio MISE no esta disponible (y no hay un registro local de su usuario).</li>';
		mensaje += '<li>Su usuario NO existe en MISE ni tampoco localmente.</li>';
		mensaje += '<li>Su usuario se encuentra BLOQUEADO en MISE.</li></ul>';
		// Se establece un objeto de tipo HttpResponse indicando el error y se envia al callback
		callback(new HttpResponse(false, mensaje, null));
		return;
	}

	// Crea un hash para la contraseña
	const pass = utils.generateSHA256(args.clave);

	// Se valida si hay datos ARCA para ACTUALIZAR la información
	if (datosARCA) {
		// Variable que establece los campos a los cuales se le actualizará la información
		const _set = {
			$set: {
				password: pass,
				ultimoCambioPassword: utils.localDateToUTC(new Date()),
				estado: true
			}
		};

		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: datosARCA.usuario_id
		};

		// Mediante el modelo se actualizan los datos del usuario
		usuarioModel.updateOne(_where, _set, {
			new: false
		}, function (err, _resultado) {
			if (err) {
				// Se establece un objeto de tipo HttpResponse indicando el error y se envia al callback
				callback(new HttpResponse(false, 'No se pudo realizar el proceso de actualizar el usuario.', null));
				return;
			}

			// Datos de retorno
			const dataUsuario = {
				_id: datosARCA.usuario_id,
				usuario: datosARCA.usuario,
				nombre: datosARCA.nombreCompleto
			};

			// Retorna los datos del usuario para el PAYLOAD
			callback(null, dataUsuario);
			return;
		});
	} else {
		// Se establece el proceso de INSERTAR un nuevo usuario
		// Variable que almacenara la información del tipo de identificación
		let _tipoIdentificacion = null;
		// Variable que almacena los datos del medio de contacto
		const _mediosContacto = datosMISE.sesion.usuario.correoElectronico ? [{
			tipoMedioContacto_id: {
				_id: '5a8c634d329037a9f0e97a26',
				descripcion: 'Correo electrónico'
			},
			descripcion: datosMISE.sesion.usuario.correoElectronico
		}] : null;

		// Busca la información del catalogo
		tiposIdentificacionModel.find({}, function (err, catalogo) {
			if (err) {
				// Se establece un objeto de tipo HttpResponse indicando el error y se envia al callback
				callback(new HttpResponse(false, 'No se pudo realizar el proceso de creación del usuario.', null));
				return;
			}

			// Se valida y se busca el tipo de identificación que corresponde
			catalogo.some((tipo) => {
				if (tipo.idSIAH === datosMISE.sesion.usuario.tipoIdentificacion.tipo) {
					// Asigna los valores del catálogo a la variable local
					_tipoIdentificacion = {
						_id: tipo._id,
						descripcion: tipo.descripcion,
					};
					// Retorna verdadero para salir del ciclo
					return true;
				}
			});

			// Se establecen los valores de la persona
			var personaMdl = {
				tipoIdentificacion_id: _tipoIdentificacion,
				identificacion: datosMISE.sesion.usuario.numeroIdentificacion,
				nombre: datosMISE.sesion.usuario.nombre,
				apellido1: datosMISE.sesion.usuario.primerApellido,
				apellido2: datosMISE.sesion.usuario.segundoApellido,
				mediosContacto: _mediosContacto,
				esUsuarioArca: true,
				logs: {
					created: {
						usuario: datosMISE.sesion.usuario.codigo,
						nombre: datosMISE.sesion.usuario.nombre + ' ' + datosMISE.sesion.usuario.primerApellido + ' ' + datosMISE.sesion.usuario.segundoApellido
					}
				}
			};
			let _where = {
				identificacion: datosMISE.sesion.usuario.numeroIdentificacion
			};
			// Se agregan los datos en la colección de personas
			personaModel.findOneAndUpdate(_where, personaMdl, {
				upsert: true
			}, function (err, _persona) {
				if (err) {
					// Se establece un objeto de tipo HttpResponse indicando el error y se envia al callback
					callback(new HttpResponse(false, 'Error agregando los datos de la persona.', null));
					return;
				}

				// Si todo anduvo bien se obtiene el id de la persona recién creada para
				// agregarlo a la colección de usuarios
				// Se establecen los valores del usuario
				var usuarioMdl = new usuarioModel({
					persona_id: _persona.id,
					usuario: datosMISE.sesion.usuario.codigo,
					password: pass,
					esMise: true,
					ultimoCambioPassword: utils.localDateToUTC(new Date()),
					estado: true
				});

				// Guarda los datos en la BD
				usuarioMdl.save(function (err, _usuario) {
					if (err) {
						// Se establece un objeto de tipo HttpResponse indicando el error y se envia al callback
						callback(new HttpResponse(false, 'Error agregando los datos del usuario.', null));
						return;
					}

					// Datos de retorno
					const dataUsuario = {
						_id: _usuario._id,
						usuario: datosMISE.sesion.usuario.codigo,
						nombre: datosMISE.sesion.usuario.nombre + ' ' + datosMISE.sesion.usuario.primerApellido + ' ' + datosMISE.sesion.usuario.segundoApellido
					};

					// Retorna los datos del usuario para el PAYLOAD
					callback(null, dataUsuario);
					return;
				});
			});
		});
	}
};

/**
 * Función encargada de actualizar el catálogo de permisos ubicado en la base de datos
 * del arca.bcore
 * @param {string} appId Identificador de la aplicación 
 * @param {string} usuarioId Id del usuario actual
 * @param {object} datosMISE Representa los datos obtenidos del mise
 * @param {object} callback Función callback que retorna el resultado
 */
let ActualizarCatalogoPermisos = function (appId, usuarioId, datosMISE, callback) {
	// Se establecen como constantes los datos del usuario
	const _usuario = {
		usuario_id: usuarioId,
		usuario: datosMISE.sesion.usuario.codigo,
		nombre: datosMISE.sesion.usuario.nombre + ' ' + datosMISE.sesion.usuario.primerApellido + ' ' + datosMISE.sesion.usuario.segundoApellido
	};

	// Recorre la lista de permisos del MISE
	// Función que ejecuta de forma sincrona funciones asincronas en un bucle(for, foreach, while); en este caso las de mongoose
	async.eachSeries(datosMISE.permisos, function (_permiso, _callback2) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: appId,
			idPermiso: _permiso
		};

		// Filtra el catálogo de permisos en caso de existir o no el permiso para la aplicación
		permisosModel.findOne(_where, function (err, permisoLocal) {
			// Valida si ocurrio un error
			if (err) {
				_callback2(err, null);
				return;
			}

			// Valida si existe o no el permiso para la aplicacion
			if (permisoLocal) {
				// Establece los datos del log
				let _logs = { modified: _usuario };
				_logs.modified['fecha'] = utils.localDateToUTC(new Date());
				// Si existe actualiza su estado como activo localmente
				permisoLocal.set({
					estado: true,
					logs: _logs
				});
			}
			else {
				// Establece los datos del log
				let _logs = { created: _usuario };
				// Si NO existe crea el documento
				permisoLocal = new permisosModel();
				// Establece los datos
				permisoLocal.set({
					aplicacion_id: appId,
					idPermiso: _permiso,
					nombre: 'MISE - ' + utils.capitalizeText(_permiso),
					descripcion: 'Permiso proveniente del MISE.',
					estado: true,
					esLocal: false, // Indicador de permiso NO LOCAL
					logs: _logs
				});
			}

			// Realiza el proceso de insertar /actualizar en el catálogo
			permisoLocal.save(function (err, _permisoLocal) {
				if (err) {
					_callback2(err, null);
					return;
				}
				// Retorna nulo como exitoso 
				_callback2(null);
				return;
			});
		});
	}, function (error) {
		// Valida si hubo errores en el ciclo
		if (error) {
			callback(error, null);
			return;
		}

		// Retorna nulo como exitoso 
		callback(null);
		return;
	});
};

/**
 * Función encargada de actualizar el catálogo de permisos para el usuario actual ubicado en la base de datos
 * del arca.bcore
 * @param {string} appId Identificador de la aplicación 
 * @param {string} usuarioId Id del usuario actual
 * @param {string} upId Id de la unidad programática actual
 * @param {object} datosMISE Representa los datos obtenidos del mise
 * @param {object} callback Función callback que retorna el resultado
 */
let ActualizarPermisosUsuario = function (appId, usuarioId, upId, datosMISE, callback) {
	// Variables para el manejo de los datos entre pasos
	var permisosCatalogo = null;
	var permisosMISE = [];
	var permisosUsuarioLocal = null;
	// Variable que almacenara los permisos actualizados
	// var permisosUsuarioActualizados = null;
	// Variables para las lista de documentos a CREAR y ELIMINAR
	var listaNuevos = [];
	var listaEliminar = [];

	// Se realiza la ejecución de las funciones asincronas de forma sincrona
	// (IMPORTANTE: El primer parámetro que se envia a las funciones callback cuando NO es nulo indica un ERROR)
	async.waterfall([
		// PASO #1 -> Obtener los permisos del CATALOGO local (por aplicativo) para conocer sus Id's
		function (_callback) {
			// Variable que establece el filtro de la consulta a la base de datos (WHERE)
			const _where = {
				aplicacion_id: appId
			};

			// Obtiene el catálogo
			permisosModel.find(_where, function (error, permisos) {
				if (error) {
					_callback(error, null);
					return;
				}

				// Retorna la lista de permisos
				_callback(null, permisos);
				return;
			});
		},
		// PASO #2 -> Obtener los permisos del USUARIO (por aplicativo y unidad) para conocer sus Id's
		function (_permisos, _callback) {
			// Almacena los datos obtenidos de los permisos del catálogo (PASO #1)
			permisosCatalogo = _permisos;

			// Variable que establece el filtro de la consulta a la base de datos (WHERE)
			const _where = {
				aplicacion_id: appId,
				usuario_id: usuarioId,
				unidadProgramatica_id: upId
			};

			// Obtiene el catálogo
			permisosUsuariosModel.find(_where, function (error, permisos) {
				if (error) {
					_callback(error, null);
					return;
				}

				// Retorna la lista de permisos
				_callback(null, permisos);
				return;
			});
		},
		// PASO #3 -> Comparar los permisos del usuarios vrs. los permisos MISE
		function (_permisos, _callback) {
			// Almacena los datos obtenidos de los permisos del usuario (PASO #2)
			permisosUsuarioLocal = _permisos;

			// Se recorren los permisos dados por el MISE para el usuario
			datosMISE.permisos.forEach(_permiso => {
				// Se recorren los permisos del catálogo ARCA para buscar el equivalente
				permisosCatalogo.some(element => {
					// Valida el permiso
					if (element.idPermiso === _permiso) {
						// Asigna el permiso ARCA al arreglo de permisos MISE
						permisosMISE.push(element);
						// Retorna verdadero para salir
						return true;
					}
				});
			});

			// Se recorre la lista de permisos MISE
			permisosMISE.forEach(_permisoMise => {
				// Recorre la lista de permisos del usuario y determinar los permisos nuevos
				// Y valida si NO existe
				if (!permisosUsuarioLocal.some(_permisoLocal => {
					return _permisoLocal.permiso_id.equals(_permisoMise._id);
				})) {
					// Como NO existe se agrega a la lista de NUEVOS
					listaNuevos.push(_permisoMise);
				}
			});

			// Ahora se recorre la lista de permisos actuales
			permisosUsuarioLocal.forEach(_permisoLocal => {
				// Recorre la lista de permisos MISE y determinar los permisos que ya no existen
				if (!permisosMISE.some(_permisoMise => {
					return _permisoMise._id.equals(_permisoLocal.permiso_id);
				})) {
					// Como NO existe se agrega a la lista de ELIMINAR
					listaEliminar.push(_permisoLocal);
				}
			});

			// Retorna nulo como exitoso
			_callback(null);
		},
		// PASO #4 -> Inserta en la colección de permisos para el usuario
		function (_callback) {
			// Función que ejecuta de forma sincrona funciones asincronas en un bucle(for, foreach, while); en este caso las de mongoose
			async.eachSeries(listaNuevos, function (_permiso, _callback2) {
				// Variable que crea un objeto de tipo permisosUsuarioModel
				let permisoUsuario = new permisosUsuariosModel();
				// Se establecen los datos
				permisoUsuario.set({
					usuario_id: usuarioId,
					aplicacion_id: appId,
					unidadProgramatica_id: upId,
					permiso_id: _permiso._id
				});
				// Se guardan los datos
				permisoUsuario.save(function (error, _permisoNuevo) {
					if (error) {
						_callback(error, null);
						return;
					}
					// Si todo bien continua con el callback del loop
					_callback2(null);
					return;
				});
			}, function (error) {
				// Valida si hubo errores en el ciclo
				if (error) {
					callback(error, null);
					return;
				}

				// Retorna nulo como exitoso 
				_callback(null);
				return;
			});
		},
		// PASO #5 -> Elimina en la colección de permisos para el usuario
		function (_callback) {
			// Función que ejecuta de forma sincrona funciones asincronas en un bucle(for, foreach, while); en este caso las de mongoose
			async.eachSeries(listaEliminar, function (_permiso, _callback2) {
				// Variable que establece el filtro de la consulta a la base de datos (WHERE)
				const _where = {
					_id: _permiso._id
				};

				// Se eliminan los datos
				permisosUsuariosModel.findByIdAndRemove(_where, function (error) {
					if (error) {
						_callback2(error, null);
						return;
					}
					// Si todo bien continua con el callback del loop
					_callback2(null);
					return;
				});
			}, function (error) {
				// Valida si hubo errores en el ciclo
				if (error) {
					_callback(error, null);
					return;
				}

				// Retorna nulo como exitoso 
				_callback(null);
				return;
			});
		}
	], function (error, success) {
		if (error) {
			callback(error, null);
			return;
		}

		// Retorna la lista de permisos
		callback(null, success);
		return;
	});
};

/**
 * Función que se encarga de realizar la actualización de los permisos provenientes del MISE; tanto en el catálogo
 * local como para el usuario
 * @param {string[]} args Arreglo de parámetros con los datos del usuario que loguea
 * @param {object} appId Representa el ObjectId de la aplicación actual
 * @param {object} upId Representa el ObjectId de la unidad programática actual
 * @param {object} usuarioId Representa el ObjectId del usuario actual
 * @param {object} datosMISE Representa los datos de la sesión a nivel MISE del usuario (incluyendo permisos)
 * @param {object} datosARCA Representa los datos del usuario obtenidos desde la base de datos de seguridad del arca
 * @param {object} callback Función callback que retorna el resultado
 */
let ProcesoActualizarPermisosMISE = function (args, appId, upId, usuarioId, datosMISE, datosARCA, callback) {
	// Se validan si existen datos del MISE ya que son necesario para actualizar los datos locales
	if (datosMISE.sesion && datosMISE.permisos) {
		// Actuliza los permisos locales para la aplicacion
		ActualizarCatalogoPermisos(appId, usuarioId, datosMISE, function (error) {
			// Valida si hubno errores
			if (error) {
				callback(error, null);
				return;
			}

			// Lo que prosigue es actualizar los permisos para el usuario
			// (agregar y/o quitar según los que tenga actualmente)
			ActualizarPermisosUsuario(appId, usuarioId, upId, datosMISE, function (error) {
				// Valida si hubno errores
				if (error) {
					callback(error, null);
					return;
				}

				// Por último se vuelven a "jalar" todos los permisos del usuario
				// y se cargan a la variable que retorna la información
				ObtenerUsuarioArcaSeguridad({
					usuario: args.usuario,
					clave: args.clave,
					up: upId,
					app: appId
				}, false, function (err, datosUsuario) {
					if (err) {
						callback(err, null);
						return;
					}
					// Retorna los datos del usuario
					callback(null, datosUsuario);
					return;
				});
			});
		});
	} else {
		// Al no haber datos MISE se debe retornar los datos del usuario local arca
		// Retorna a la función callback
		callback(null, datosARCA);
		return;
	}
};

/**
 * Función que se encarga de obtener las preferencias de usuario para la aplicación actual
 * @param {object} appId Representa el ObjectId de la aplicación actual
 * @param {object} datosUsuario Parámetro que contiene los datos del usuario
 * @param {object} callback Función callback que retorna el resultado
 */
let ObtenerPreferenciasUsuario = function (appId, datosUsuario, callback) {
	// Variable que establece los campos a obetner en la consulta(SELECT)
	const _select = {
		aplicacion_id: false,
		usuario_id: false
	};

	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _where = {
		aplicacion_id: appId,
		usuario_id: datosUsuario.usuario_id
	};

	// Se establece las preferencias en NULO inicialmente
	datosUsuario.preferencias = null;

	// Obtiene el catálogo
	preferenceModel.findOne(_where, _select, function (error, preferencias) {
		// Si ocurre un error se continua el flujo ya que las preferencias no son criticas
		if (error) {
			// Llama a la función de retorno
			callback(null, datosUsuario);
			return;
		}

		// Se establece las preferencias obtenidas
		datosUsuario.preferencias = (preferencias) ? preferencias : null;

		// Retorna los datos del usuario
		callback(null, datosUsuario);
		return;
	});
};

/**
 * loginController.js
 *
 * @description :: Server-side logic for managing logins.
 */
module.exports = {
	/**
	 * loginController.update()
	 * @description Valida las credenciales del usuario
	 */
	update: function (req, res) {
		//Se valida que existan los datos minimos para iniciar sesión
		if (!req.body.usuario ||
			!req.body.clave ||
			!req.body.idUnidadProgramatica ||
			(!req.body.idUnidadProgramatica._id &&
				!req.body.idUnidadProgramatica.idUP)) {
			// Se crea un mensaje para responder la validación
			const resp = new HttpResponse(false, 'No se puede iniciar sesión en la plataforma ya que no están los datos mínimos requeridos.', null);
			// Se retorna el mensaje de respuesta
			return res.status(500).send(resp.getJSON());
		}
		// Se valida la ruta de donde proviene la solicitud y determinar asi el tipo de respuesta del proceso
		// Cuando el path contiene en su ruta auth-arca quiere decir que esta iniciando sesión atravez de otra aplicación
		// diferente al login de la plataforma Arca - MEAN por lo que le respuesta se dará por medio de un JWT; en caso contrario
		// la respuesta se da en formato JSON.
		const esRespuestaJWT = (req.path.search('/auth-arca') >= 0) ? true : false;

		// Se obtiene la ip del cliente
		const ipHost = utils.ipHostClient(req);
		// Arreglo de parametros a enviar para las consultas
		let args = {
			usuario: req.body.usuario,
			clave: req.body.clave,
			idUnidadProgramatica: req.body.idUnidadProgramatica.idUP,
			ip: ipHost,
			sistema: config.ws.mise.sistema
		};
		// Variables gloables con ID's MONGO
		let _APP = null; // Almacena el id de la aplicación
		let _UP = null; // Almacena el id de la unidad programática

		// Variable para indicar si el sistema arrancará con validación de credenciales
		// por medio de MISE
		let _MISE = null;

		// Variable que contendra el resultado de las consultas hechas al MISE
		let usuarioMISE = {
			sesion: null,
			permisos: null
		};

		// Variable que contendra el resultado de las consultas hechas al ARCA
		let usuarioARCA = null;
		let datosUsuarioPAYLOAD = null;
		let usuarioConexion = null;

		// Se realiza la ejecución de las funciones asincronas de forma sincrona
		// (IMPORTANTE: El primer parámetro que se envia a las funciones callback cuando es nulo indica un ERROR)
		async.waterfall([
			function (callback) {
				// Se valida si existe el ID mongo de la unidad programática
				if (req.body.idUnidadProgramatica.idUP && !req.body.idUnidadProgramatica._id) {
					// Ejecuta el método que obtiene el ID mongo de la unidad programática
					ObtenerIdUnidadProgramatica(req.body.idUnidadProgramatica.idUP, callback);
				} else {
					// Llama a la función callbak para que continu el proceso y envia el ID mongo de la UP
					callback(null, req.body.idUnidadProgramatica._id);
					return;
				}
			},
			function (idUnidadProgramatica, callback) {
				// Asigna el id mongo de la unidad programática
				_UP = idUnidadProgramatica;
				// Llama a la función que se encarga de obtener el dato del id de la aplicación actual
				ObtenerIdAplicacionArcaActual(req.params.app, callback);
			},
			function (idApp, callback) {
				// Almacena el dato del id de la aplicación
				_APP = idApp;
				// Llama a la función que se encarga de obtener el parámetro que indica
				// el tipo de inicio de sesión (con o sin MISE)
				ObtenerParametroTipoInicioSesion(_APP, callback);
			},
			function (esInicioPorMise, callback) {
				// Obtiene el parámetro que indica TRUE/FALSE
				_MISE = esInicioPorMise;
				// Valida si es necesario "arrancar" con MISE
				if (_MISE) {
					// Se establece los datos para ejecutar el llamado al servicio MISE
					const params =
						'identificadorUsuario=' + args.usuario +
						'&clave=' + Buffer.alloc(args.clave.length, args.clave).toString('base64') +
						'&codigoSistema=' + args.sistema +
						'&codigoUnidadEjecutora=' + args.idUnidadProgramatica +
						'&estacionTrabajo=' + args.ip;

					// Se manda a llamar al servicio MISE
					miseService.login(params, args.usuario, function (error, resp) {
						// Valida algún error
						if (error) {
							// Retorna el error específico
							callback(error);
							return;
						}
						// Retorna la respuesta
						callback(null, resp);
						return;
					});
				} else {
					// Se llama a la función callback y se envía nulo para
					// que continue el flujo
					callback(null, null);
					return;
				}
			},
			function (datosSesionMISE, callback) {
				// Obtiene los datos de sesión del MISE
				usuarioMISE.sesion = datosSesionMISE;

				// Valida si es necesario "arrancar" con MISE
				if (_MISE) {
					// Se establece los datos  para ejecutar el llamado al servicio MISE
					const params =
						'identificadorUsuario=' + args.usuario +
						'&codigoSistema=' + args.sistema +
						'&codigoUnidadEjecutora=' + args.idUnidadProgramatica;

					// Se manda a llamar al servicio MISE
					miseService.execute(enumMISE.PERFILES, params, null, function (error, resp) {
						// Valida algún error
						if (error) {
							// Retorna el error específico
							callback(error);
							return;
						}
						// Retorna la respuesta
						callback(null, resp);
						return;
					});
				} else {
					// Se llama a la función callback y se envía nulo para
					// que continue el flujo
					callback(null, null);
					return;
				}
			},
			function (perfilMISE, callback) {
				// Valida si el objeto que contiene los perfiles viene como STRING
				// para convertirlo a JSON.
				if (Object.prototype.toString.call(perfilMISE) === '[object String]') {
					perfilMISE = utils.jsonize(perfilMISE.replace(/[\s+.*+?^$|\\]/g, ''));
				}

				// Valida si es necesario "arrancar" con MISE
				// y si existen perfiles de MISE
				if (_MISE && perfilMISE && perfilMISE.perfiles.length > 0) {
					// Variable que contendra la lista de permisos
					let listaPermisos = [];

					// Se recorre la lista de perfiles para obtener los permisos de cada uno
					async.eachSeries(perfilMISE.perfiles, function (perfil, callback2) {
						// Se establece los datos para ejecutar el llamado al servicio MISE
						const params =
							'codigoSistema=' + args.sistema +
							'&codigoPerfil=' + perfil.codigo;

						// Se manda a llamar al servicio MISE
						miseService.execute(enumMISE.PERMISOS, params, null, function (error, resp) {
							// Valida si existe un error
							if (error) {
								callback(error);
								return;
							}
							// Se recorre la lista de restricciones dada por MISE
							resp.restricciones.forEach(res => {
								// Se valida si el recurso esta habilitado para el perfil (indicadorOpcion)
								// Los estados son: 1=habilitado/otro=no habilitado
								if (res.indicadorOpcion === 1) {
									//res.recurso.codigo;
									listaPermisos.push(res.recurso.nombreProgramacion);
								}
							});
							// LLama a la función callback para continuar el ciclo
							callback2();
							return;
						});
					}, function (err) {
						// Valida si existe un error
						if (err) {
							callback(err);
							return;
						}

						//LLama al callback principal y le envia todos los permisos obtenidos
						callback(null, listaPermisos);
						return;
					});
				} else {
					// Se llama a la función callback y se envía nulo para
					// que continue el flujo
					callback(null, null);
					return;
				}
			},
			function (permisosMISE, callback) {
				// Obtiene los datos de los permisos del MISE
				usuarioMISE.permisos = permisosMISE;

				// Llama a la función que obtiene los datos del usuario de la base de datos local (mientras exista)
				ObtenerUsuarioArcaSeguridad({
					usuario: req.body.usuario,
					clave: req.body.clave,
					up: _UP,
					app: _APP
				}, _MISE, callback);
			},
			function (datosUsuarioARCA, callback) {
				// Obtiene los datos del usuario arca
				usuarioARCA = datosUsuarioARCA;
				// Con los datos del usuario (del MISE y del Arca) se procede a validar
				ValidarDatosIngresoUsuario(args, usuarioMISE, datosUsuarioARCA, callback);
			},
			function (payloadUsuario, callback) {
				// Obtiene los datos del usuario para generar la data PAYLOAD que va en la llave
				datosUsuarioPAYLOAD = payloadUsuario;
				// Se ejecuta el proceso que se encarga de actualizar los datos de los perfiles para el usuario
				ProcesoActualizarPermisosMISE(args, _APP, _UP, payloadUsuario._id, usuarioMISE, usuarioARCA, callback);
			},
			function (usuario, callback) {
				// Obtiene los datos del usuario
				usuarioConexion = usuario;
				// Con los datos del usuario se procede a obtener sus preferencias en la aplicación
				ObtenerPreferenciasUsuario(_APP, usuarioConexion, callback);
			},
		], function (error, success) {
			// Variable generar que contendra la respuesta
			let resp = null;
			// Variable que contendra el estatus de la respuesta
			let status = 200; // 200 = OK

			// Se valida si existe un error
			if (error) {
				// Se valida si el error tiene la forma de la clase HttpResponse
				if (error.respuesta && !error.respuesta.exito) {
					/**
					 * Tipos de errores posibles:
					 *  - Indicador cambio de clave
					 *  - Indicador de credenciales inválidas:
					 *      ° Usuario y/o contraseña inválida
					 *      ° Usuario no este registrado en la unidad ejecutora [unidad programatica] (MISE)
					 *  - Usuario inactivo
					 */
					resp = error; // Se asigna el error a la variable generar
				} else {
					// En caso de que sea cualquier otro error (por ejemplo del mongo)
					// se crea un objeto de tipo HttpResponse y se asigna a la variable generar
					resp = new HttpResponse(false, (error.message) ? error.message : error.respuesta.mensaje, null);
					status = 500; // 500 = Internal Server Error
				}
				// Se retorna el mensaje de respuesta
				return res.status(status).send(resp.getJSON());
			} else {
				// Se obtiene la cantidad de minutos en los cuales va a estar activo el token
				parametrosController.getByGlobalNombre('ttlJWT', function (param) {
					// Se establecen los datos del usuario (de la conexión)
					const payload = {
						up: {
							_id: req.body.idUnidadProgramatica._id,
							idUP: req.body.idUnidadProgramatica.idUP
						},
						user: datosUsuarioPAYLOAD // establece los datos básicos del usuario
					};
					// Se establece la configuración para generar el token
					const config = { medida: 'm', ttl: (param.valor) ? parseInt(param.valor, 10) : 1 };

					try {
						// Genera el token
						const _token = tokenService.sign(payload, config);

						// Se crea un objeto que retornara la información del acceso del usuario
						let DATA = {
							token: _token,
							usuario: success
						};

						// Valida el tipo de respuesta (si es un objeto JSON o un JWT)
						if (esRespuestaJWT) {
							// Encapsula el token y los datos de los permisos de usuario en un nuevo token
							DATA = tokenService.sign(DATA, config);
						}

						// Si no existe ningún error se establece la respuesta
						resp = new HttpResponse(true, 'Bienvenido a la plataforma Arca', DATA);
						// Se retorna el mensaje de respuesta
						return res.status(status).send(resp.getJSON());
					} catch (err) {
						// Se crea un mensaje para responder la validación
						const resp = new HttpResponse(false, 'Se produjo un error tratando de generar el token.', null);
						// Se retorna el mensaje de respuesta
						return res.status(500).send(resp.getJSON());
					}
				});
			}
		});
	}
};
