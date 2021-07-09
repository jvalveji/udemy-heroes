// Definición para el fichero config.js v11.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero utilizado para establecer los ficheros de configuración
//				para los servicios rest dependiendo del ambiente a desplegar
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

module.exports = {
	development: require('./environments/environment'),
	test: require('./environments/environment.test'),
	production: require('./environments/environment.prod'),
	demo: require('./environments/environment.demo')
};
