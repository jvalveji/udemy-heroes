// Definición typescript para la directiva AccesoPerfilDirective v3.1.2
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (14-06-2019) Ing. Dagoberto Gómez Jiménez

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';

// Se importa el servicio de autorización
import { AutorizacionService } from '../services/autorizacion.service';

/**
 * Directiva encargada de mostrar/destruir a nivel del DOM un elemento HTML
 * a partir de la validación de(los) perfil(es) de usuario indicados.
 * Valida por perfil de usuario de la aplicación
 */
@Directive({
	selector: '[arcaAccesoPerfil]'
})
export class AccesoPerfilDirective implements OnInit {

	/**
	 * Variable que representa el nombre del perfil a validar
	 */
	private nombrePerfil: string;

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
	 * Parámetro de entrada que recibe el nombre del perfil a validar
	 */
	@Input() set arcaAccesoPerfil(perfil: string) {
		this.nombrePerfil = perfil;
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
		if (this.nombrePerfil) {
			// Se valida si la cadena posee más de un perfil (se usa de separador la "coma");
			// en caso contrario crea un arreglo de un solo elemento
			const perfiles = (this.nombrePerfil.indexOf(',', 0) > 0) ? this.nombrePerfil.split(',') : [this.nombrePerfil];
			// Recorre el arreglo de perfiles para validar cada uno
			perfiles.forEach(perfil => {
				// Invoca el servicio encargado de validar el perfil
				this.auth.ValidateByNombrePerfil(perfil.trim()).then(resp => {
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
			});
		}
	};
}
