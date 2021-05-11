// Definición typescript para el componente ViewFinderComponent v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado:

import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Se importa los servicios a utilizar
import { ArchivosService } from './../archivos/archivos.service';

/**
 * Componente destinado al despligue de reportes provenientes de la base de datos de archivos
 */
@Component({
	selector: 'arca-viewfinder',
	templateUrl: './viewfinder.component.html',
	styleUrls: ['./viewfinder.component.scss']
})
export class ViewFinderComponent implements OnInit {

	/**
	* Variable que representa la url del recurso para el iframe
	*/
	public src: SafeUrl;
	/** variable para el manejo de la barra de progreso */
	public esCargando = false;

	/**
	 * Constructor de la clase
	 * @param sanitizer Representa el servicio de limpieza de URL's
	 * @param snackBar  variable para el despliegue de mensajes informativos hacia el usuario
	 * @param archivosService Representa el servicio de archivos
	 * @param data Representa los datos de búsqueda
	 */
	constructor(private sanitizer: DomSanitizer,
		private archivosService: ArchivosService,
		public snackBar: MatSnackBar,
		@Optional() @Inject(MAT_DIALOG_DATA) private data: any) { }

	// Métodos públicos

	/**
	* Método que se encarga de recuperar un archivo por id desde la base de datos de mongodb
	* @param id representa el id de mongodb del archivo
	*/
	public ObtenerArchivoById(id: string): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que obtiene los datos del server
		this.archivosService.ShowByIdentificacion(id).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.src = this.sanitizer.bypassSecurityTrustResourceUrl(res.data.file);
			}
			else {
				// Muestra el mensaje de que no se encontrarón registros en base de datos
				this.snackBar.open(res.mensaje, '', {
					duration: 5000
				});
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje de error
			if (err.error) {
				this.snackBar.open(err.error.mensaje, '', {
					duration: 5000
				});
			}
		});
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Obtiene el recurso desde la base de datos de archivos
		this.ObtenerArchivoById(this.data._src_id);
	};
}
