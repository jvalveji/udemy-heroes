// Definición typescript para la directiva AccesoAppDirective v3.1.2
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (14-06-2019) Ing. Dagoberto Gómez Jiménez

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';

// Se importa el servicio de autorización
import { AutorizacionService } from '../services/autorizacion.service';

/**
 * Directiva encargada de mostrar/destruir a nivel del DOM un elemento HTML
 * a partir de la validación de(los) perfil(es) de usuario indicados.
 * Valida por nombre de aplicación
 */
@Directive({
	selector: '[arcaAccesoApp]'
})
export class AccesoAppDirective implements OnInit {

	/**
	 * Variable que representa el nombre de la aplicación a validar
	 */
	private nombreApp: string;

	/**
	 * Constructor por defecto de la clase
	 * @param templateRef Referencia del template
	 * @param viewContainer Representa un contendor
	 * @param auth Representa al servicio de autorización
	 */
	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private auth: AutorizacionService) { };

	/**
	 * Parámetro de entrada que recibe el nombre del app a validar
	 */
	@Input() set arcaAccesoApp(app: string) {
		this.nombreApp = app;
	};

	/**
	 * Método inicial de la directiva
	 */
	public ngOnInit() {
		// Se obtiene el valor de las variables privadas
		let elementoActivo = false;
		const tr = this.templateRef;
		const vc = this.viewContainer;

		// Valida que exista la cadena(string) con el nombre de la aplicación
		if (this.nombreApp) {
			// Se valida si la cadena posee más de una aplicación (se usa de separador la "coma");
			// en caso contrario crea un arreglo de un solo elemento
			const apps = (this.nombreApp.indexOf(',', 0) > 0) ? this.nombreApp.split(',') : [this.nombreApp];
			// Recorre el arreglo de aplicaciones para validar cada uno
			apps.forEach(app => {
				// Invoca el servicio encargado de validar el app
				this.auth.ValidateByNombreAplicacion(app.trim()).then(resp => {
					// Se valida que la respuesta sea VERDADERA y que no se haya PINTADO en el DOM el componente
					if (resp && !elementoActivo) {
						vc.createEmbeddedView(tr);
						elementoActivo = true;
					}
					//  else if (!resp && hasView) {
					//   vc.clear();
					//   hasView = false;
					// }
				});
			})
		}
	};
}
