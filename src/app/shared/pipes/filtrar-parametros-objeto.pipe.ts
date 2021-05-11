// Definición typescript de pipe filtrar-parametros-objeto para filtrar lista de parámetros de un objeto v2.0.0
// Proyecto: Arca MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripciòn: Se encarga del manejo de filtros para visualizar ò no en el DOM una lista de objetos
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

import { Pipe, PipeTransform } from '@angular/core';

/** Se encarga del manejo de filtros para visualizar ò no en el DOM una lista de objetos por parámetros */
@Pipe({
	name: 'filtrarParametrosObjeto',
	pure: true
})
export class FiltrarParametrosObjetoPipe implements PipeTransform {
	/**
	 *
	 * @param items representa la colección de todos los elementos del objeto
	 * @param filter representa el elemento a comparar con los campos a filtrar
	 */
	public transform(items: any[], filter: any): any[] {
		if (!items || !filter) {
			return items;
		}

		// filtrar elementos del array , los elementos que coincidan devuelven cierto y se mantendrán, los falsos serán filtrados
		const item = items.reduce(function (acc, element) {
			return Array.isArray(element) ? acc.concat(element) : acc.concat([element]);
		}, []).filter((itemA: any) => this.applyFilter(itemA, filter));
		return items.filter((itemB: any) => this.applyFilter(itemB, filter));
	};

	/**
	 *
	 * @param item representa la colección de todos los elementos
	 * @param filter representa el elemento a comparar con los campos a filtrar
	 */
	private applyFilter(item: any, filter: any): boolean {
		for (const field in filter) {

			// si el campo a filtrar es del modelo directamente ejecuta este segmento
			if (filter[field]) {
				if (typeof filter[field].descripcion === 'string') {
					if (item[field].descripcion.toLowerCase().indexOf(filter[field].descripcion.toLowerCase()) === -1) {
						return false;
					}
				} else if (typeof filter[field] === 'number') {
					if (item[field] !== filter[field]) {
						return false;
					}
				}
				else if (typeof filter[field] === 'string') {
					if (String(item[field]).toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
						return false;
					}
				}
				else if (typeof filter[field] === 'boolean') {
					if (item[field] !== filter[field]) {
						return false;
					}
				}
			}
		}

		return true;
	};
}
