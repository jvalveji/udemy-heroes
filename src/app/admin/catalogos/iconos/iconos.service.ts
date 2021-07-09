// Definición typescript para el servicio Iconos v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr> (24-04-2019)
// Descripción: Servicio con las funcionalidades para operar mediante el protocolo HTTP
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

// Variables de ambiente (desarrollo/producción)
import { environment } from 'environments/environment';

// importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../../shared/interfaces/crud';
import { IHttpResponse } from './../../../shared/interfaces/http-response';

/**
 * Servicio con las funcionalidades para operar mediante el protocolo HTTP para tipos de identificación del catálogo general
 */
@Injectable()
export class IconosService implements ICRUD {
	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl =
		environment.urlApi.main + '/admin/catalogos/iconos'; // URL web API
	/**
	*  Constructor de la clase
	* @param http Variable que representa al módulo HTTP
	*/
	constructor(private http: HttpClient) { }

	/**
	 *  Método que obtiene la información de la lista del catálogo
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public List(): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(this.apiUrl)
				.pipe(map((res: IHttpResponse) => res))
				.subscribe(
					res => {
						resolve(res);
					},
					err => {
						reject(err);
					}
				);
		});
	}

	/**
	 *  Método que se encarga de crear/actualizar registros de los items del catálogo en la base de datos.
	 * @param data Parámetro con los datos para realizar la consulta en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Show(data: any): Promise<IHttpResponse> {
		const URL = this.apiUrl + `/${data._id}`;
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(URL)
				.pipe(map((res: IHttpResponse) => res))
				.subscribe(
					res => {
						resolve(res);
					},
					err => {
						reject(err);
					}
				);
		});
	}

	/**
	 *  Método que se encarga de crear/actualizar registros de los items del catálogo en la base de datos.
	 * @param data Parámetro con los datos para realizar la inserción en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Update(data: any): Promise<IHttpResponse> {
		const URL = this.apiUrl + `/${data._id}`;
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.put(URL, data)
				.pipe(map((res: IHttpResponse) => res))
				.subscribe(
					res => {
						resolve(res);
					},
					err => {
						reject(err);
					}
				);
		});
	}

	/**
	 *  Método que se encarga de crear/actualizar registros de los items del catálogo en la base de datos.
	 * @param data Parámetro con los datos para realizar la inserción en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Create(data: any): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(this.apiUrl, data)
				.pipe(map((res: IHttpResponse) => res))
				.subscribe(
					res => {
						resolve(res);
					},
					err => {
						reject(err);
					}
				);
		});
	}


}
