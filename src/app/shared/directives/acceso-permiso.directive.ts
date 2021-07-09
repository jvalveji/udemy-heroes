// Definición typescript para la directiva AccesoPermisoDirective v1.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificación: (06-06-2019) Ing. Andrés Salas Brenes <asalasb@ccss.sa.cr>

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';

// Se importa el servicio de autorización
import { AutorizacionService } from '../services/autorizacion.service';

/**
 * Directiva encargada de mostrar/destruir a nivel del DOM un elemento HTML
 * a partir de la validación del(los) permiso(s) de usuario indicados.
 * Valida por permiso de usuario de la aplicación
 */
@Directive({
	selector: '[arcaAccesoPermiso]'
})
export class AccesoPermisoDirective implements OnInit {

	/**
	 * Variable que representa el nombre del permiso a validar
	 */
	private nombrePermiso: string;

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
	 * Parámetro de entrada que recibe el nombre del permiso a validar
	 */
	@Input() set arcaAccesoPermiso(permiso: string) {
		this.nombrePermiso = permiso;
	};

	/**
	 * Método inicial de la directiva
	 */
	public ngOnInit() {
		// Se obtiene el valor de las variables privadas
		let elementoActivo = false;
		const tr = this.templateRef;
		const vc = this.viewContainer;

		// Valida que exista la cadena(string) con el nombre del permiso
		if (this.nombrePermiso) {
			// Se valida si la cadena posee más de un permiso (se usa de separador la "coma");
			// en caso contrario crea un arreglo de un solo elemento
			const permisosDirectiva = (this.nombrePermiso.indexOf(',', 0) > 0) ? this.nombrePermiso.split(',') : [this.nombrePermiso];
			// Obtiene la lista de permisos contenida en el localstorage
			const permisosLocalStorage = JSON.parse(localStorage.getItem('arca-user')).permisos;
			// Valida si existen datos
			if (permisosLocalStorage && permisosLocalStorage.length > 0) {
				// Recorre el arreglo de permisos indicados para validar cada uno
				permisosDirectiva.forEach(_permisoDirectiva => {
					// Recorre los permisos del local storage y valida si el permiso existe
					permisosLocalStorage.some((_permisolocal, index) => {
						// Si existe el permiso PINTA el objeto
						if (!elementoActivo && _permisolocal.nombre === _permisoDirectiva) {
							vc.createEmbeddedView(tr);
							elementoActivo = true;
							return true;
						}
					});
				});
			}
		}
	};
}
