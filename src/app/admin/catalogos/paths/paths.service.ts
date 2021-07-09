
// Definición typescript para el servicio PathsService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Servicio con las funcionalidades para operar mediante el protocolo HTTP
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// variables de ambiente (desarrollo/producción)
import { environment } from 'environments/environment';
// importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../../shared/interfaces/crud';
import { IHttpResponse } from './../../../shared/interfaces/http-response';

/** Servicio con las funcionalidades para operar mediante el protocolo HTTP para paths de las aplicaciones */
@Injectable()
export class PathsService implements ICRUD {
	/** Url del servicio api a consumir por el servicio */
	private apiUrl = environment.urlApi.main + '/admin/catalogos/paths/'; // URL web API
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
		throw new Error('Method not implemented.');
	}
	/**
	* Método que actualiza la información del catálogo de paths de la aplicación
	* @param idAplicacion Id de la aplicación a actualizar
	* @param paths Objeto que contiene los datos a actualizar
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public UpdateByPaths(idAplicacion: any, paths: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + idAplicacion;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.put(URL, { items: paths }).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
   * Método que obtiene la información del catálogo de paths de la aplicación
   * @param id Id del app del cuál se obtendran los paths
   * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
   */
	public ListPathsByAplicacion(id: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + id;

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
	* Método que obtiene los datos específicos de un path desde el catálogo de paths
	* @param app Id del app del cuál se obtendran el path
	* @param name Indica el nombre del path
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ShowPathByNombre(app: string, name: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + app + '/' + name;

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
};
