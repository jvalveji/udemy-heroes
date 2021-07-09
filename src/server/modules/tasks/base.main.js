// Definición para el fichero base.main.js v1.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para la defición de tareas programadas en la plataforma Arca - MEAN
// Modificado: (06-07-2020) Ing. Dagoberto Gómez Jiménez

module.exports = function (app) {
	// Sección 1: Declaración de los manejadores (HANDLERS) de cada una de las tareas
	const handlerMensajesBroadcast = null;
	const handlerDeleteGridFS = null;

	// Sección 2: Variables que contiene el archivo con la definición de la tarea
	const _taskMensajesBroadcast = require('./base.broadcast')(handlerMensajesBroadcast, app);
	const _taskDeleteGridFS = require('./base.gridfs')(handlerDeleteGridFS);

	// Sección 3: Se agregan las tareas como una variable global en el server
	app.set('taskMensajesBroadcast', _taskMensajesBroadcast);
	app.set('taskDeleteGridFS', _taskDeleteGridFS);
};