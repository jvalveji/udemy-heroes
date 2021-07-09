// Definición typescript para el servicio AutorizacionService v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado:

export const ELEMENTO_ACTIVO = '__activate__';

/**
 * Función de encabezado en los componentes Angular para manejar la
 * seguridad del componente asociado a los permisos de usuario y las rutas
 * @param permisos Lista de permisos a validar
 */
export function Activate(permisos: string[]): ClassDecorator {
	return function decorator(target) {
		target[ELEMENTO_ACTIVO] = permisos;
	}
};
