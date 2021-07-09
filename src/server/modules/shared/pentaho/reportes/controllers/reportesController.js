// Definición para el fichero reportesController.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Andrés Salas Brenes <aasalab@ccss.sa.cr>
//					Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado:

// Se incluye el fichero con la definición de la respuesta HTTP genérica
const request = require('request'); // Módulo request para solicitudes http
const fs = require('fs'); // Módulo para el manejo de archivos

/**
 * reportesController.js
 *
 * @description :: Server-side logic for managing reportesController.
 */
module.exports = {

	/**
	* reportesController.show()
	* @description Método encargado de obtener el reporte del pentaho.
	*/
	show: function (req, res) {
		// Se obtienen los parámetros de la consulta
		var usuario = req.userArcaRequest.user.usuario;
		var unidadProgramatica = req.userArcaRequest.up.idUP;
		var nombreReporte = req.params.name;

		// Se realiza un request al servidor de Pentaho para obtener el reporte
		request(req.body.urlPentaho, {
			method: 'GET',
			'rejectUnauthorized': false,
			'encoding': 'binary',
			'headers': {
			}
		}, (err, res2, body) => {
			// Se valida si existe un error en la consulta
			if (err) {
				// Se retorna el mensaje de respuesta
				return res.status(500).send('Se produjo un error tratando de obtener el reporte desde la plataforma Arca - Pentaho.');
			}
			// Se establece el CONTENT-TYPE a devolver al usuario es el response
			res.contentType(req.body.mime + ';charset=UTF-8');
			// Obtiene la la hora y fecha actual
			let fechaActual = new Date();
			// Se obtiene de la fecha el formato especifico
			let formatted_date = fechaActual.getFullYear() + (fechaActual.getMonth() + 1) + fechaActual.getDate() + '_' + fechaActual.getHours() + fechaActual.getMinutes();
			// Se establece el nombre del archivo con el formato: pentaho_UP_USUARIO_YYYYMMDD_HHMM
			var filename = 'pentaho_' + unidadProgramatica + '_' + usuario + '_' + formatted_date + req.body.ext;
			// Se establece la ruta absoluta donde se va a crear el archivo
			var path = '/tmp/' + filename;
			// Se procede a escribir el archivo de reporte fisicamente en el servidor
			fs.writeFile(path, body, 'binary', function (err) {
				// Se valida si existe un error en la escritura del fichero
				if (err) {
					// Se retorna el mensaje de respuesta
					return res.status(500).send('Se produjo un error en el proceso de generación del archivo asociado al reporte.');
				}
				else {
					fs.readFile(path, (err2, dataf) => {
						// Se valida si existe un error en la escritura del fichero
						if (err2) {
							// Se retorna el mensaje de respuesta
							return res.status(500).send('Se produjo un error accediendo al archivo temporal asociado al reporte.');
						}
						// Se elimina el archivo temporal
						fs.unlinkSync(path);
						// Se re-envia el reporte al usuario
						res.status(200).send(dataf);
					});
				}
			});
		});
	}
};