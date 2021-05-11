// Definición typescript para el componente DiagnosticosComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiagnosticosSearchComponent } from './../../../shared/controls/diagnosticos-search/diagnosticos-search.component';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_diagnosticos'])
/**
 * Componente destinado al despligue y manejo del catálogo de diagnósticos del CIE10
 */
@Component({
	selector: 'arca-diagnosticos',
	templateUrl: './diagnosticos.component.html',
	styleUrls: ['./diagnosticos.component.scss']
})
export class DiagnosticosComponent {
	/**
	 * Variable que contiene el diagnóstico seleccionado
	 */
	public diagnosticos: any;

	/**
	 * Constructor de la clase
	 * @param dialogos Representa a la ventana de dialogo de material
	 */
	constructor(private dialogos: MatDialog) { }

	// Métodos públicos

	/**
	 * Método encargado de establecer el valor del diagnóstico CIE10 seleccionado por el usuario
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public SeleccionarDiagnostico(item: any): void {
		// Asigna el capitulo seleccionado
		this.diagnosticos = (item) ? item : null;
	};

	/**
	 * Métodso encargado de llamar a la ventana de búsqueda de diagnósticos
	 */
	public MostrarBusquedaDiagnosticos(): void {
		// Se establece una variable para indicar la configuración básica de la ventana de búsqueda
		const configDialogo =
		{
			disableClose: false,
			panelClass: 'full-width-dialog',
			hasBackdrop: true,
			width: '100%',
			height: '100%',
			maxWidth: '100vw',
			maxHeight: '100vh',
			data: null
		};

		// Se crea una variable que representa a la ventana de búsqueda
		const busquedaCIE10 = this.dialogos.open(DiagnosticosSearchComponent, configDialogo);
		// Se customiza el evento que retorna información de la ventana de búsqueda
		busquedaCIE10.afterClosed().subscribe(res => {
			// Se valida que exista una respuesta
			if (res) {
				// Asigna la respuesta a una variable
				this.diagnosticos = res;
			}
		});
	};
}


