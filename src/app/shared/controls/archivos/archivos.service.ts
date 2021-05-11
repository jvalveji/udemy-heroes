// Definición typescript para el servicio ArchivosService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { IHttpResponse } from '../../interfaces/http-response';
import { ICRUD } from '../../interfaces/crud';

/**
 * Servicio encargado de gestionar las operaciones CRUD en el manejo
 * del componente de archivos
 */
@Injectable()
export class ArchivosService implements ICRUD {
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
		throw new Error('Method not implemented.');
	};

	/**
	* Método que obtiene la información del según identificación
	* array json
	* @param filter 
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ShowByIdentificacion(filter: any): Promise<IHttpResponse> {
		// Urls completa del servicio
		const url = this.apiUrl + `/shared/archivos/${filter}`;
		return new Promise((resolve, reject) => {
			this.http
				.get(url).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(
					res => {
						resolve(res);
					},
					err => {
						reject(err);
					}
				);
		});
	};

	/**
	 * Método encargado de crear un nuevo registro de fichero en base de datos mongoDB
	 * @param data 
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Create(data: any): Promise<IHttpResponse> {
		// Urls completa del servicio
		const url = this.apiUrl + '/shared/archivos/';
		return new Promise((resolve, reject) => {
			this.http.post(url, data).pipe(
				map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				},
					(err) => {
						reject(err);
					});
		});
	};

	/**
	* Método encargado de modificar la información de registro de un fichero
	* @param filter 
	* @param data 
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public Update(filter: any, data: any): Promise<IHttpResponse> {
		const url = this.apiUrl + `/shared/archivos`;
		return new Promise((resolve, reject) => {
			this.http.put(url, { list: data }).pipe(
				map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	* Método encargado de eliminar la información de registro de un fichero
	* @param filter 
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public Remove(filter: any): Promise<IHttpResponse> {
		const url = this.apiUrl + `/shared/archivos/${filter}`;
		return new Promise((resolve, reject) => {
			this.http.delete(url).pipe(
				map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
