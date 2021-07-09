// Definición para el fichero preferenciasController.js v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de PREFERENCIAS USUARIOS para interactuar la base de datos mongo.
// Modificado: (25-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../../shared/interfaces/httpResponse');
const preferenceModel = require('./../models/preferenciasModel');
// Se incluye el fichero de funciones utilitarias
const utils = require('./../../../../shared/services/utilidadesService');

/**
 * preferencesUsuariosController.js
 *
 * @description :: Server-side logic for managing prefererencias-usuarios.
 */
module.exports = {
	/**
	 * preferencesUsuariosController.update()
     * @description Función encargada de actualizar las preferencias del usuario por aplicación
     */
	update: function (req, res) {
		// Variable que establece el filtro de la consulta a la base de datos (WHERE)
		const _where = {
			aplicacion_id: req.params.app,
			usuario_id: req.params.user
		};

		// Realiza el proceso de actualización
		preferenceModel.findOne(_where, function (err, preference) {
			if (err) {
				let respuesta = new HttpResponse(false, 'Error al buscar el registro a actualizar.', null);
				return res.status(500).send(respuesta.getJSON());
			}
			// Valida si NO existe para crealo
			if (!preference) {
				// Crea un nuevo objeto
				preference = new preferenceModel();
				// Establece los datos
				preference.set({
					aplicacion_id: req.params.app,
					usuario_id: req.params.user
				});
			}

			// Establece los datos
			preference.set({
				temaApp: req.body.temaApp
			});

			// Guarda los datos
			preference.save(function (err, data) {
				if (err) {
					let respuesta = new HttpResponse(false, 'Error al guardar el registro de preferencias.', null);
					return res.status(500).send(respuesta.getJSON());
				}
				let respuesta = new HttpResponse(true, 'Registro actualizado con éxito.', data);
				// devuelve la respuesta de exito
				return res.status(200).send(respuesta.getJSON());
			});
		});
	}
};
