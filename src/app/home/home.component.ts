// Definición typescript para el componente HomeComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-05-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment';
import { Component } from '@angular/core';

/**
 * Componente destinado al despligue y manejo del home del módulo APP
 */
@Component({
	templateUrl: './home.component.html',
	styleUrls: [
		// './styles/styles-bootstrap.min.css',
		'./styles/styles.css'
	]
})
export class HomeComponent {
	/**
	 * Variable que almacena el dato de la fecha actual
	 */
	public annoActual = new Date();
	/**
	 * Url que maneja la ubicación del servidor de recursos Web
	 */
	public UrlWebkit: string;

	/**
     * Constructor de la clase
     */
	constructor() {
		// Establece el ambiente actual del webkit
		this.UrlWebkit = environment.urlWebkit;
	}
}
