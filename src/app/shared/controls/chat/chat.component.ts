// Definición typescript para el componente ChatComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { SocketsService } from '../../services/sockets.service';
import { Subscription } from 'rxjs';
import { environment } from 'environments/environment';

// Importa las interfaces a utilizar
import { IChat } from './chat';

// Se importan los servicios a utilizar
import { UtilidadesService } from '../../services/utilidades.service';
import { DialogService } from '../dialog/dialog.service';
import { BroadcastService } from './../../../admin/broadcast/broadcast.service';

/**
 * Componente destinado al despligue y manejo de las ventanas de chat en la aplicación
 */
@Component({
	selector: 'arca-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	providers: [SocketsService]
})
export class ChatComponent implements OnInit, OnDestroy {
	/**
	 * Variable que almacena los datos del usuario en sesión
	 */
	public datosUsuarioSesion: any;
	/**
	 * Variable para la fecha actual
	 */
	public fechaMensajes: Date;
	/**
	 * Variable con la lista de mensajes de tipo broadcast para el usuario
	 */
	public mensajesBroadcast: any;
	/**
	 * Variable con la lista de mensajes de chat para el usuario
	 */
	public mensajesChat: any;
	/**
	 * Variable que contiene el texto del campo de mensaje
	 */
	public txtMensaje: string;
	/**
	 * Variable que contendra la suscripción al servicio
	 */
	private suscripcionChat: Subscription;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param utils Representa al servicio de utilidades
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param socket Representa al servicio de sockets
	 * @param broadcastService Representa el servicio de broadcast
	 */
	constructor(private _location: Location,
		private utils: UtilidadesService,
		private msgBox: DialogService,
		private socket: SocketsService,
		private broadcastService: BroadcastService) {
		// Inicializa el socket estableciendo los datos de configuración (URL)
		this.socket.Set(environment.sockets.main);
		// Inicializa variables
		this.mensajesBroadcast = [];
		this.mensajesChat = [];
		this.txtMensaje = null;
		// Inicia la fecha actual
		this.fechaMensajes = new Date();
		// Obtiene los datos del usuario local
		this.datosUsuarioSesion = this.utils.ListUsuarioLocal();
	}

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior
	 */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	/**
	 * Método encargado de carga de forma inicial los mensajes actuales de tipo broadcast.
	 * Posteriormente inicia una suscripción al socket broadcast
	 */
	public ObtenerMensajesBroadcast(): void {
		// Se llama a la función del servicio que envia los datos al server
		this.broadcastService.ShowByEstadoActivo(this.datosUsuarioSesion.aplicacion_id).then((res) => {
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos de la respuesta
				this.mensajesBroadcast = res.data;
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error', res.mensaje);
				// .subscribe(res => alert(res));
			}
		}, (err) => {
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método encargado de enviar un mensaje nuevo
	 */
	public EnviarMensaje(): void {
		// Construye el mensaje
		const msg: IChat = {
			usuario: this.datosUsuarioSesion.nombreCompleto,
			mensaje: this.txtMensaje
		};
		// Envia el mensaje al socket
		this.socket.Send('bitzu.chat', null, msg);
		// Limpia la variable de texto
		this.txtMensaje = null;
	};

	/**
	 * Método encargado de obtener los nuevos mensajes de CHAT
	 */
	public NuevoMensajeChat(): void {
		// Se suscribe al servicio para obtener las respuestas del socket
		this.suscripcionChat = this.socket.GetByNombre('bitzu.chat').subscribe(_mensaje => {
			// Agrega el mensaje a la lista
			this.mensajesChat.push(_mensaje);
		});
	};

	// Métodos privados

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Inicia el evento que escucha mensajes
		this.NuevoMensajeChat();
		// Carga de forma inicial los mensajes de broadcast
		this.ObtenerMensajesBroadcast();
	};

	/**
	 * Método de finalización del componente
	 */
	public ngOnDestroy() {
		// Al destruirse el componente se desinscribe de la suscripción al servicio
		this.suscripcionChat.unsubscribe();
		// Cierra el socket
		this.socket.Close();
	};
}
