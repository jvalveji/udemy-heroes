// Definición para el fichero mise-servicios.js v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Descripción: Enumerador para definir los servicios MISE disponibles

/**
 * Se declara un enum para definir los servicios MISE
 */
module.exports = Object.freeze({
	/**
	 * Indicador obtener el(los) perfil(es) del usuario
	 */
	PERFILES: {
		name: 'perfiles',
		method: 'GET'
	},
	/**
	 * Indicador obtener permisos asociados a un perfil
	 */
	PERMISOS: {
		name: 'restriccionesrecurso',
		method: 'GET'
	},
	/**
	 * Indicador cambio de contraseña
	 */
	CAMBIO_CLAVE: {
		name: 'cambiarclave',
		method: 'POST'
	}
});