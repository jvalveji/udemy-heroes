// Definición para el fichero base.main.js v2.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagpberto Gómez Jimñenez
// Descripción: Fichero utilizado en la definición de los sockets del core base del proyecto Arca - MEAN.
// Modificado: (07-07-2020) Ing. Dagoberto Gómez Jiménez

module.exports = function (socket) {

	// Sección 1: Variables que contiene la función con la definición del socket
	const _socketMensajesBroadcast = require('./base.broadcast')(socket);
	const _socketMensajesChat = require('./base.chat')(socket);

	// Sección 2: Se registran las funciones de cada socket al objeto principal
	// (En la función "ON" del socket se define/registra cada función a implementar)
	socket.on('bitzu.broadcast', _socketMensajesBroadcast); // Mensajes tipo broadcast para los usuarios
	socket.on('bitzu.chat', _socketMensajesChat);// Socket para la mensajeria por chat

	// Retorna el socket con las nuevas acciones registradas
	return socket;
};