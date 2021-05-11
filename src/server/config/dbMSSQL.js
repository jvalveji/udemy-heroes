// Definición para el fichero dbMSSQL.js v2.0.0
// Proyecto: Arca - MEAN
// Descripción: Fichero con las configuraciones requeridas para establecer conexiones a
//				bases de datos relacionales SQL Server mediante el módulo de Sequelize
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

const Sequelize = require('sequelize');
const config = require('./config')[process.env.NODE_ENV];

const sequelizeModule = function (baseDatos) {
	// Se obtiene la URL de la base de datos desde las variables de entorno
	var dbURL = config.db.mssql[baseDatos].url;
	const sequelize = new Sequelize(dbURL, {
		dialect: 'mssql',
		dialectOptions: {
			useUTC: false, //for reading from database
			appName: config.db.mssql[baseDatos].appName,
			encrypt: false
		},
		port: 1433,
		timezone: '+00:00', //for writing to database
		pool: {
			max: 5,
			min: 0,
			idle: 20000,
			acquire: 20000
		}
	});

	console.log('Conexión establecida -> SQLserver = ' + baseDatos);
	// Returna la conexión a la base de datos
	return sequelize;
};

module.exports = sequelizeModule;
