// Definición typescript para el componente SidenavComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (08-07-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { environment } from 'environments/environment';
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Se importan los servicios a utilizar
import { DialogService } from '../dialog/dialog.service';
import { AutorizacionService } from '../../services/autorizacion.service';
import { UtilidadesService } from '../../services/utilidades.service';
import { SocketsService } from '../../services/sockets.service';
import { UnidadesProgramaticasService } from './../../../admin/catalogos/unidades-programaticas/unidades-programaticas.service';
import { PreferenciasUsuariosService } from './../../../admin/usuarios/preferencias-usuarios/preferencias-usuarios.service';

/**
 * Componente destinado al despligue y manejo del menú lateral del
 * panel colapsable izquierdo de la aplicación
 */
@Component({
	selector: 'arca-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	providers: [SocketsService]
})
export class SidenavComponent implements OnInit, OnDestroy {
	/**
	 * Variable que indica al usuario el ambiente actual de la aplicación
	 */
	public ambienteActual: string;
	/**
	 * Variable que almacena los datos del usuario en sesión
	 */
	private datosUsuarioSesion: any;
	/**
	 * Variable que muestra el nombre completo del usuario
	 */
	public nombreCompletoUsuario: string;
	/**
	 * Variable que muestra el nombre de la unidad programática actual
	 */
	public nombreUnidadProgramatica: string;
	/**
	 * Variable que contendra la suscripción al servicio
	 */
	private suscripcion: Subscription;
	/**
	 * Lista de mensajes tipo broadcast entrantes
	 */
	public mensajesEntrantes: any;
	/**
	 * Lista de mensajes de chat entrantes
	 */
	public chatsEntrantes: any;
	/**
	 * Variable que maneja la clase para el tema
	 */
	public temaApp: string;
	/**
	 * Variable que maneja el tema para la aplicación (claro/oscuro)
	 * Por default se maneja el tema CLARO (light)
	 */
	private TEMA_DEFAULT: string;
	/**
	 * Url que maneja la ubicación del servidor de recursos Web
	 */
	public UrlWebkit: string;

	/**
	 * Constructor de la clase
	 * @param inj Variable que representa al servicio de Injectores de angular
	 * @param router variable que maneja las rutas d ela aplicación
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param utils Representa al servicio de utilidades
	 * @param catalogoService Representa al servicio de unidades programaticas del catalogo generales
	 * @param socket Representa al servicio de sockets
	 * @param preferencesService Representa al servicio de preferencias de usuario
	 */
	constructor(private inj: Injector,
		private router: Router,
		private msgBox: DialogService,
		private utils: UtilidadesService,
		private catalogoService: UnidadesProgramaticasService,
		private socket: SocketsService,
		private preferencesService: PreferenciasUsuariosService) {

		// Establece el ambiente actual
		this.ambienteActual = (environment.ambiente === 'PRODUCCIÓN') ? null : environment.ambiente;

		// Inicializa el socket estableciendo los datos de configuración (URL)
		this.socket.Set(environment.sockets.main);
		// Inicializa el arrelo de mensajes
		this.mensajesEntrantes = [];
		this.chatsEntrantes = [];
		// Establece el ambiente actual del webkit
		this.UrlWebkit = environment.urlWebkit;
	};

	// Métodos públicos

	/**
	 * Método encargado de desencadenar la salida de sesión por parte del usuario
	 */
	public LogOut(): void {
		// Muestra el mensaje de error
		this.msgBox.open('QUESTION', 'Salida del sistema', '¿Desea salir de la plataforma arca?')
			.subscribe(res => {
				if (res === 'YES') {
					// Variable que accede al servicio de autorizaciones
					const AUTH = this.inj.get(AutorizacionService);
					// Elimina los datos locales
					AUTH.LogOut();
					// Lo envia a la ventana de logueo
					this.router.navigate(['/bitzu/login']);
				}
			});
	};

	/**
	 * Método encargado de redirigir al usuario al home principal de la aplicación
	 */
	public IrHome(): void {
		// Lo envia al home de la aplicación
		// Se sustituye MAIN por el nombre de la aplicación que se incluyo en el archivo de rutas
		// Ej.: Nuttrición => this.router.navigate(['/nutricion/main']);
		this.router.navigate(['/bitzu/main']);
	};

	/**
   * Método encargado de redirigir al usuario al home de configuración de la aplicación
   */
	public IrAdmin(): void {
		// Lo envia al home de la aplicación
		this.router.navigate(['/bitzu/admin']);
	};

	/**
	 * Método encargado de redirigir al usuario a la ventana de chat
	 * @param mensaje Indica el mensaje seleccionado
	 */
	public MostrarChat(mensaje: any): void {
		// Lo envia al home de la aplicación
		this.router.navigate(['/bitzu/chat']);
	};

	/**
	 * Método para ir a la vista de "Acerca de"
	 */
	public IrAbout(): void {
		// Lo envia a la ventana de  "Acerca de"
		this.router.navigate(['/bitzu/about']);
	};

	/**
	 * Método para ir a la vista de cambio de contraseña
	 */
	public CambiarPassword(): void {
		// Redirige al usuario hacia la ventana de cambio de contraseña indicando si es usuario MISE o NO
		this.router.navigate(['/bitzu/login/cambio-clave', this.datosUsuarioSesion.usuario, this.datosUsuarioSesion.esMise]);
	};

	/**
	 * Método encargado de realizar el cambio de tema de la aplicación
	 */
	public CambiarTema(): void {
		// Cambia la variable de tema
		this.TEMA_DEFAULT = (this.TEMA_DEFAULT === 'light') ? 'dark' : 'light';
		// Se obtiene la preferencia del tema del usuario
		this.temaApp = this.ObtenerClaseTemaApp(this.TEMA_DEFAULT);
		// Se obtienen los datos del usuario de la conexión actual
		let usuarioActual = this.utils.ListUsuarioLocal();
		// Se establece el tema en el objeto que representa los datos del usuario
		usuarioActual.preferencias.temaApp = this.TEMA_DEFAULT;
		// Llama al servicio que actualiza las preferencias del usuario
		this.preferencesService.Update(usuarioActual.aplicacion_id, usuarioActual.usuario_id, usuarioActual.preferencias)
			.then((res) => {
				// Sin importar la respuesta (exito o fracaso) se actualiza los datos
				// Se actualiza la información en el locastorage
				this.utils.UpdateUsuarioLocal(usuarioActual);
			});
	};

	// Métodos privados

	/**
	 * Método encargado de obtener los datos del usuario en sesión actual
	 */
	private ObtenerDatosUsuarioActual(): void {
		// Obtiene los datos del usuario local
		this.datosUsuarioSesion = this.utils.ListUsuarioLocal();
		// Obtiene el nombre del usuario
		this.nombreCompletoUsuario = (this.datosUsuarioSesion.nombreCompleto) ? this.datosUsuarioSesion.nombreCompleto : 'Arca - CCSS';
		// Llama al servicio que obtiene el dato de la unidad programatica actual
		this.catalogoService.Show(this.datosUsuarioSesion.unidadProgramatica_id).then((res) => {
			// Recibe la respuesta
			if (res.exito) {
				// Asigna el nombre de la unidad prorámatica a la variable
				this.nombreUnidadProgramatica = res.data.descripcion;
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error de carga', res.mensaje);
				// .subscribe(res => alert(res));
				// Limpia el formulario
			}
		});
	};

	/**
	* Método encargado de obtener los nuevos mensajes
	*/
	private IniciarEscuchaMensajes(): void {
		// Se suscribe al servicio para obtener las respuestas del socket
		this.suscripcion = this.socket.GetByNombre('bitzu.broadcast').subscribe(_mensajes => {
			// Agrega el mensaje a la lista
			this.mensajesEntrantes = _mensajes;
		});
	};

	/**
	* Método encargado de establecer las preferencias del usuario
	*/
	private EstablecerPreferenciasUsuario(): void {
		// Se obtienen los datos del usuario de la conexión actual
		let usuarioActual = this.utils.ListUsuarioLocal();
		// Se valida que exista la información de las preferencias del usuario
		if (usuarioActual.preferencias) {
			this.TEMA_DEFAULT = usuarioActual.preferencias.temaApp;
			// Se obtiene la preferencia del tema del usuario
			this.temaApp = this.ObtenerClaseTemaApp(this.TEMA_DEFAULT);
		} else {
			this.TEMA_DEFAULT = 'light';
			// Se establece el default SI NO EXISTE
			this.temaApp = this.ObtenerClaseTemaApp(this.TEMA_DEFAULT);
			// Se actualiza el objeto con los datos del usuario
			usuarioActual.preferencias = { temaApp: this.TEMA_DEFAULT };
			// Se actualiza la información en el locastorage
			this.utils.UpdateUsuarioLocal(usuarioActual);
		}
	};

	/**
	 * Método encargado de retornar la clase para aplicar al tema
	 * @param tema Indicador de tema (dark/light)
	 * @return Retorna una cadena con la clase para el tema indicado por parámetro
	 */
	private ObtenerClaseTemaApp(tema: string): string {
		return (tema === 'dark') ? 'ar-theme-dark arca-dark-theme' : 'ar-theme-light';
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Muestra los datos del usuario en sesión actual
		this.ObtenerDatosUsuarioActual();
		// Inicia el proceso de socket para que empiece a capturar mensajes
		this.IniciarEscuchaMensajes();
		// Establecer preferencias del usuario
		this.EstablecerPreferenciasUsuario();
	};

	/**
	 * Método de finalización del componente
	 */
	public ngOnDestroy() {
		// Al destruirse el componente se desinscribe de la suscripción al servicio
		if (this.suscripcion) { this.suscripcion.unsubscribe(); }
		// Cierra el socket
		this.socket.Close();
	};
}
