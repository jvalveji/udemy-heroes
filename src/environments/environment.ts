// Definición para el fichero environment.ts v1.0.0
// Proyecto: Bitzu
// Definiciones por: Equipo de TI Plan de Innovación
// Modificado:

/**
 * Fichero utilizado para establecer las variables de configuración
 * del servidor Web cliente en el ambiente DEVELOPMENT
 */
export const environment = {
	// Indicador de la versión de la aplicación (igual al package.json)
	version: '0.1.0',
	// Parámetro para indicar el aplicativo registrado en el catálogo de aplicaciones Arca
	aplicativo: 'arca.ncore',
	// Indicador de ambiente actual para el usuario
	ambiente: 'DESARROLLO',
	// Indicador si el aplicativo es de producción o no
	production: false,
	// Url del servidor de recursos Web
	urlWebkit: 'https://arcapruebas.ccss.sa.cr/webkit',
	// Url's de los servicios rest
	urlApi: {
		// API principal del proyecto (ajustar protocolo dependiendo de su api: HTTP/HTTPS)
		main: 'http://127.0.0.1:3000/bitzu-api',
		// API para el manejo de impresoras a nivel local
		printer: 'http://127.0.0.1:9310/bitzuPrinter-1.0/'
	},
	// Url's para los distintos sockets de las aplicaciones Bitzú
	sockets: {
		// Socket principal del proyecto (ajustar protocolo y puerto dependiendo de su api: HTTP/HTTPS
		main: 'http://127.0.0.1:44301'
		// Acá puede agregar otros sockets de otros sistemas incluso
	},
	// Url's de los servicios Web generales
	urlWs: {
		nombre: 'http://url/'
	},
	pentaho: 'https://arcapentahopruebas.ccss.sa.cr/pentaho/api/repos/'
};
