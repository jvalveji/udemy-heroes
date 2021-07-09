// Definición typescript para el componente DialogPersonasListarComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr> (12-09-2018)
// Modificado: (22-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

/**
 * Se importa los componentes de inicialización
 */
import { Component, OnInit, Inject, ViewEncapsulation, Optional } from '@angular/core';
/**
 * Se importa componentes de angular material
 */
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Componente encargado de mostrar un diálogo para la lista de las personas
 */
@Component({
	selector: 'arca-dialog-personas-listar',
	templateUrl: './dialog-personas-listar.component.html',
	styleUrls: ['./dialog-personas-listar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class DialogPersonasListarComponent implements OnInit {

	/**
	 * Contructor de la clase.
	 * @param dialogRef Parámetro que establece las configuraciones del componentes para que actúe como un diálogo.
	 * @param personas Representa los datos inyectados para el diálogo
	 */
	constructor(
		// Se inicializan componentes que indican que es un dialog box
		// y permite la comunicacion bidireccional
		public dialogRef: MatDialogRef<DialogPersonasListarComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public personas: any) {
	}

	/**
	 * Método encargado de inicializar las funcionalidades para el componente
	 */
	public ngOnInit(): void { }

}
