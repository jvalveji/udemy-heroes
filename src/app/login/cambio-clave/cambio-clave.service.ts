// Definición typescript para el servicio CambioClaveService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../shared/interfaces/crud';
import { IHttpResponse } from './../../shared/interfaces/http-response';
import { ILogin } from '../interfaces/login';

/**
 * Servicio encargado de exponer el CRUD para el cambio de contraseña de los usuarios
 */
@Injectable()
export class CambioClaveService implements ICRUD {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/login';  // URL web API

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
	 * Método encargado de actualizar el dato de la contraseña
	 * @param credencial Parámetro que representa los datos de las credenciales actuales del usuario
	 * @param clave Parámetro que contiene la nueva contraseña
	 * @returns Retorna un objeto de tipo IHttpResponse con el resultado del proceso
	 */
	public Update(credencial: ILogin, clave: string): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.patch(this.apiUrl, [credencial, clave]).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
