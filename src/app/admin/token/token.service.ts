// Definición typescript para el servicio TokenService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { IHttpResponse } from './../../shared/interfaces/http-response';
import { ICRUD } from './../../shared/interfaces/crud';

/**
 * Servicio encargado de exponer el CRUD para el manejo del token (JWT) dentro de la aplicación
 */
@Injectable()
export class TokenService implements ICRUD {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main;  // URL web API

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
	 * Método encargado de generar un token para el proyecto Arca
	 * @param _data Datos para la creación del token
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Create(_data: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/admin/token/' + _data.medida + '/' + _data.ttl;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(URL, { payload: _data.data }).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
