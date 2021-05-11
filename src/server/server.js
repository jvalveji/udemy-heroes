// Definición para el fichero server.js v8.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para cargar los distintos archivos de configuración 
//              para la instancia del servidor de NodeJS
// Modificado: (30-07-2020) Ing. Dagoberto Gómez Jiménez

const express = require('express'); // Módulo de ExpressJS
const http = require('http'); // Módulo para las funcionalidades de http
const https = require('https'); // Módulo para las funcionalidades de https
const fs = require('fs'); // Módulo para el manejo de archivos
const path = require('path');

// Se establece el entorno actual de la aplicación.
// Para ello se lee el archivo de configuración del entorno
// Entornos posibles:
//  * development
//  * test
//  * production
//  * demo
// Se lee el archivo donde se establece el entorno y se parsea a JSON
let environment = JSON.parse(fs.readFileSync(path.join(__dirname, '../env-api.json')));

// Se asigna el entorno encontrado
process.env.NODE_ENV = (process.env.NODE_ENV) ? process.env.NODE_ENV : environment.env;

// Se incrementa el tamaño de la pila de hilos que controlan los ciclos a nivel de servidor; esto por cuanto
// en casos donde hay funciones asincronas en ciclos (loops) que realizan RESQUEST (ejemplo usando async.waterfall)
// pueden provocar latencias en las respuesta por NEGACIÓN DEL DNS por lo que desencadena en errores de tipo ESOCKETTIMEDOUT y ETIMEDOUT
// Referencias:	* https://stackoverflow.com/a/37946399
//				* http://docs.libuv.org/en/latest/threadpool.html
//				* https://eng.uber.com/denial-by-dns/
process.env.UV_THREADPOOL_SIZE = 128; // Rango: Min:128 <-> Max:1024

// Se obtiene la configuración basado en el ambiente actual
const config = require('./config/config')[process.env.NODE_ENV];

// Se crea una instancia de ExpressJS
let app = express();

// Se obtiene el puerto y se establece
const PORT = NormalizarPuerto(config.port);
app.set('port', PORT);

// Se establece la configuración del ExpressJS a partir del entorno
require('./config/express')(app, config);

// Se establece una variable que almacenara la instancia del servidor NodeJS
let server = null;

// Constante que tiene la ubicación del certificado y la llave
const OPTIONS = {
	key: fs.readFileSync(config.sslRootPath.key),
	cert: fs.readFileSync(config.sslRootPath.cert)
	// requestCert: false,
	// rejectUnauthorized: false
};

// Valida si el despliegue es por HTTPS o HTTP
if (config.esHttps) {
	// Agrega el certificado de la entidad autorizada (CA)
	OPTIONS['ca'] = fs.readFileSync(config.sslRootPath.ca);
	// Se crea una instancia del servidor NodeJS con las opciones de configuración y el puerto
	server = https.createServer(OPTIONS, app).listen(PORT);
}
else {
	// Se crea una instancia del servidor NodeJS con las opciones de configuración y el puerto
	server = http.createServer(app).listen(PORT);
}

// Se agregan los eventos error y listening para los logs
server.on('error', onError);
server.on('listening', onListening);

// Se establece el timeout a cero para destruir los sockets inmediatamente (problema con el chrome -> STALLED)
// Ref: * https://stackoverflow.com/a/41237262
//      * https://stackoverflow.com/a/29732252
server.setTimeout(0);

/**
 * Función que se encarga de normalizar el puerto establecido en al configuración
 * @param {*} val Valor para el puerto (string|number)
 */
function NormalizarPuerto(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 * @param {*} error Handler con el error del servidor
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var addr = server.address();
	var port = addr.port;

	var bind = typeof port === 'string' ?
		'Pipe ' + port :
		'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requiere privilegios elevados.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' ya se encuentra en uso.');
			process.exit(1);
			break;
		case 'EPIPE':
			console.error(bind + ' error en tiempo de ejecución.');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ?
		'pipe ' + addr :
		'port ' + addr.port;

	console.log('Protocolo -> ' + ((config.esHTTPS) ? 'HTTPS' : 'HTTP'));
	console.log('Escuchando -> ' + bind);
}

console.log('Configuración servidor Web NodeJS -> Listo!');

// Se retorna el módulo recién creado
exports = module.exports = app;
