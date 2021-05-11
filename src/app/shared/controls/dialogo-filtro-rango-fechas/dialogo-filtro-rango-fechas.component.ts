// Definición typescript para el componente DialogoFiltroRangoFechasComponent v1.0.3
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (20-06-2019) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Componente que se encarga de desplegar un modal para elegir un rango de fechas
 */
@Component({
	selector: 'arca-dialogo-filtro-rango-fechas',
	templateUrl: './dialogo-filtro-rango-fechas.component.html',
	styleUrls: ['./dialogo-filtro-rango-fechas.component.scss']
})
export class DialogoFiltroRangoFechasComponent implements OnInit {
	/**
	 * Representa los datos  retonar cuando se cierre el dialogo
	 */
	public data: any;
	/**
	 * Indica la fecha inicial del rango
	 */
	public fechaInicial: any;
	/**
	 * Indica la fecha final del rango
	 */
	public fechaFinal: any;

	/**
	 * * Constructor de la clase
	 * @param dialogRef Representa el dialogo
	 */
	constructor(public dialogRef: MatDialogRef<DialogoFiltroRangoFechasComponent>) { }

	/**
	 * Método que cierra la ventana de diálogo
	 */
	public onNoClick(): void {
		this.dialogRef.close();
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() { };
}
