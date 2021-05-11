// Definición para el fichero environment.prod.ts v6.4.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (30-07-2020) Ing. Dagoberto Gómez Jiménez

/**
 * Fichero utilizado para establecer las variables de configuración
 * del servidor Web cliente en el ambiente PRODUCTION
 */
export const environment = {
	// Indicador de la versión de la aplicación (igual al package.json)
	version: '10.3.0',
	// Parámetro para indicar el aplicativo registrado en el catálogo de aplicaciones Arca
	aplicativo: 'arca.<nombre_clave>',
	// Indicador de ambiente actual para el usuario
	ambiente: 'PRODUCCIÓN',
	// Indicador si el aplicativo es de producción o no
	production: true,
	// Url del servidor de recursos Web
	urlWebkit: 'https://arca.ccss.sa.cr/webkit',
	// Url's de los servicios rest
	urlApi: {
		// API principal del proyecto (ajustar protocolo dependiendo de su api: HTTP/HTTPS)
		main: '<http|https>://<ip|dns>/bitzu-api',
		// API para el manejo de impresoras a nivel local
		printer: 'http://127.0.0.1:9310/arcaPrinter-1.0/'
	},
	// Url's para los distintos sockets de las aplicaciones Arca - MEAN
	sockets: {
		// Socket principal del proyecto (ajustar protocolo y puerto dependiendo de su api: HTTP/HTTPS)
		main: '<http|https>://<ip|dns>:<port>'
		// Acá puede agregar otros sockets de otros sistemas incluso
	},
	// Url's de los servicios Web generales
	urlWs: {
		hospitalizacion: 'http://10.76.18.20/WSInformacionArca/InformacionArcaRest.svc/'
	},
	pentaho: 'https://arcapentaho.ccss.sa.cr/pentaho/api/repos/'
};

