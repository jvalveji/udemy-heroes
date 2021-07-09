// Definición typescript para el componente NotFoundComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-05-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment';
import { Component } from '@angular/core';
import { Location } from '@angular/common';

/**
 * Componente destinado al despligue de la página de error en caso de acceder a rutas no válidas
 * en la plataforma Arca - MEAN
 */
@Component({
	selector: 'arca-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
	/**
	 * Url que maneja la ubicación del servidor de recursos Web
	 */
	public UrlWebkit: string;

	/**
	 * Contructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 */
	constructor(private _location: Location) {
		// Establece el ambiente actual del webkit
		this.UrlWebkit = environment.urlWebkit;
	}

	/**
	 * Método que se encarga de retornar al usuario a la ventana anterior
	 */
	public IrPaginaAnterior(): void {
		// Retorna a la ventana anterior
		this._location.back();
	};
}
