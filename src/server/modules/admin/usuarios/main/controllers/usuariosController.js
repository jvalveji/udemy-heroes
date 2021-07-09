// Definición para el fichero usuariosController.js v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de USUARIOS para interactuar la base de datos mongo.
// Modificado: (25-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluyen módulos a utilizar
const async = require('async'); // Módulo async para manejo solicitudes asincronas
// Se importa el servicio del MISE
const miseService = require('./../../../../shared/services/miseService');
// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../../shared/interfaces/httpResponse');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../../shared/services/utilidadesService');
// Se incluye el fichero de funciones para el envio de correos por PhpList
const phpList = require('./../../../../shared/services/mailPhpListService');
// Se incluye el fichero de funciones para el envio de mensajes de texto
const phoneMessage = require('./../../../../shared/services/messagePhoneService');

// Se incluyen los modelos necesarios para mongoose
const usuarioModel = require('./../models/usuariosModel');
const personaModel = require('./../../../../shared/personas/models/personasModel');
const permisosModel = require('./../../../catalogos/models/permisosModel');
const unidadProgramaticaModel = require('./../../../catalogos/models/unidadesProgramaticasModel');
const appsModel = require('./../../../catalogos/models/aplicacionesArcaModel');

// Se incluye el enumerador de los servicios MISE
const enumMISE = require('./../../../../shared/enums/mise-servicios');

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
	appsModel.findOne(_where, function (err, app) {
		if (err || !app) {
			// SE DEBE RETORNAR EL MENSAJE INDICANDO ERROR
			// (ERROR PARA OBTENER LOS DATOS)
			callback(new HttpResponse(false, 'No se pudo obtener los datos de la aplicación arca.', null));
			return;
		} else {
			// Retorna los datos de la aplicación
			callback(null, app._id);
			return;
		}
	});
};

/**
 * Función que obtiene los permisos del usuario asociados en el MISE
 * @param {string[]} args Arreglo de parámetros a enviar al servicio SOAP
 * @param {object} callback Función callback que retorna el resultado
 */
let ObtenerPermisosUsuarioConMISE = function (args, callback) {
	// Se realiza la ejecución de las funciones asincronas de forma sincrona
	// (IMPORTANTE: El primer parámetro que se envia a las funciones callback cuando es nulo indica un ERROR)
	async.waterfall([
		// PASO 1 -> Se obtienen los datos de los perfiles del usuario en el MISE
		function (callback) {
			// Se establece los datos  para ejecutar el llamado al servicio MISE
			const params =
				'identificadorUsuario=' + args.usuario +
				'&codigoSistema=' + args.sistema +
				'&codigoUnidadEjecutora=' + args.idUnidadProgramatica;

			// Se manda a llamar al servicio MISE
			miseService.execute(enumMISE.PERFILES, params, null, callback);
		},
		// PASO 2 -> Se obtienen los datos de los permiso para los perfiles del usuario en el MISE
		function (perfilesMISE, callback) {
			// Se valida si existen perfiles de MISE
			if (perfilesMISE && perfilesMISE.perfiles.length > 0) {
				// Variable que contendra la lista de permisos
				let listaPermisos = [];

				// Se recorre la lista de perfiles para obtener los permisos de cada uno
				async.eachSeries(perfilesMISE.perfiles, function (perfil, callback2) {
					// Se establece los datos para ejecutar el llamado al servicio MISE
					const params =
						'codigoSistema=' + args.sistema +
						'&codigoPerfil=' + perfil.codigo;

					// Se manda a llamar al servicio MISE
					miseService.execute(enumMISE.PERMISOS, params, null, function (error, restriccionesMISE) {
						// Valida si existe un error
						if (error) {
							callback(error);
							return;
						}
						// Se recorre la lista de restricciones dada por MISE
						restriccionesMISE.restricciones.forEach(res => {
							//res.recurso.codigo;
							listaPermisos.push(res.recurso.nombreProgramacion);
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

					// LLama al callback principal y le envia todos los permisos obtenidos
					callback(null, listaPermisos);
					return;
				});
			}
			else {
				// Si no hay permisos se envia NULO al callback
				callback(null, null);
				return;
			}
		}],
		function (error, success) {
			// Valida si hubo algún tipo de error en el inicio de sesión del MISE
			if (error) {
				// Se establece el error y se envia al callback
				callback(error);
				return;
			}

			// Se retorna el arreglo de PERMISOS dado por el MISE
			callback(null, success);
			return;
		});
};

/**
 * Función encargada de obtener los permisos del usuario desde el CORE (si existiesen)
 * @param {string} appId Id de la aplicación arca
 * @param {Array} permisosMISE Arreglo con la lista de permisos obtenidos desde el MISE
 * @param {object} callback Función callback que retorna el resultado
 */
let ObtenerPermisosDesdeCore = function (appId, permisosMISE, callback) {
	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _where = {
		'aplicacion_id': appId
	};

	// Variable que almacenara los PERMISOS del usuario que vienen desde el MISE pero
	// con los id mongo del catálogo de permisos asociado a cada permiso
	let MISEExiste = [];

	// Variable que almacenara de forma temporal los datos de los PERMISOS que se deben registrar en el MISE
	let MISEInsertar = [];

	// Obtiene la lista de PERMISOS locales del sistema por aplicación
	permisosModel.find(_where, function (err, permisosArca) {
		if (err) {
			callback(err, null);
			return;
		}

		// Valida si existen permisos localmente para la aplicación
		if (permisosArca) {
			// Valida si existe lois permisos MISE
			if (permisosMISE) {
				// Recorre los PERMISOS MISE y verifica si existen
				// para la aplicación en la base de datos local
				permisosMISE.some(_permisoMISE => {
					// Variable que almacenará el estado cuando un permisos MISE ya existe en los permisos de
					// la aplicación
					let existe = null;

					// Retorna la respuesta de la validación a la variable
					existe = permisosArca.some(function (_permisoApp) {
						// Valida si existe
						if (_permisoApp.idPermiso === _permisoMISE) {
							// Al existir el PERMISO se mete en un arreglo que sera utilizado para
							// agregarlo a los permisos del usuario
							MISEExiste.push({
								// Se retorna NULO ya que deberia ser el ID de la colección de usuario-permisos y NO
								// el id de la colección de permisos
								_id: null, // _permisoApp.id
								nombre: _permisoApp.idPermiso
							});
							return true;
						}
					});

					// Valida si NO existe en el arreglo
					if (!existe) {
						// Al no existir hay que INSERTARLO en la base de datos (se meten en el arreglo temporal)
						MISEInsertar.push({
							aplicacion_id: appId,
							idPermiso: _permisoMISE,
							nombre: 'MISE - ' + utils.capitalizeText(_permisoMISE),
							descripcion: 'Permiso proveniente del MISE.',
							estado: true,
							eslocal: false
						});
					}
				});
			}
			else {
				// Al no existir permisos de MISE se toman los de ARCA
				permisosArca.forEach(_permisoApp => {
					// Se agregar los permisos del usuario
					MISEExiste.push({
						// Se retorna NULO ya que deberia ser el ID de la colección de usuario-permisos y NO
						// el id de la colección de permisos
						_id: null, // _permisoApp.id
						nombre: _permisoApp.idPermiso
					});
				});
			}
		}

		// Valida si hay datos para insertar en la base de datos
		if (MISEInsertar.length > 0) {
			// Se envian los datos a la función que los ingresa a la base datos
			InsertarPermisosNuevosDelMISE(appId, MISEInsertar, function (err, _permisosInsertados) {
				if (err) {
					callback(err, null);
					return;
				}
				// Retorna los datos de los PERMISOS recién creados
				// callback(null, _permisosInsertados);
				callback(null, MISEExiste);
				return;
			});
		} else {
			// Retorna los datos del usuario
			// En este caso retorna los permisos del existentes en el catálogo local
			callback(null, MISEExiste);
			return;
		}
	});
};

/**
 * Función que se encarga de registrar los permisos nuevos en el sistema arca
 * @param {string} appId Id de la aplicación arca
 * @param {object} permisosNuevos Arreglo que representa el conjunto de permisos a ingresar en la BD
 * @param {object} callback Función callback que retorna el resultado
 */
let InsertarPermisosNuevosDelMISE = function (appId, permisosNuevos, callback) {

	// Inserta el arreglo de nuevos permisos a la base de datos
	permisosModel.create(permisosNuevos, function (err) {
		if (err) {
			callback(err, null);
			return;
		}

		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'aplicacion_id': appId
		};

		// Si todo anda bien se vuelven a cargar los datos los permisos
		permisosModel.find(_where, function (err, permisos) {
			if (err) {
				callback(err, null);
				return;
			}

			// SI todo anduvo bien continua a la función callback
			callback(null, permisos);
			return;
		});
	});
};

/**
 * Función encargada de obtener los datos de la persona por identificación
 * @param {*} _identificacion Indica la identicación de la persona
 * @param {*} callback Función callback que retorna el resultado
 */
let ListarUsuariosPorIdentificacion = function (_identificacion, callback) {
	// Variable que establece los campos a retornar en la consulta (SELECT)
	const _selectPersona = {
		identificacion: true,
		nombre: true,
		apellido1: true,
		apellido2: true,
		mediosContacto: true,
		esUsuarioArca: true
	};

	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _wherePersona = {
		esUsuarioArca: true,
		identificacion: _identificacion
	};

	// Consulta los datos de la colección de personas
	personaModel.find(_wherePersona, _selectPersona, function (err, personas) {
		if (err) {
			// Retorna el error al callback
			callback(err);
			return;
		}
		// Retorna el resultado al callback
		callback(null, personas);
		return;
	});
};

/**
 * Función encargada de obtener los datos del usuario por nombre de usuario
 * @param {*} filtro Filtro de la consulta
 * @param {*} callback Función callback que retorna el resultado
 */
let ListarUsuariosPorNombreUsuario = function (filtro, callback) {
	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _whereUsuario = {
		'usuario': {
			$regex: filtro,
			$options: 'gi' // i=case-insensitive / g= equivale a un % como en SQL
		}
	};

	// Consulta los datos de la colección de usuarios
	usuarioModel.find(_whereUsuario, { persona_id: true }, function (err, usuarios) {
		if (err) {
			// Retorna el error al callback
			callback(err);
			return;
		}

		// Variable que establece los campos a retornar en la consulta (SELECT)
		const _selectPersona = {
			identificacion: true,
			nombre: true,
			apellido1: true,
			apellido2: true,
			mediosContacto: true,
			esUsuarioArca: true
		};

		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _wherePersonas = {
			_id: { '$in': usuarios.map(user => { return user.persona_id }) }
		};

		// Consulta los datos de la colección de personas
		personaModel.find(_wherePersonas, _selectPersona, function (err, personas) {
			if (err) {
				// Retorna el error al callback
				callback(err);
				return;
			}
			// Retorna el resultado al callback
			callback(null, personas);
			return;
		});
	});
};

/**
 * Función encargada de obtener los datos de la persona por nombre y apellidos
 * @param {*} filtro Filtro de la consulta
 * @param {*} callback Función callback que retorna el resultado
 */
let ListarUsuariosPorNombreApellidos = function (filtro, callback) {
	// Se ejecuta una agregación donde se crea una variable que contendra la concatenación
	// del nombre y los apellidos
	personaModel.aggregate([{
		'$match': {
			'esUsuarioArca': true // Solo los que son usuarios arca
		}
	},
	{
		$project: {
			'identificacion': true,
			'nombre': true,
			'apellido1': true,
			'apellido2': true,
			'esUsuarioArca': true,
			mediosContacto: true,
			'nombreCompleto': {
				$concat: ['$apellido1', ' ', '$apellido2', ' ', '$nombre']
			}
		}
	},
	{
		$match: {
			'nombreCompleto': {
				$regex: filtro,
				$options: 'gi' // i=case-insensitive / g= equivale a un % como en SQL
			}
		}
	}
	]).exec(function (err, personas) {
		if (err) {
			// Retorna el error al callback
			callback(err);
			return;
		}
		// Retorna el resultado al callback
		callback(null, personas);
		return;
	});
};

/**
 * Función que obtiene la información completa de cada persona asociada a un usuario
 * @param {*} personas Listado de personas
 * @param {*} callback Función callback que retorna el resultado
 */
let ObtenerInformacionCompletaUsuarios = function (personas, callback) {
	// Consulta los datos de la colección de usuarios
	// Variable que establece los campos a retornar en la consulta (SELECT)
	const _selectUsuario = {
		persona_id: true,
		usuario: true,
		esMise: true,
		estado: true
	};

	// Se crea un objeto que contendra la respuesta con los datos de los usuarios
	let listaUsuarios = [];

	// Función que ejecuta de forma sincrona funciones asincronas en un bucle(for, foreach, while); en este caso las de mongoose
	async.eachSeries(personas, function (_persona, callback2) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _whereUsuario = {
			persona_id: _persona._id
		};
		// Agrega los datos de la persona
		const datosUsuario = {
			persona: {
				id: _persona.id,
				identificacion: _persona.identificacion,
				nombre: _persona.nombre,
				apellido1: _persona.apellido1,
				apellido2: _persona.apellido2,
				mediosContacto: _persona.mediosContacto
			},
			usuario: null
		};

		// Se obtiene los datos básicos del usuario
		// de unidades programáticas
		usuarioModel.find(_whereUsuario, _selectUsuario, function (err, _usuario) {
			if (err) {
				// Retorna el error al callback
				callback2(err);
				return;
			}
			// Valida si existen datos del usuario
			if (_usuario.length > 0) {
				// Obtiene el documento (usuario)
				datosUsuario.usuario = {
					id: _usuario[0].id,
					usuario: _usuario[0].usuario,
					esMise: _usuario[0].esMise,
					estado: _usuario[0].estado
				};

				// y se agrega los datos del documento al arreglo
				listaUsuarios.push(datosUsuario);
			}
			// Llama a la función callback
			callback2();
			return;
		});

	}, function (err) {
		if (err) {
			// Retorna el error al callback
			callback(err);
			return;
		}
		// Retorna el resultado al callback
		callback(null, listaUsuarios);
		return;
	});
};

/**
 * Función que se encarga de actualizar la contraseña para usuarios MISE
 * @param {*} res Solicitud response
 * @param {*} args Listado de argumentos a enviar al webservice
 */
let UpdatePasswordMISE = function (res, args) {
	// Se realiza la ejecución de las funciones asincronas de forma sincrona
	// (IMPORTANTE: El primer parámetro que se envia a las funciones callback cuando es nulo indica un ERROR)
	async.waterfall([
		// Se actualiza la contraseña del usuario en el MISE
		function (callback) {
			// Se establece los datos  para ejecutar el llamado al servicio MISE
			const params =
				'identificadorUsuario=' + args.usuario +
				'&claveAnterior=' + Buffer.alloc(args.claveAnterior.length, args.claveAnterior).toString('base64') +
				'&nuevaClave=' + Buffer.alloc(args.clave.length, args.clave).toString('base64') +
				'&confirmacionClave=' + Buffer.alloc(args.claveConfirma.length, args.claveConfirma).toString('base64') +
				'&estacionTrabajo=' + args.ip;

			// Se manda a llamar al servicio MISE
			miseService.execute(enumMISE.CAMBIO_CLAVE, params, null, callback);
		}],
		function (error, success) {
			// Valida si hubo algún tipo de error en el inicio de sesión del MISE
			if (error) {
				// Se retorna el mensaje de respuesta (405 = METHOD NOT ALLOWED)
				return res.status(405).send(error.getJSON());

			} else {
				// Si no existe ningún error se establece la respuesta
				let resp = new HttpResponse(true, success.descripcion, null);
				// Se retorna el mensaje de respuesta
				return res.status(200).send(resp.getJSON());
			}
		});
};

/**
 * Función que se encarga de actualizar la contraseña para usuarios NO MISE
 * @param {*} res Solicitud response
 * @param {*} args Listado de argumentos a enviar al webservice
 */
let UpdatePasswordNoMISE = function (res, args) {
	// Valida que la confirmación de la clave sea la misma a la nueva
	if (args.clave !== args.claveConfirma) {
		// Se establece la respuesta
		const resp = new HttpResponse(false, 'La nueva contraseña y su confirmación son incorrectas; favor verifique.', null);
		// Se retorna el mensaje de respuesta
		return res.status(200).send(resp.getJSON());
	}

	// Variable que establece el filtro de la consulta a la base de datos (WHERE)
	const _where = {
		usuario: args.usuario,
		password: utils.generateSHA256(args.claveAnterior)
	};

	// Actualiza el estado del usuario
	usuarioModel.findOne(_where, {}, function (err, usuario) {
		// Valida si hubo algún tipo de error la conectar el servicio del MISE
		if (err) {
			return res.status(500).json({
				message: 'Error tratando de actualizar los datos del usuario.',
				error: err
			});
		}

		// valida si hubo respuesta con los datos de usuario y contraseña anterior
		if (!usuario) {
			// Se establece la respuesta
			const resp = new HttpResponse(false, 'La contraseña actual no coincide; favor verifique', null);
			// Se retorna el mensaje de respuesta
			return res.status(200).send(resp.getJSON());
		}

		// Se indican los datos de la contraseña para actualizar
		usuario.set({
			password: utils.generateSHA256(args.clave),
			ultimoCambioPassword: utils.localDateToUTC(new Date())
		});

		// Se salvan los nuevos datos
		usuario.save(function (err, _user) {
			if (err) {
				return res.status(500).json({
					message: 'Error tratando de actualizar los datos del usuario.',
					error: err
				});
			}

			// Si no existe ningún error se establece la respuesta
			const resp = new HttpResponse(true, 'Cambio de contraseña correcto!.', null);
			// Se retorna el mensaje de respuesta
			return res.status(200).send(resp.getJSON());
		});
	});
};

/**
 * usuariosController.js
 *
 * @description :: Server-side logic for managing usuarios.
 */
module.exports = {
	/**
	 * @description Función encargada de listar los usuarios del sistema por filtro
	 */
	show: function (req, res) {
		// Se realiza la ejecución de las funciones asincronas de forma sincrona
		// (IMPORTANTE: El primer parámetro que se envia a las funciones callback cuando es nulo indica un ERROR)
		async.waterfall([
			function (callback) {
				// Valida si el dato entrante es numerico o alfanumérico
				if (!Number.isNaN(parseInt(req.params.filtro, 10))) {
					// Búsqueda por identificación
					ListarUsuariosPorIdentificacion(req.params.filtro, callback);
				} else {
					if (req.params.filtro.indexOf(' ') === -1) {
						// Búsqueda por usuario
						ListarUsuariosPorNombreUsuario(req.params.filtro, callback);
					} else {
						// Búsqueda por nombre y apellidos
						ListarUsuariosPorNombreApellidos(req.params.filtro, callback);
					}
				}
			},
			function (personas, callback) {
				// Llama a la función que se encarga de obtener la lista de perfiles del usuario desde el MISE
				ObtenerInformacionCompletaUsuarios(personas, callback);
			},
		], function (error, listaUsuarios) {
			// Se valida si existe un error
			if (error) {
				// Se retorna el mensaje de respuesta
				return res.status(500).send(error);
			} else {

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, 'Proceso satisfactorio.', listaUsuarios);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			}
		});
	},
	/**
	 * @description Función encargada de obtener los datos del usuario y de la persona asociada a este
	 */
	showById: function (req, res) {
		// Consulta los datos de la colección de usuarios
		// Variable que establece los campos a retornar en la consulta (SELECT)
		const _select = {
			unidadesProgramaticas: false,
			password: false
		};

		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			_id: req.params.usuario
		};

		// Busca los datos del usuario en la base de datos de seguridad
		// Una vez obtenido el resultado (si no existen datos retorna NULO) se envia a la función callback
		usuarioModel.findOne(_where, _select).populate({
			path: 'persona_id',
			model: personaModel
		}).exec(function (err, usuario) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener los datos del usuario arca.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, usuario);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
	},
	/**
	 * @description Función que obtiene la lista de unidades programáticas asociadas al usuario
	 */
	 showByUnidadesProgramaticas: function (_req, res) {
		// Variable que almacenara las unidades programáticas asiganadas al usuario
		let unidades = [];

		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {};

		// Se obtiene las descripciones de la unidad programática asociada al usuario desde los catálogos
		// de unidades programáticas		
		unidadProgramaticaModel.find(_where, function (err, _ups) {
			// Valida si existe un error
			if (err) {
				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(false, 'Error tratando de obtener las unidades programáticas del sistema.', null);
				// Se obtiene el JSON del mensaje y se envia (500 = Internal Server Error)
				return res.status(500).send(respuesta.getJSON());
			}

			
			// Se hace un recorrido de las unidades programáticas para agregarle la UP a la descripción			
			_ups.forEach(up => {
				// Concatena el id de la unidad con las descripción y se le establece  como descripción
				up.descripcion = up.idUP + ' - ' + up.descripcion;
				// Agrega el documento modificado al arreglo
				unidades.push(up);			
			});			
			
			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, unidades);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		});
		
	},
	/**
	 * Función encargada de crear la estructura de credenciales de usuario
	 * para establecerlas en la variable LOCALSTORAGE del navegador que consume
	 * una vista en la aplicación Arca.
	 * Esta funcionalidad es especifica para aplicaciones EDUS
	 */
	arcaAcceso: function (req, res) {
		// Variable para almacenar el id de la aplicación que solicita y los datos de la UP
		var APP = null;

		// Argumentos para la consulta MISE
		const args = {
			usuario: req.userArcaRequest.user.usuario,
			idUnidadProgramatica: req.userArcaRequest.up.idUP,
			sistema: req.params.mise
		};

		// Se realiza la ejecución de las funciones asincronas de forma sincrona
		// (IMPORTANTE: El primer parámetro que se envia a las funciones callback cuando es nulo indica un ERROR)
		async.waterfall([
			function (callback) {
				// Llama a la función que se encarga de obtener el dato del id de la aplicación actual
				ObtenerIdAplicacionArcaActual(req.params.arcaapp, callback);
			},
			function (idApp, callback) {
				// Almacena el dato del id de la aplicación
				APP = idApp;

				// Llama a la función que se encarga de obtener la lista de permiso del usuario desde el MISE
				ObtenerPermisosUsuarioConMISE(args, callback);
			},
			function (permisos, callback) {
				// Obtiene la lista de perfiles desde la bases de datos del core
				ObtenerPermisosDesdeCore(APP, permisos, callback);
			}
		], function (error, _permisos) {
			// Se valida si existe un error
			if (error) {
				// Se retorna el mensaje de respuesta
				return res.status(500).send(error);
			} else {
				const localStorage = {
					aplicacion_id: APP,
					esMise: true,
					nombreCompleto: req.userArcaRequest.user.nombre,
					unidadProgramatica_id: req.userArcaRequest.up._id,
					usuario: req.userArcaRequest.user.usuario,
					usuario_id: req.userArcaRequest.user._id,
					permisos: _permisos,
					correo: req.correo
				};

				// Se crea un objeto respuesta y los datos se encapsulan en este
				const respuesta = new HttpResponse(true, 'Proceso satisfactorio.', localStorage);
				// Se obtiene el JSON del mensaje y se envia (200 = OK)
				return res.status(200).send(respuesta.getJSON());
			}
		});
	},
	/**
	 * @description Función encargada de agregar un nuevo usuario/persona a la base de datos
	 */
	create: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			'tipoIdentificacion_id._id': req.body.persona.tipoIdentificacion_id._id,
			identificacion: req.body.persona.identificacion
		};

		// Se busca la info de la persona actual (si existiese)
		personaModel.findOne(_where, function (err, _persona) {
			if (err) {
				return res.status(500).json({
					message: 'Error agregando los datos de la persona.',
					error: err
				});
			}
			// Valida si existe la persona
			if (!_persona) {
				// Si NO existe se inicializa
				_persona = new personaModel();
			}

			_persona.set({
				tipoIdentificacion_id: {
					_id: req.body.persona.tipoIdentificacion_id._id,
					descripcion: req.body.persona.tipoIdentificacion_id.descripcion
				},
				identificacion: req.body.persona.identificacion,
				nombre: req.body.persona.nombre,
				apellido1: req.body.persona.apellido1,
				apellido2: req.body.persona.apellido2,
				genero_id: {
					_id: req.body.persona.genero_id._id,
					descripcion: req.body.persona.genero_id.descripcion
				},
				mediosContacto: req.body.persona.mediosContacto,
				esUsuarioArca: true,
				fechaNacimiento: (req.body.persona.fechaNacimiento) ? utils.localDateToUTC(new Date(req.body.persona.fechaNacimiento)) : undefined,
				logs: {
					modified: {
						fecha: utils.localDateToUTC(new Date()),
						usuario_id: req.userArcaRequest.user._id,
						usuario: req.userArcaRequest.user.usuario,
						nombre: req.userArcaRequest.user.nombre
					}
				}
			});

			// Se agregan los datos en la colección de personas
			_persona.save(function (err, _persona2) {
				if (err) {
					return res.status(500).json({
						message: 'Error agregando los datos de la persona.',
						error: err
					});
				}

				// Si todo anduvo bien se obtiene el id de la persona recién creada para
				// agregarlo a la colección de usuarios
				// Se establecen los valores del usuario
				var usuarioMdl = new usuarioModel({
					persona_id: _persona2._id,
					usuario: req.body.usuario.usuario,
					password: null,
					esMise: req.body.usuario.esMise,
					ultimoCambioPassword: null,
					estado: true
				});

				// Guarda los datos en la BD
				usuarioMdl.save(function (err, _usuario) {
					if (err) {
						return res.status(500).json({
							message: 'Error agregando los datos del usuario.',
							error: err
						});
					}

					// Se crea un objeto respuesta y los datos se encapsulan en este
					const respuesta = new HttpResponse(true, 'El usuario fue creado de forma satisfactoria.', null);
					// Se obtiene el JSON del mensaje y se envia (200 = OK)
					return res.status(200).send(respuesta.getJSON());
				});
			});
		});
	},
	/**
	 * @description Función encargada de actualizar el usuario/persona en la base de datos
	 */
	update: function (req, res) {
		// Obtiene el id del usuario a modificar
		const idUsuario = req.params.id;

		// Variable que establece los campos a los cuales se le actualizará la información
		const _setUsuario = {
			// password: null,
			esMise: req.body.usuario.esMise,
			estado: req.body.usuario.estado
		};

		// Se agregan los datos en la colección de usuarios
		usuarioModel.findByIdAndUpdate(idUsuario, _setUsuario, {
			new: true
		}, function (err, _usuario) {
			if (err) {
				return res.status(500).json({
					message: 'Error actualizando los datos del usuario.',
					error: err
				});
			}

			// Se busca los datos en la colección de personas
			personaModel.findById(_usuario.persona_id, function (err, _persona) {
				if (err) {
					return res.status(500).json({
						message: 'Error actualizando los datos de la persona.',
						error: err
					});
				}

				// De los datos de la persona obtenidos se establece la
				// información que se ocupa
				_persona.set({
					tipoIdentificacion_id: {
						_id: req.body.persona.tipoIdentificacion_id._id,
						descripcion: req.body.persona.tipoIdentificacion_id.descripcion,
					},
					identificacion: req.body.persona.identificacion,
					nombre: req.body.persona.nombre,
					apellido1: req.body.persona.apellido1,
					apellido2: req.body.persona.apellido2,
					genero_id: {
						_id: req.body.persona.genero_id._id,
						descripcion: req.body.persona.genero_id.descripcion,
					},
					fechaNacimiento: (req.body.persona.fechaNacimiento) ? utils.localDateToUTC(new Date(req.body.persona.fechaNacimiento)) : null,
					mediosContacto: req.body.persona.mediosContacto,
					// Datos del log para el registro de actualización
					logs: {
						modified: {
							fecha: utils.localDateToUTC(new Date()),
							usuario_id: req.userArcaRequest.user._id,
							usuario: req.userArcaRequest.user.usuario,
							nombre: req.userArcaRequest.user.nombre
						}
					}
				});

				// Actualiza los datos de la persona
				_persona.save(function (err) {
					if (err) {
						return res.status(500).json({
							message: 'Error actualizando los datos de la persona.',
							error: err
						});
					}

					// Se crea un objeto respuesta y los datos se encapsulan en este
					const respuesta = new HttpResponse(true, 'El usuario fue actualizado de forma satisfactoria.', null);
					// Se obtiene el JSON del mensaje y se envia (200 = OK)
					return res.status(200).send(respuesta.getJSON());
				});
			});
		});
	},
	/**
	 * @description Función encargada de actualizar la contraseña del usuario
	 */
	updatePassword: function (req, res) {
		// Parametros a enviar al servicio MISE
		let args = {
			usuario: req.body[0].usuario,
			claveAnterior: req.body[0].clave,
			clave: req.body[1],
			claveConfirma: req.body[1],
			ip: utils.ipHostClient(req)
		};

		// Valida si el usuario es MISE o NO MISE
		if (req.body[0].esMISE && req.body[0].esMISE === true) {
			// Actualiza la contraseña para usuarios MISE
			UpdatePasswordMISE(res, args);
		}
		else {
			// Actualiza la contraseña para usuarios NO MISE
			UpdatePasswordNoMISE(res, args);
		}
	},
	/**
	 * @description Función encargada de restablecer la contraseña del usuario
	 */
	resetPassword: function (req, res) {
		// Se obtienen los datos de los parámetros
		const idUser = req.params.id;
		const esMise = req.body[0].esMise;
		const email = req.body[1].correo;
		const phone = req.body[1].telefono;

		// Se establece el mensaje para el correo electrónico
		let mensajeHTML = '<tr><td align="left" style="padding-top: 10px; padding-bottom: 30px; padding-left: 35px; font-size:13px; color:#8E8E8E; font-family: Arial,sans-serif; line-height: 23px;">' +
			//req.userArcaRequest.user.nombre +
			'</td></tr></table></div></td></tr><tr><td class="full_width" align="center" width="100%" bgcolor="#262e41"><div class="div_scale" style="width:600px;">' +
			'<table class="table_scale" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#262e41" style="padding:0; margin: 0;">' +
			'<tr><td align="center" valign="top" width="600" bgcolor="#fff"><table width="100%" class="table_scale" align="center"><tr>' +
			'<td valign="top" style="padding: 0px;padding-left: 35px;font-size:14px ;color:#8E8E8E;font-family: Arial,sans-serif;line-height: 23px;"><div>';

		// Variable que contiene el mensaje a enviar en los mensajes de texto a los teléfonos
		const mensajeSMS = '\nPlataforma Arca - CCSS.' +
			'\nSaludos. \nSe ha solicitado un restablecimiento de contraseña para su cuenta de usuario.' +
			'\nUsted ha recibido un correo electrónico para más detalles.';

		// Se valida si el usuario es MISE o local
		if (JSON.parse(esMise)) {
			// Al ser usuario MISE se le envia un correo con la URL del sitio MISE PARA RESETEAR CREDENCIALES
			const sitioMISE = (process.env.NODE_ENV === 'production') ? 'https://mise.ccss.sa.cr/MISEAutogestion/olvidoClave' :
				'https://misetest.ccss.sa.cr/MISEWeb/frmRecuperacionClaveMISE.jsp';

			mensajeHTML += '<p>' + 'Esta recibiendo este correo porque se solicitó un restablecimiento de contraseña para su cuenta MISE.<br>' +
				'Si solicitaste el cambio, puedes crear una nueva contraseña aquí: ' + '</p></div><div>&nbsp;</div>' +
				'<p class="button-td button-td-primary" style="background: #262e41;"><a class="button-a button-a-primary"href="' + sitioMISE + '" ' +
				'style="background: #fff; font-family: sans-serif; font-size: 15px; line-height: 15px; text-decoration: none; padding: 13px 17px; border: 1px solid #dbdbdb;' +
				'color: #686868; display: block; text-align:center;">Restablecer contrase&ntilde;a</a></p>' +
				'<div><div>&nbsp;</div><p>Si no quieres cambiar tu contraseña o no solicitaste hacerlo, ignora y elimina el mensaje.</p></div>';

			// Se llama al servicio de envio de correos por PhpList
			// El template 63 es el utilizado para enviar la notificación
			phpList.send(63, email, mensajeHTML, null, exito => {
				// Se procede a enviar el mensaje de texto (si exitiese número)
				phoneMessage.send(phone, mensajeSMS, null, exito2 => {
					// Se establece el mensaje de éxito
					const mediosOk = exito ? 'correo' : exito2 ? ', teléfono' : '';
					const mediosNo = !exito ? 'correo' : !exito2 ? ', teléfono' : '';
					const mensaje = exito ? 'Proceso realizado con éxito (' + mediosOk + ')' : 'Ocurrio un error en el proceso de notificación al usuario (' + mediosNo + ')';

					// Se crea un objeto respuesta y los datos se encapsulan en este
					const respuesta = new HttpResponse(exito, mensaje, null);
					// Se obtiene el JSON del mensaje y se envia (200 = OK)
					return res.status(200).send(respuesta.getJSON());
				});
			});
		}
		else {
			// Genera nueva contraseña
			const newPass = utils.passwordGenerator(9);
			// Variable que establece los campos a los cuales se le actualizará la información
			const _setUsuario = {
				'$set': {
					password: utils.generateSHA256(newPass),
					ultimoCambioPassword: utils.localDateToUTC(new Date())
				}
			};

			// Se agregan los datos en la colección de usuarios
			usuarioModel.findByIdAndUpdate(idUser, _setUsuario, {}, function (err, _usuario) {
				if (err) {
					return res.status(500).json({
						message: 'Error actualizando los datos del usuario.',
						error: err
					});
				}

				// Se establece el mensaje para el correo electrónico
				mensajeHTML += '<p>' + 'Esta recibiendo este correo porque se solicitó un restablecimiento de contraseña para su cuenta en la Plataforma Arca.</p></div><div>&nbsp;</div>' +
					'<table class="unstyledTable"><thead><tr><th>Usuario</th><th>Contrase&ntilde;a</th></tr></thead><tfoot><tr>' +
					'<td>' + _usuario.usuario + '</td><td>' + newPass + '</td></tr></tfoot></table></p>' +
					'<div><div>&nbsp;</div><p>Si no solicitaste hacer el cambio, contacte con <b>soporte técnico</b>.</p></div>';

				// Se llama al servicio de envio de correos por PhpList
				// El template 63 es el utilizado para enviar la notificación
				phpList.send(63, email, mensajeHTML, null, exito => {
					// Se procede a enviar el mensaje de texto (si exitiese número)
					phoneMessage.send(phone, mensajeSMS, null, exito2 => {
						// Se establece el mensaje de éxito
						const mediosOk = exito ? 'correo' : exito2 ? ', teléfono).' : '';
						const mensaje = exito ? 'Proceso realizado con éxito (' + mediosOk + ').' : 'Ocurrio un error en el proceso de notificación al usuario pero el cambio de credenciales fue satisfactorio.' +
							'<br>Las nuevas credenciales son la siguientes:' +
							'<br><b>Usuario</b>: ' + _usuario.usuario +
							'<br><b>Password</b>: ' + newPass;

						// Se crea un objeto respuesta y los datos se encapsulan en este
						const respuesta = new HttpResponse(exito, mensaje, null);
						// Se obtiene el JSON del mensaje y se envia (200 = OK)
						return res.status(200).send(respuesta.getJSON());
					});
				});
			});
		}
	}
};
