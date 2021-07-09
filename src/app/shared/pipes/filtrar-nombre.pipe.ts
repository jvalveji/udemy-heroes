// Definición typescript para el filtro FiltrarNombrePipe v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Felix Lee Pan <fleepan@ccss.sa.cr> (04-10-2018)
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

import { Pipe, PipeTransform } from '@angular/core';

// Se importan los servicios a utilizar
import { UtilidadesService } from '../../shared/services/utilidades.service';

/**
 * Filtro aplicable a arreglos de datos para buscar por las propiedad nombre
 *
 * @example
 * <ul *ngFor="let item of Items | filtrarDescripcion: filtro">
 *  <li></li>
 * </ul>
 *
 * Donde:
 *  - Items: Arreglo de datos (debe incluir la propiedad nombre)
 *  - filtro: texto con el filtro
 */
@Pipe({
	name: 'filtrarNombre',
	pure: true
})
export class FiltrarNombrePipe implements PipeTransform {

	/**
	 * Método encargado de realizar la tranformación de los valores
	 * @param items Indica el arreglo de datos a filtrar
	 * @param texto Filtro para aplicar al arreglo de datos
	 * @return Retorna el valor desinfectado hacia el DOM
	 */
	public transform(items: any, texto: any): any {
		// Valida que existan datos y sea una cadena de texto
		if (!texto || !(typeof texto === 'string' || texto instanceof String)) { return items };
		// Retorna un nuevo arreglo filtrado
		return items.filter(function (_item) {
			// Limpia las cadenas de texto
			const nombre = UtilidadesService.prototype.ClearString(_item.nombre);
			texto = UtilidadesService.prototype.ClearString(texto);
			// Valida las coincidencias y returna el valor original (sin el clear)
			if (nombre.toLowerCase().includes(texto.toLowerCase())) { return _item.nombre };
		});
	};

}
