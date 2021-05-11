// Definición typescript para el componente PrinterComponent v1.0.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción:  Componente con las operaciones CRUD de Impresoras para consumir en los aplicativos MEAN.
// Modificado: (20-06-2019) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// se importan los servicios a utilizar
import { PrinterService } from './printer.service';

/** Componente con las operaciones CRUD de Impresoras para consumir en los aplicativos MEAN.
 */
@Component({
	selector: 'arca-printer',
	templateUrl: './printer.component.html',
	styleUrls: ['./printer.component.scss']
})

export class PrinterComponent implements OnInit {
	/**
	  * Variable para mostrar/ocultar la barra de progreso
	  */
	public esCargando = false;
	/**
   * Constructor de la clase
   * @param PrinterService representa servicio de impresoras
   * @param snackBar para procesar los mensajes al usuario
   */
	constructor(
		private printerService: PrinterService,
		public snackBar: MatSnackBar
	) { }

	/** devuelve el listado de todas las impresoras locales del cliente */
	public PrinterList(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.printerService.PrintList().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			console.log(res);

		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) {
				this.snackBar.open('Error', err.error.message, {
					duration: 3000
				});
			}
		});
	}
	/** inicialización de componente */
	public ngOnInit(): void {
	}

}
