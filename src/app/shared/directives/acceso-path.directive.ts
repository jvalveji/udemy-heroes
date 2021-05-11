// Definición typescript para la directiva AccesoPathDirective v3.1.2
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (14-06-2019) Ing. Dagoberto Gómez Jiménez

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';

// Se importa el servicio de autorización
import { AutorizacionService } from '../services/autorizacion.service';

/**
 * Directiva encargada de mostrar/destruir a nivel del DOM un elemento HTML
 * a partir de la validación de(los) perfil(es) de usuario indicados.
 * Valida por path de aplicación
 */
@Directive({
	selector: '[arcaAccesoPath]'
})
export class AccesoPathDirective implements OnInit {

	/**
	 * Variable que representa el nombre del path a validar
	 */
	private nombrePath: string;

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
	 * Parámetro de entrada que recibe el nombre del path a validar
	 */
	@Input() set arcaAccesoPath(path: string) {
		this.nombrePath = path;
	};

	/**
	 * Método inicial de la directiva
	 */
	public ngOnInit() {
		// Se obtiene el valor de las variables privadas
		let elementoActivo = false;
		const tr = this.templateRef;
		const vc = this.viewContainer;

		// Valida que exista la cadena(string) con el nombre del perfil
		if (this.nombrePath) {
			// Se valida si la cadena posee más de un path (se usa de separador la "coma");
			// en caso contrario crea un arreglo de un solo elemento
			const paths = (this.nombrePath.indexOf(',', 0) > 0) ? this.nombrePath.split(',') : [this.nombrePath];
			// Recorre el arreglo de perfiles para validar cada uno
			paths.forEach(path => {
				// Invoca el servicio encargado de validar el perfil
				this.auth.ValidateByNombrePath(path.trim()).then(resp => {
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
