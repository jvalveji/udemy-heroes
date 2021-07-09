// Definición typescript para el componente LayoutComponent v2.0.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (03-08-2020) Ing. Dagoberto Gómez Jiménez

import { Component } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';

/**
 * Componente utilizado para "contener" las vistas del módulo APP
 */
@Component({
	selector: 'arca-inicio',
	template: '<router-outlet><span class="loader-spinner-arca" *ngIf="loading"></span></router-outlet>'
})
export class LayoutComponent {
	// Variable para mostrar/ocultar el spinner de carga
	public loading: boolean;

	/**
	* Constructor de la clase
	*/
	constructor(router: Router) {
		// Inicia en falso la bandera del spinner
		this.loading = false;
		// Crea un observable para el evento de cambio de rutas
		router.events.subscribe(
			(event: RouterEvent): void => {
				// Valida si esta iniciando el cmabio de ruta
				if (event instanceof NavigationStart) {
					// Activa la bandera (muestra el spinner)
					this.loading = true;
				} else if (event instanceof NavigationEnd) {
					// Inactiva la bandera (oculta el spinner)
					this.loading = false;
				}
			}
		);
	}
}
