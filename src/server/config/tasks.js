// Definición para el fichero tasks.js v2.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para el manejo de tareas programádas en la plataforma Arca - MEAN
// Modificado: (06-07-2020) Ing. Dagoberto Gómez Jiménez

module.exports = function (app) {
	/**
	 * Acá se agregan las referencias de los ficheros que contengan la definición
	 * de las tareas para cada proyecto en la plataforma Arca - MEAN
	 */
	require('./../modules/tasks/base.main')(app); // Deficiones proyecto base

	/**
	 * En esta sección se realiza la INICIALIZACION de las tareas que requieran
	 * "arrancar" cuando el servidor Web inicia.
	 * Ej.:
	 * const var1 = app.get(<nombre_variable_tarea>);
	 * var1.start();
	 */

	// Obtiene la variable que representa la tarea
	const _taskMensajesBroadcast = app.get('taskMensajesBroadcast');
	const _taskDeleteGridFS = app.get('taskDeleteGridFS');

	// Inicia la tarea
	_taskMensajesBroadcast.start();
	_taskDeleteGridFS.start();
};
