// Definición typescript para el filtro FiltrarIdDescripcionPipe v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

import { Pipe, PipeTransform } from '@angular/core';

// Se importan los servicios a utilizar
import { UtilidadesService } from '../../shared/services/utilidades.service';

/**
 * Filtro aplicable a arreglos de datos para buscar por las propiedades id y descripción
 *
 * @example
 * <ul *ngFor="let item of Items | filtrarIdDescripcion: filtro">
 *  <li></li>
 * </ul>
 *
 * Donde:
 *  - Items: Arreglo de datos (debe incluir las propiedades id y descripcion)
 *  - filtro: texto con el filtro
 */
@Pipe({
	name: 'filtrarIdDescripcion',
	pure: true
})
export class FiltrarIdDescripcionPipe implements PipeTransform {

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
			const descripcion = UtilidadesService.prototype.ClearString(_item.descripcion);
			texto = UtilidadesService.prototype.ClearString(texto);
			// Valida las coincidencias y returna el valor original (sin el clear)
			if ((_item.id + ' ' + descripcion.toLowerCase()).includes(texto.toLowerCase())) { return _item.id + ' ' + _item.descripcion };
		});
	};
}
