// Definición typescript para el componente DialogUsuariosListarComponent v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez
// Modificado:

/**
 * Se importa los componentes de inicialización
 */
import { Component, OnInit, Inject, ViewEncapsulation, Optional } from '@angular/core';
/**
 * Se importa componentes de angular material
 */
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Componente encargado de mostrar un diálogo para la lista de las usuarios
 */
@Component({
	selector: 'arca-dialog-usuarios-listar',
	templateUrl: './dialog-usuarios-listar.component.html',
	styleUrls: ['./dialog-usuarios-listar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class DialogUsuariosListarComponent implements OnInit {

	/**
	 * Contructor de la clase.
	 * @param dialogRef Parámetro que establece las configuraciones del componentes para que actúe como un diálogo.
	 * @param listaUsuarios Representa los datos inyectados para el diálogo
	 */
	constructor(
		// Se inicializan componentes que indican que es un dialog box
		// y permite la comunicacion bidireccional
		public dialogRef: MatDialogRef<DialogUsuariosListarComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public listaUsuarios: any) {
	}

	/**
	 * Método encargado de inicializar las funcionalidades para el componente
	 */
	public ngOnInit(): void { }

}
