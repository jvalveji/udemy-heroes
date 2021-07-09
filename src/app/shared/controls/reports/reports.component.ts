// Definición typescript para el componente ReportsComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (22-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { environment } from 'environments/environment'; // Variables de ambiente

// Se importa los servicios a utilizar
import { UtilidadesService } from '../../services/utilidades.service';
import { ReportsPentahoService } from './reports.service'
import { saveAs } from 'file-saver';

/**
 * Componente destinado al despligue y manejo de los reportes creados
 * en la plataforma Pentaho
 */
@Component({
	selector: 'arca-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
	/**
	 * Variable para el manejo del nombre de usuario
	 */
	private usuario: string;
	/**
	 * Variable para el manejo de la contraseña del usuario
	 */
	private password: string;
	/**
	* Variable que representa la url del tablero
	*/
	public url: SafeUrl;
	/**
	 * Variable para la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que contiene la definición de los tipos MIME que soporta PENTAHO para la reporteria
	 */
	private mimeTypes: any = {
		/**
		 * Indicador de tipo: PDF
		 */
		pdf: { type: 'application/pdf', ext: '.pdf' },
		/**
		 * Indicador de tipo: TEXT
		 */
		text: { type: 'text/plain', ext: '.txt' },
		/**
		 * Indicador de tipo: HTML
		 */
		html: { type: 'text/html', ext: '.html' },
		/**
		 * Indicador de tipo: XLS
		 */
		excel: { type: 'application/vnd.ms-excel', ext: '.xls' },
		/**
		 * Indicador de tipo: XLSX
		 */
		excelX: { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ext: '.xlsx' }
	};
	/**
	 * Variable que contendra el tipo MIME del reporte
	 */
	private mime: any;


	/**
	 * Constructor de la clase
	 * @param sanitizer Representa el servicio de limpieza de URL's
	 * @param utils Representa el servicio de utilidades
	 * @param dataReport Representa los parametros que recibe el reporte
	 */
	constructor(private sanitizer: DomSanitizer,
		private utils: UtilidadesService,
		private reportsService: ReportsPentahoService,
		@Optional() @Inject(MAT_DIALOG_DATA) private dataReport: any,
		public dialog: MatDialog) {

		// Inicializa los datos del usuario Pentaho
		this.usuario = 'pentaho_hsvp';
		this.password = 'DWH.CGI.2208';

		// Valida si existe la propiedad MIME sino por default establece como PDF
		this.mime = (this.dataReport._mime) ? this.mimeTypes[this.dataReport._mime] : this.mimeTypes.pdf;
	}

	// Métodos públicos


	// Métodos privados

	/**
	 * Método encargado de obtener la URL del reporte desde el servidor de Pentaho
	 * @returns Retorna la URL completa del reporte
	 */
	private ObtenerUrlReport(): SafeUrl {
		// Activa la bandera de carga de datos
		this.esCargando = true;
		// Valida si existen los datos minimos para mostrar el reporte
		if (!this.dataReport._path && !this.dataReport._name) {
			return this.sanitizer.bypassSecurityTrustResourceUrl('');
		}

		// Variable para concatenar la ruta del reporte
		let pathPentaho = '/home' + this.dataReport._path + '/' + this.dataReport._name;
		// Se reemplazan los caracteres '/' por '%3A'
		pathPentaho = pathPentaho.replace(/\//g, '%3A');
		// Concatena los datos de usuario y contraseña
		pathPentaho += '/generatedContent?userid=' + this.usuario + '&password=' + this.password;
		// En caso de existir parámetros los concatena
		if (this.dataReport._params) {
			pathPentaho += '&' + this.dataReport._params;
		}
		// Se llama a la función que irá a traer el reporte
		this.ObtenerReportePentaho(environment.pentaho + pathPentaho);
	};

	/**
	 * Método encargado de obtener el reporte des la plataforma de Pentaho
	 * @param _path {string} Indica la ruta completa (url) del reporte
	 */
	private ObtenerReportePentaho(_path: string): void {
		// Se establece el parámetro para la consulta rest
		const filtro = {
			urlPentaho: _path,
			name: this.dataReport._name,
			mime: this.mime.type,
			ext: this.mime.ext
		};

		// Obtiene el reporte
		this.reportsService.Show(filtro).then((res) => {
			// Cambia el estado del componente de carga
			this.esCargando = false;

			// valida la respuesta
			if (res) {
				// Valida el tipo MIME
				if (this.dataReport._mime && this.dataReport._mime.search('pdf') >= 0) {
					// Se crea un objeto URL
					const fileURL = URL.createObjectURL(res);
					// Se envia a la pantalla el PDF
					this.url = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
				}
				else {
					// se crea la url con el contenido del pdf y se muestra en pantalla.
					const file = new Blob([res], { type: this.mime.type });
					// Salva el archivo fisicamente en la máquina del cliente
					saveAs(file, this.dataReport._name + this.mime.ext);
					// Cierra el dialogo
					this.dialog.closeAll();
				}
			}
		});
	};

	/**
	 * Método encargado de eliminar las cookies asociadas al Pentaho
	 */
	private EliminarSesionPentaho(): void {
		// Al salir destruye las cookies de Pentaho en el navegador
		this.utils.RemoveCookie('JSESSIONID');
		this.utils.RemoveCookie('server-time');
		this.utils.RemoveCookie('session-expiry');
		this.utils.RemoveCookie('session-flushed');
		this.utils.RemoveCookie('client-time-offset');
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Obtiene la URL del reporte
		this.ObtenerUrlReport();
	};

	/**
	 * Método de finalización del componente
	 */
	public ngOnDestroy() {
		// Al salir elimina las cookies
		this.EliminarSesionPentaho();
	};
}
