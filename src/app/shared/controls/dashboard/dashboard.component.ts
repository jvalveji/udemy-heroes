// Definición typescript para el componente DashboardComponent v1.2.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2019) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)

// Se importa los servicios a utilizar
import { UtilidadesService } from '../../services/utilidades.service';

/**
 * Componente destinado al despligue y manejo de los tableros creados
 * en la plataforma Pentaho
 */
@Component({
	selector: 'arca-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

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
	 * Atributo de entrada para establecer el id del tablero
	 */
	@Input('ID')
	public ID: string;
	/**
	 * Atributo de entrada para establecer el path del tablero
	 */
	@Input('dashboardPath')
	private dashboardPath: string;
	/**
	 * Atributo de entrada para establecer el nombre del tablero
	 */
	@Input('dashboardName')
	private dashboardName: string;
	/**
	 * Atributo de entrada para establecer establecer parámetros para el tablero
	 */
	@Input('dashboardParams')
	private dashboardParams: string;
	// /**
	// * Atributo de entrada para establecer el largo del tablero
	// */
	// @Input('width')
	// public width: string;
	/**
	 * Atributo de entrada para establecer el ancho del tablero
	 */
	@Input('height')
	public height: string;

	/**
	 * Constructor de la clase
	 * @param sanitizer Representa el servicio de limpieza de URL's
	 * @param utils Representa el servicio de utilidades
	 */
	constructor(private sanitizer: DomSanitizer,
		private utils: UtilidadesService) {
		// Inicializa los datos del usuario Pentaho
		this.usuario = 'pentaho_hsvp';
		this.password = 'DWH.CGI.2208'
	}

	// Métodos públicos


	// Métodos privados

	/**
	 * Método encargado de obtener la URL del tablero desde el servidor de Pentaho
	 */
	private ObtenerUrlDashboard(): SafeUrl {
		// Valida si existen los datos minimos para mostrar el tablero
		if (!this.dashboardPath && !this.dashboardName) {
			return this.sanitizer.bypassSecurityTrustResourceUrl('');
		}

		// Variable para concatenar la ruta del tablero
		let urlPentaho = '/home' + this.dashboardPath + '/' + this.dashboardName;
		// Se reemplazan los caracteres '/' por '%3A'
		urlPentaho = urlPentaho.replace(/\//g, '%3A');
		// Concatena los datos de usuario y contraseña
		urlPentaho += '/generatedContent?userid=' + this.usuario + '&password=' + this.password;
		// En caso de existir parámetros los concatena
		if (this.dashboardParams) {
			urlPentaho += '&' + this.dashboardParams;
		}

		// Retorna la url completa
		return this.sanitizer.bypassSecurityTrustResourceUrl(environment.pentaho + urlPentaho);
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
	ngOnInit() {
		// Obtiene la URL del tablero
		this.url = this.ObtenerUrlDashboard();
	};

	/**
	 * Método de finalización del componente
	 */
	ngOnDestroy() {
		// Al salir elimina las cookies
		this.EliminarSesionPentaho();
	};
}
