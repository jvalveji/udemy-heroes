// Definición para el fichero environment.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Fichero de configuración del api para el ambiente DEVELOPMENT
// Los puertos a utilizar son los siguientes:
// +-----------+---------+------------+
// | Protocolo | default | secundario |
// +===========+=========+============+
// | http      | 80      | 8080       |
// +-----------+---------+------------+
// | https     | 443     | 8443       |
// +-----------+---------+------------+
// Para más detalle: http://arcagitlab.ccss.sa.cr/arca-base/arca.bcore/wikis/puertos%20ambientes
// Modificado:

module.exports = {
	// Se indica el ID mongo de la aplicación según catálogo aplicaciones Arca
	aplicacion: '5a8c62efc4560fa41a3797bf',
	// Indicador si la aplicación api es HTTPS o HTTP
	esHttps: false,
	// Ruta raiz donde se ubican los ficheros del servidor (equipo local)
	rootPath: 'src/server/',
	// Ruta raiz donde se ubican los certificados SSL válidos
	get sslRootPath() {
		// Valida el tipo de aplicación
		return (this.esHttps) ? {
			// Retorna los certificados CCSS
			key: '/usr/local/ssl.ccss.arca/ccss.key',
			cert: '/usr/local/ssl.ccss.arca/ccss.crt',
			ca: '/usr/local/ssl.ccss.arca/ccssCA.crt'
		} : {
				// Retorna los certificados propios para las aplicaciones ARCA
				key: '/usr/local/ssl.ccss.arca/arca-key.pem',
				cert: '/usr/local/ssl.ccss.arca/arca-cert.pem'
			};
	},
	// Puerto donde arrancará el servidor api
	get port() {
		return (this.esHttps) ? 443 : 3000;
	},
	// Conexiones a bases de datos
	db: {
		mongodb: {
			mixin: {
				core: {
					activo: true,
					url: 'mongodb://127.0.0.1:27017/arca-core'
				},
				archivos: {
					activo: false,
					url: 'mongodb://127.0.0.1:27017/arca-archivos'
				},
				rpm: {
					activo: true,
					url: 'mongodb://127.0.0.1:27017/bitzu-rpm'
				}
			}
		}
	},
	// Servicios web externos
	ws: {
		mise: {
			url: 'https://misetest.ccss.sa.cr/miseservicios',
			sistema: 'SIAN' // Identificador del sistema en el MISE (Sistema Arca MIxin)
		},
		tokens: {
			url: 'https://misetest.ccss.sa.cr/gestortoken',
			user: 'arca',
			pass: 'arca123'
		},
		timeout: 10 // Indica el tiempo de espera (timeout en segundos)
	},
	// Servidor Pentaho
	pentaho: {
		ssh: 'arcapentahopruebas.ccss.sa.cr',
		repo: 'arcapentahopruebas',
		home: 'https://arcapentahopruebas.ccss.sa.cr/pentaho'
	},
	// Configuración para el socket de la aplicación
	socket: {
		activo: true,
		puerto: 44301, // Puerto donde arranca el socket
		limiteMB: '20mb'
	},
	// Configuración para las tareas (task) de la aplicación
	tasks: {
		activo: true,
		esRegistrada: false
	}
};
