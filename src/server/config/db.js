// Definición para el fichero db.js v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer la conexión a la base de datos de MONGO
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

require('events');
// Se obtienen las variables de entorno
const config = require('./config')[process.env.NODE_ENV];
// Se importa el modulo de mongoose 
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function (sistema, baseDatos) {

	// Se obtiene la URL de la base de datos desde las variables de entorno
	var dbCNX = config.db.mongodb[sistema][baseDatos];
	// Variable que almacenara la conexión (ya sea una actual o nueva)
	let cnx = null;

	// Se valida si se debe establecer la conexión a la base de datos según configuración
	if (dbCNX.activo) {
		// variable que establece el nombre de la base de datos
		let nombreConexion = dbCNX.url.substr(dbCNX.url.lastIndexOf('arca'), dbCNX.url.length);
		// Se ejecuta un ciclo que valida si la conexión ya existe entre las creadas por el objeto mongoose
		for (let i = 0; i < mongoose.connections.length; i++) {
			// Valida si existe ya una conexión establecida
			if (mongoose.connections[i].name == nombreConexion) {
				// Asigna la conexión existente
				cnx = mongoose.connections[i];
				break;
			}
		}

		// Se valida si no existe una conexión previa para proceder a crear una nueva
		if (!cnx) {
			// Se crea la conexión nueva a la base de datos
			cnx = mongoose.createConnection(dbCNX.url, {
				// Propiedad que corrige warning sobre indices
				// DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
				useCreateIndex: true,
				useNewUrlParser: true,
				// DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` 
				// without the `useFindAndModify` option set to false are deprecated.
				useFindAndModify: false,
				// DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. 
				// To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor
				useUnifiedTopology: true
			});

			// Se incluye el catch a la conexión para evitar problemas de errores de tipo:
			//  UnhandledPromiseRejectionWarning
			cnx.catch(err => console.log(err));

			// Evento que se ejecuta cuando la conexión a la base de datos fue establecida
			cnx.on('connected', function () {
				console.log('Conexión establecida -> MongoDB [' + nombreConexion + '].');
			});

			// Evento que se ejecuta cuando la conexión a la base de datos tuvo errores
			cnx.on('error', function (err) {
				console.log('Error de conexión [' + nombreConexion + '] -> ' + err);
			});

			// Evento que se ejecuta cuando la conexión a la base de datos fue desconectada
			cnx.on('disconnected', function () {
				console.log('Conexión cerrada -> [' + nombreConexion + '].');
			});

			// Evento que se ejecuta cuando el proceso del servidor Node ha sido cerrado por completo
			process.on('SIGINT', function () {
				cnx.close(function () {
					console.log('Conexiones a las bases de datos finalizada. Proceso principal finalizado.');
					process.exit(0);
				});
			});
		}
	}
	// Returna la conexión a la base de datos
	return cnx;
};
