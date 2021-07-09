// Definición typescript para el servicio PreferenciasUsuariosService v4.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

// Variables de ambiente (desarrollo/producción)
import { environment } from 'environments/environment';

// importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { IHttpResponse } from './../../../shared/interfaces/http-response';

/**
 * Servicio con las funcionalidades para operar mediante el protocolo HTTP para el manejo de las
 * preferencias del usuario de la aplicación actual
 */
@Injectable({
	providedIn: 'root'
})
export class PreferenciasUsuariosService {
	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/admin/usuarios/preferencias';  // URL web API

	/**
	 * Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	* Método no implementado
	*/
	public List(): Promise<IHttpResponse> {
		throw new Error('Servicio no implementado.');
	};

	/**
	 * Método encargado de actualizar los datos de las preferencias del usuario
	 * @param idApp Representa el id de la aplicación actual
	 * @param idUser Representa el id del usuario
	 * @param data Datos que representan las preferencias del usuario
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Update(idApp: string, idUser: string, data: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/' + idApp + '/' + idUser;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.put(URL, data).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
