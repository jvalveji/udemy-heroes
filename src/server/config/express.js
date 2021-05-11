// Definición para el fichero express.js v4.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la configuración del framework ExpressJS
// Modificado: (07-07-2020) Ing. Dagoberto Gómez Jiménez

// Variables con la carga de módulos requeridos
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Se incluye el modulo para habilitar el CORS (Cross Origin Resource Sharing)
const logger = require('morgan');
const busboyBodyParser = require('busboy-body-parser');
const rutas = require('./../module.routes'); // Fichero principal del módulo de rutas ubciado en la raíz
const helmet = require('helmet');

// Importación del servicio para el manejo de tokens (JWT)
const tokenService = require('./../modules/shared/services/jsonWebTokenService');

// Se establecen las opciones base para el CORS (Cross Origin Resource Sharing)
let corsOptions = {
	origin: true,
	allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Set-Cookie'],
	credentials: true // Habilita los encabezados en la respuesta (esto para enviarle cookies)
};

// Constante con la ruta de los servicios api global
const apiService = '/bitzu-api';

module.exports = function (app, config) {
	// Se define el logger a utilizar (morgan)
	app.use(logger('combined'));
	// Se define el motor de templates html
	app.set('view engine', 'ejs');
	// Se define la ubicación de los templates html
	app.set('views', path.resolve('./' + config.rootPath) + '/views/');
	// Habilita el uso de cookies
	app.use(cookieParser());
	// Protege la aplicación de algunas vulnerabilidades web conocidas mediante el establecimiento correcto de cabeceras HTTP.
	app.use(helmet());
	// Habilita el CORS (Cross Origin Resource Sharing)
	app.use(cors(corsOptions));
	// parse an HTML body into a string
	app.use(bodyParser.text({
		type: 'text/html'
	}));
	// parse an HTML body into a json
	app.use(bodyParser.json());
	// parse an HTML body into a application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	// manejo de request multipart/form-data límite máximo 50mb
	app.use(busboyBodyParser({
		limit: config.socket.limiteMB
	}));

	// Valida si la configuración permite iniciar los sockets
	if (config.socket.activo) {
		// Se llama al manejador de sockets y se le pasa la app
		require('./socket')(app);
	}

	// Valida si la configuración permite iniciar las tareas
	if (config.tasks.activo) {
		// Se llama al manejador de tareas y se le pasa la app
		require('./tasks')(app);
	}

	// Atrapa TODAS las peticiones request que llegan al servidor
	app.use(function (req, res, next) {
		// Valida si se consulta el home de los servicios rest
		if (req.url === '/' || req.url === apiService || req.url === (apiService + '/')) {
			// Redirecciona a la página home (se envia como parametro la ip local con el puerto)
			res.render('home', {
				ip: req.protocol + '://' + req.get('host'),
				annoActual: (new Date()).getFullYear()
			});
		} else {
			// Para cualquier otra ruta (válida o no válida) entra aquí
			// Trata de obtener el encabezado de autorización
			const AUTH = req.headers['authorization'] || null;
			const TOKEN = req.body.key || req.query.key || AUTH;
			// Valida si existe el token
			if (TOKEN) {
				// Se intenta decodificar el token
				let tokenDecodificado = tokenService.decode(TOKEN);

				// Se verifica si el token se pudo decodificar
				if (tokenDecodificado) {
					// Crea una variable en el request que permitira en cualquier controlador
					// obtener la información del usuario actual en la "sesión"
					req.userArcaRequest = tokenDecodificado.payload;
				}
			}
			// Continua el flujo del proceso
			next();
		}
	});

	// Indica cual es el root base de los servicios rest
	app.use(apiService, rutas);

	// Atrapa error 500 (Error interno servidor)
	// Este error se debe a:
	// * Un problema interno
	// * El servicio no existe
	app.use(function (req, res, next) {
		// Se establece un mensaje para el usuario
		var mensaje = `<pre>Servicio: <h3>${req.path}</h3></pre>
    <pre>
    <h5>El servicio puede no responder por alguna de estas causas:</5>
    <ul>
    <li>El servicio solicitado no existe.</li>
    <li>Existe un problema interno que no permite procesar la solicitud.</li>
    </ul>
    </pre>`;
		// Envia el mensajes de error para el usuario
		var err = new Error(mensaje);
		err.status = 500;
		next(err);
	});

	// Manejo de los errores
	// Cualquier error entra aquí
	app.use(function (err, req, res, next) {
		// set locals, only providing error in development
		res.locals.mensaje = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// Redirecciona a la página de error
		res.render('error', {
			error: err.message
		});
	});
};

// Escribe en la consola cuando el servidor esta iniciado
console.log('Configuración de ExpressJS -> Listo!');
