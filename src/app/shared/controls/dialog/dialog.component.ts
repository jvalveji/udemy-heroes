// Definición typescript para el componente DialogComponent v2.0.2
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2019) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

/**
 * Componente destinado al despligue y manejo de las ventanas de dialogo de la aplicación
 */
@Component({
	selector: 'arca-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
	/**
	 * Variable que indica el tipo de ventana de dialogo
	 */
	public tipoVentana: string;
	/**
	 * Variable que indica el titulo de la ventana de dialogo
	 */
	public titulo: string;
	/**
	 * Variable que indica el mensaje a mostrar en la ventana de dialogo
	 */
	public mensaje: string;
	/**
	 * Variable que indica si oculta/muestra el botón de OK
	 */
	public esOK: boolean;
	/**
	 * Variable que indica si oculta/muestra el botón de YES
	 */
	public esYES: boolean;
	/**
	 * Variable que indica si oculta/muestra el botón de NO
	 */
	public esNO: boolean;
	/**
	 * Variable que indica el estilo a aplicar al dialogo
	 */
	public claseEstilo: string;
	/**
	 * Variable que indica el estilo a aplicar a los iconos del dialogo
	 */
	public iconoEstilo: string;

	/**
	 * Constructor por defecto de la clase
	 * @param dialogRef Variable que representa una referencia al componente
	 */
	constructor(public dialogRef: MatDialogRef<DialogComponent>) { }

	/**
	 * Método encargada de cerrar la ventana de diálogo
	 * @param estado Estado con el que se cierra la ventana de dialogo
	 */
	public Cerrar(estado: string): void {
		this.dialogRef.close(estado);
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Valida el tipoVentana de ventana que se quiere mostrar
		switch (this.tipoVentana) {
			case 'OK':
			case 'INFO':
			case 'ERROR':
			case 'WARNING':
				// Botones
				this.esOK = true;
				this.esYES = false;
				this.esNO = false;
				// Estilo
				this.claseEstilo = (this.tipoVentana === 'OK') ? 'ar-dialog-header-ok' : (
					(this.tipoVentana === 'INFO') ? 'ar-dialog-header-info' : (
						(this.tipoVentana === 'ERROR') ? 'ar-dialog-header-error' : 'ar-dialog-header-warning'
					)
				);
				// Icono
				this.iconoEstilo = (this.tipoVentana === 'OK') ? 'check' : (
					(this.tipoVentana === 'INFO') ? 'info' : (
						(this.tipoVentana === 'ERROR') ? 'error' : 'warning'
					)
				);
				break;
			case 'QUESTION':
				// Botones
				this.esOK = false;
				this.esYES = true;
				this.esNO = true;
				// Estilo
				this.claseEstilo = 'ar-dialog-header-question';
				// Icono
				this.iconoEstilo = 'question_answer';
				break;
		}
	};
}
