// Definición para el fichero catalogosController.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Controlador con las operaciones CRUD de CATALOGOS para interactuar la base de datos mongo.
// Modificado por: (24-06-2020) Ing. Dagoberto Gómez Jiménez

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const HttpResponse = require('./../../../shared/interfaces/httpResponse');
// Se incluyen los modelos necesarios para mongoose
const catalogoModel = require('./../models/catalogosModel');

/**
 * catalogoController.js
 *
 * @description :: Server-side logic for managing catalogos.
 */
module.exports = {

	/**
   * @description Función que obtiene la lista de catálogos.
   */
	list: function (req, res) {
		// Variable que establece los campos a retornar en la consulta (SELECT)
		const _select = {
			id: true,
			nombre: true,
			descripcion: true,
			path: true
		};

		// Busca la información de la colección de catálogos
		catalogoModel.find(null, _select, function (err, catalogos) {
			if (err) {
				return res.status(500).json({
					message: 'No se pudo obtener la lista de catálogos del sistema.',
					error: err
				});
			}

			// Se crea un objeto respuesta y los datos se encapsulan en este
			const respuesta = new HttpResponse(true, null, catalogos);
			// Se obtiene el JSON del mensaje y se envia (200 = OK)
			return res.status(200).send(respuesta.getJSON());
		}).sort({
			nombre: 1 // Retorna los datos ordenado alfabeticamente
		});
	},

};
