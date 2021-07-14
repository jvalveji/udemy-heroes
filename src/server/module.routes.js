// Definición para el fichero routes.js v7.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para cargar los distintos archivos de rutas de los servicios rest
// Modificado: (08-07-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express');
const router = express.Router();

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./modules/shared/interfaces/httpResponse');
// Se incluye el fichero de funciones utilitarias
const utils = require('./modules/shared/services/utilidadesService');
// Importación del servicio para el manejo de tokens (JWT)
const tokenService = require('./modules/shared/services/jsonWebTokenService');
// Se importa el controlador de los parámetros
const parametrosController = require('./modules/admin/parametros/controllers/parametrosController');

// Se obtienen los ficheros de rutas de cada módulo
// Nota: En caso de no requerir algún módulo, si desea puede inhabilitarlo para que no se cargue
const loginRoutes = require('./modules/login/routes/loginRoutes');
const adminModuleRoutes = require('./modules/admin/module.routes');
const sharedModuleRoutes = require('./modules/shared/module.routes');
const rpmModuleRoutes = require('./modules/rpm/models.routes');


// Validación que indica que el servicio en esta ruta esta disponible 
router.get('/check', (req, res) =>
	res.send('OK')
);

// Enrutamiento de los módulos de la aplicación 
// (NO se aplica middleware de autorización)
router.use('/login', loginRoutes);

/** 
 * VALIDACION DE TOKEN
 * GET /autorizacion - Validación que indica si un token enviado es válido 
 * Se puede consultar enviando un token a: https://127.0.0.1:3000/api/autorizacion?key=[JWT]
 * IMPORTANTE: Este middleware se aplicará a TODAS las rutas definidas al final de este fichero; en caso de 
 * que alguna ruta no requiera este middleware; debe colocar esa ruta antes de esta función
 * */
router.get('/autorizacion', function (req, res) {
	/**
	 * Trata de obtener el token enviado por el cliente; esta verificación puede ser:
	 *  * Desde los encabezados HTTP
	 *  * Como parámetro en la URL
	 *  * Como parámetro en el body de la consulta
	 */
	// Se trata de obtener el encabezado de autorización
	const AUTH = req.headers['authorization'] || null;
	const TOKEN = req.body.key || req.query.key || AUTH;

	// Valida si existe token para decodificar
	if (TOKEN) {
		// Se obtiene la validación del token
		utils.validateToken(TOKEN, function (validacion) {
			// variable con la respuesta de la validación
			const respuesta = validacion.respuesta;

			// Se valida si la respuesta fue exitosa
			if (respuesta.exito) {
				// Se crea un mensaje para responder la validación
				const resp = new HttpResponse(true, 'Token válido.', null);
				// Se retorna el mensaje de respuesta
				return res.status(200).send(resp.getJSON());
			}
			else {
				// Valida si el token requiere renovación (408 = Request Timeout)
				// Y si la solicitud posee el encabezado de autorización
				if (respuesta.data._status === 408 && AUTH) {
					// Se obtiene la cantidad de minutos en los cuales va a estar activo el token
					parametrosController.getByGlobalNombre('ttlJWT', function (param) {
						// Se establecen los datos del usuario (de la conexión)
						const payload = {
							up: respuesta.data._decoded.payload.up,
							user: respuesta.data._decoded.payload.user
						};
						// Se establece la configuración para generar el token
						const config = { medida: 'm', ttl: (param.valor) ? parseInt(param.valor, 10) : 1 };

						try {
							// Genera el token
							const _token = tokenService.sign(payload, config);

							// Se retorna el mensaje de respuesta
							return res.status(respuesta.data._status)
								// Se establece una cookie en el cliente con un nuevo token que debe ser sustituido
								// en el próximo request
								.cookie('arca-key-renew', _token, {
									maxAge: 1000 * 60 * 30, // expira LA COOKIE despues de 30 minutos
									sameSite: 'lax'
								})
								.send(null);
						} catch (err) {
							// Se crea un mensaje para responder la validación
							const resp = new HttpResponse(false, 'Se produjo un error tratando de generar el token.', null);
							// Se retorna el mensaje de respuesta
							return res.status(500).send(resp.getJSON());
						}
					});
				} else {
					// Se crea un mensaje para responder la validación
					const resp = new HttpResponse(false, validacion.respuesta.mensaje, null);
					// Se retorna el mensaje de respuesta con el error
					return res.status(respuesta.data._status).send(resp.getJSON());
				}
			}
		});
	} else {
		// Si no existe un token definido en la petición se establece la respuesta como error
		const resp = new HttpResponse(false, 'Debe indicar un token de seguridad para poder tramitar su solicitud.', null);
		// Se retorna el mensaje de respuesta (400 = Bad Request)
		return res.status(401).send(resp.getJSON());
	}
});

// Enrutamiento de los módulos de la aplicación 
router.use('/admin', adminModuleRoutes);
router.use('/shared', sharedModuleRoutes);
router.use('/rpm', rpmModuleRoutes);

// (Incluir las rutas [module.routes.js] requeridas de la aplicación rest desde acá)
// Recordar que la ruta ya esta compuesta por el nombre de la aplicación más la palabra API,
// por lo que no es necesario incluir más el nombre del sistema en la ruta 
// Ej.: Ruta padre de nutrición => /nutricion-api
// Ej.: Ruta para el módulo de menus en nutrición => router.use('/menus', menusModuleRoutes);

module.exports = router;
