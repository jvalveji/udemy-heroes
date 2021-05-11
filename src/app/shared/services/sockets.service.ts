// Definición typescript para el servicio SocketsService v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
//                   Ing. Geiner Alejandro Villalobos Méndez <gavillal@ccss.sa.cr>
// Modificado: (22-06-2020) Ing. Dagoberto Gómez Jiménez

import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de gestionar los sockets de la aplicación
 */
@Injectable({ providedIn: 'root' })
export class SocketsService {

	/**
	 * Variable que representa el socket
	 */
	private socket: any;

	/**
	 * Constructor de la clase
	 */
	constructor() { }

	/**
	 * Método encargado de establecer los datos iniciales del socket
	 * @param url Indica la url del socket a conectar
	 * @param esNuevo Indica si se va a crear una nueva instancia para el socket o no 
	 * (es decir, crear un nuevo hilo o no)
	 * @param token (Opcional) Indica si envia datos de token al socket (esto para aplicacion
	 *              de la plataforma Arca - MEAN)
	 */
	public Set(url: string, esNuevo?: boolean, token?: string): void {
		// Se establece una variable con los datos a enviar en cada consulta al socket
		let data = {};
		// Valida si se va a crear un nuevo hilo para el socket
		if (esNuevo) {
			data['forceNew'] = true;
		}
		// Valida si existe el dato de token para incluirlo
		if (token) {
			data['query'] = 'token=' + token;
		}

		// Crea la conecxión con el socket
		this.socket = io(url, data);
	};

	/**
	 * Método que permite enviar la información al socket
	 * @param nombre Indica el nombre definido del socket en el servidor
	 * @param accion (Opcional) Indica una acción a ejecutar en el socket
	 * @param data  (Opcional) Indica los datos a enviar al socket
	 * @param token (Opcional) Indica un token para el socket (esto para aplicacion
	 *              de la plataforma Arca - MEAN)
	 */
	public Send(nombre: string, accion?: string, data?: any, token?: string): void {
		// Valida si existe el socket
		if (this.socket) {
			// Variable que contendra los datos a enviar en la solicitud
			let dataSend = {
				data: data // Datos a enviar
			};

			// Valida si existe una acción para el socket
			if (accion) {
				// Agrega la propiedad de la acción
				dataSend['action'] = accion;
			}

			// Valida si existe un token a enviar (esto para aplicacion
			// de la plataforma Arca - MEAN)
			if (token) {
				// Agrega la propiedad del token
				dataSend['token'] = token;
			}
			// Dispara el socket con la solicitud
			this.socket.emit(nombre, dataSend);
		}
		else {
			// Indica un error con el socket
			throw new Error('El socket no se encuentra abierto.');
		}
	};

	/**
	 * Metodo que retorna el socket actual
	 */
	public Get() {
		// Valida si existe el socket
		if (this.socket) {
			// Retorna el objeto socket completo
			return this.socket;
		}
		else {
			// Indica un error con el socket
			throw new Error('El socket no se encuentra abierto.');
		}
	};

	/**
	 * Metodo que retorna los datos del socket por el nombre
	 * @param nombre Indica el nombre del socket para comunicarse
	 * @returns Retorna el socket indicado
	 */
	public GetByNombre(nombre: string): Observable<any> {
		// Valida si existe el socket
		if (this.socket) {
			// Se conecta al socket especifico
			return Observable.create(observer => {
				this.socket.on(nombre, msg => {
					observer.next(msg);
				});
			});
		}
		else {
			// Indica un error con el socket
			throw new Error('El socket no se encuentra abierto.');
		}
	};

	/**
	 * Método encargado de cerrar el socket
	 */
	public Close(): void {
		this.socket.close();
	};
}
