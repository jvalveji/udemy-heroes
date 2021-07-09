// Definición typescript para el componente DialogoAseguradosSearchComponent v1.0.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (20-06-2019) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Componente que se encarga de desplegar un modal para elegir un asegurado
 */
@Component({
	selector: 'arca-dialogo-asegurados-search',
	templateUrl: './dialogo-asegurados-search.component.html',
	styleUrls: ['./dialogo-asegurados-search.component.scss']
})
export class DialogoAseguradosSearchComponent implements OnInit {

	/**
	 * * Constructor de la clase
	 * @param dialogRef Representa el dialogo
	 */
	constructor(public dialogRef: MatDialogRef<DialogoAseguradosSearchComponent>) { }

	/**
	 * Método que cierra la ventana de diálogo
	 */
	public onNoClick(): void {
		this.dialogRef.close();
	};

	/**
	 * Método encargado de retornar la selección
	 * @param item representa la seleccion del usuario
	 */
	RetornarSeleccion(item: any): void {
		this.dialogRef.close(item);
	}
	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
	};
}
