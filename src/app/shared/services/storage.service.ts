// Definición typescript para el servicio StorageService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (22-06-2020) Ing. Dagoberto Gómez Jiménez

import { Injectable } from '@angular/core';

/**
 * Servicio encargado de gestionar el almacenamiento temporal de la sesión del usuario
 * mediante el "localstorage" del navegador.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {

	/**
	 * Constructor de la clase
	 */
	constructor() { }

	/**
	 * Método encargado de establecer un conjunto de datos en el almacenamiento local
	 * @param data Datos a guardar en el almacenamiento local
	 */
	public storage(data: any): void {
		localStorage.setItem('arca-storage', JSON.stringify(data));
	};

	/**
	 * Método encargado de obtener los datos almacenado localmente
	 * @returns Retorna los datos contenidos en el localstorage para la sesión del usuario actual
	 */
	public _storage(): any {
		return JSON.parse(localStorage.getItem('arca-storage') || null);
	};

	/**
	 * Método encargado de eliminar los datos del almacenamiento local
	 */
	public eliminar(): void {
		localStorage.removeItem('arca-storage');
	};
}
