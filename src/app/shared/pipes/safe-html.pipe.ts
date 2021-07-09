// Definición typescript para el pipe SafeHtmlPipe v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Implementación de DomSanitizer para código HTML que ayuda a prevenir errores de seguridad de Cross Site Scripting
 * XSS) al desinfectar los valores para que sean seguros de usar en los diferentes contextos DOM.
 */
@Pipe({
	name: 'safeHtml',
	pure: true
})
export class SafeHtmlPipe implements PipeTransform {

	/**
	 * Constructor de la clase
	 * @param sanitizer  Representa el objeto que desinfecta los valores
	 */
	constructor(private sanitizer: DomSanitizer) { }

	/**
	 * Método encargado de realizar la tranformación de los valores
	 * @param value Indica el valor a desinfectar
	 * @return Retorna el valor desinfectado hacia el DOM
	 */
	public transform(value): any {
		return this.sanitizer.bypassSecurityTrustHtml(value);
	};
}
