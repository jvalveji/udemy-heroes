// Definición para el fichero socket.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez
// Descripción: Fichero utilizado para el manejo de los sockets de la plataforma Arca - MEAN
// Modificado: (30-07-2020) Ing. Dagoberto Gómez Jiménez

const http = require('http'); // Módulo para las funcionalidades de http
const https = require('https'); // Módulo para las funcionalidades de https
const fs = require('fs'); // Módulo para el manejo de archivos

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

module.exports = function (app) {
	// Se determina el entorno actual de la aplicación y se obtiene la configuración 
	var config = require('./config')[process.env.NODE_ENV];

	// Se obtiene el puerto para la aplicación
	const PORT = NormalizarPuerto(config.socket.puerto);

	// Se establece una variable que almacenara la instancia del servidor NodeJS
	var server = null;

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
		server = https.createServer(OPTIONS, app);
	}
	else {
		// Se crea una instancia del servidor NodeJS con las opciones de configuración y el puerto
		server = http.createServer(OPTIONS, app);
	}

	// Obtiene la libreria de socket para el servidor
	var io = require('socket.io')(server);

	/**
   * Método que se dispara cuando detecta una conección al socket
   */
	io.on('connection', (socket) => {
		// Incluye los métodos del core base al socket
		socket = require('./../modules/sockets/base.main')(socket);
	});

	// Agrega el socket como una variable a nivel GLOBAL
	// Ej.:
	// var ioVariable = req.app.get('socketio');
	// ioVariable.to(user._id).emit('message', msg);
	app.set('socketio', io);

	/**
	   * Agrega el puerto del socket en el servidor
	   */
	server.listen(PORT, () => {
		console.log('Socket iniciado -> port ' + PORT);
	});

	// Retorna el objeto servidor con el socket creado
	return server;
};
