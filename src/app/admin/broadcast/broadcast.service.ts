// Definición typescript para el servicio BroadcastService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importa las interfaces a utilizar
import { ICRUD } from './../../shared/interfaces/crud';
import { IHttpResponse } from './../../shared/interfaces/http-response';

/**
 * Servicio encargado de exponer el CRUD sobre los mensajes de tipo broadcast del sistema.
 */
@Injectable()
export class BroadcastService implements ICRUD {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/admin/broadcast';  // URL web API

	/**
	 * Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	 * Método no implementado
	 */
	List(): Promise<IHttpResponse> {
		throw new Error('Method not implemented.');
	};

	/**
	 * Método encargado de obetner los mensajes de broadcast
	 * por aplicativo para el mantenimiento de mensajes de tipo broadcast
	 * @param filter Indica el filtro para la búsqueda
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ListByAplicacion(filter: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/' + filter;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(URL).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Método encargado de obetner los mensajes de broadcast
	 * por aplicativo y que esten activos
	 * @param filter Indica el filtro para la búsqueda
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ShowByEstadoActivo(filter: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/activos/' + filter;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(URL).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Método encargado de crear un nuevo mensaje de broadcast
	 * @param data Datos a enviar al servidor
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Create(data: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/' + data.idAplicacion;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(URL, data.datosBroadcast).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
