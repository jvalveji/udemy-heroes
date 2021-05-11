// Definición typescript para el servicio CatalogosService v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importa las interfaces a utilizar
import { ICRUD } from './../../shared/interfaces/crud';
import { IHttpResponse } from './../../shared/interfaces/http-response';

/**
 * Servicio encargado de exponer el CRUD sobre los catálogos del sistema.
 */
@Injectable()
export class CatalogosService implements ICRUD {
	/**
	* Url del servicio api a consumir por el servicio
	*/
	private apiUrl = environment.urlApi.main + '/admin/catalogos';  // URL web API

	/**
	* Constructor de la clase
	* @param http Variable que representa al módulo HTTP
	*/
	constructor(private http: HttpClient) { }

	/**
	* Método que obtiene la información de la lista de catalogos del sistema
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public List(): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(this.apiUrl).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	* Método que obtiene la información del catálogo general de iconos
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ShowByIconos(): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/iconos';

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
}
