// Definición typescript para el servicio DialogService v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (22-06-2020) Ing. Dagoberto Gómez Jiménez

import { Observable } from 'rxjs';
import { DialogComponent } from './dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Injectable, Inject, Optional } from '@angular/core';

/**
 * Servicio encargado de gestionar las ventanas modales de la aplicación
 */
@Injectable({
	providedIn: 'root'
})
export class DialogService {

	/**
	 * Constructor por defecto de la clase
	 * @param dataDialog Representa los datos que son enviados al componente desde otro componente
	 * @param dialog Variable que representa una ventana de dialogo
	 */
	constructor(@Optional() @Inject(MAT_DIALOG_DATA) private dataDialog: any,
		private dialog: MatDialog) { }

	/**
	 * Método encargado de establecer los valores de la ventana de dialogo
	 * @param _tipo Parámetro que indica el tipo de ventana de dialogo a mostrar
	 *  Tipos: OK, INFO, ERROR, WARNING y QUESTION
	 * @param _titulo Parámetro que indica el titulo para la ventana de dialogo
	 * @param _mensaje Parámetro que establece el mensaje a mostrar en la ventana de dialogo
	 * @returns Retorna un objeto de tipo Observable con la respuesta a la selección del usuario
	 */
	public open(_tipo: string, _titulo: string, _mensaje: string): Observable<string> {
		// Variable que representa la referencia a las ventanas de dialogo de material
		let dialogRef: MatDialogRef<DialogComponent>;
		// Se abre la ventana de dialogo
		dialogRef = this.dialog.open(DialogComponent);
		// Se establecen las caracteristicas de la ventana
		dialogRef.componentInstance.tipoVentana = _tipo;
		dialogRef.componentInstance.titulo = _titulo;
		dialogRef.componentInstance.mensaje = _mensaje;

		// Se retorna un observable con el evento de cierre de ventana de dialogo
		return dialogRef.afterClosed();
	};
}
