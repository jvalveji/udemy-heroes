// Definición typescript para el componente LayoutComponent v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado:

import { Component, OnInit } from '@angular/core';

/**
 * Componente utilizado para "contener" las vistas del módulo MAIN
 */
@Component({
	selector: 'arca-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
	/**
    * Constructor de la clase
    */
	constructor() { }

	/**
    * Método inicial del componente
    */
	public ngOnInit() { };
}
