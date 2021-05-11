// Definición typescript para el servicio ParametrosService v6.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../shared/interfaces/crud';
import { IHttpResponse } from './../../shared/interfaces/http-response';
import { IParametro } from '../catalogos/interfaces/parametro';

/**
 * Servicio encargado de exponer el CRUD sobre los parametros del sistema.
 */
@Injectable({
	providedIn: 'root'
})
export class ParametrosService implements ICRUD {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/admin/parametros';  // URL web API

	/**
	 * Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	 * Método encargado de obtener la lista de parámetros
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
	 * Método encargado de obtener la lista de parámetros globales
	 */
	public ListByGlobal(): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/globales';

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
	 * Método encargado de obtener la lista de parámetros por aplicación
	 * @param id Representa el id de la aplicación
	 */
	public ListByAplicacion(id: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/aplicaciones/' + id;

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
	 * Método encargado de obtener los datos de los parámetros por unidad programática
	 * @param idApp Representa el id de la aplicación
	 * @param idUp Representa el id de la unidad programática
	 */
	public ListByUnidadProgramatica(idApp: string, idUp: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/unidades-programaticas/' + idApp + '/' + idUp;

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
	 * Método encargado de obtener los datos del parámetro por su id
	 * @param id Representa el id del parámetro
	 */
	public Show(id: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/' + id;

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
	 * Método encargado de obtener los datos del parámetro GLOBAL por nombre
	 * @param name Nombre del parámetro a buscar
	 */
	public ShowByGlobalNombre(name: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/filtro-global/' + name;

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
	 * Método encargado de obtener los datos del parámetro de la APLICACIÓN por nombre
	 * @param idApp Representa el id de la aplicación
	 * @param name Nombre del parámetro a buscar
	 */
	public ShowByAplicacionNombre(idApp: string, name: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/filtro-aplicacion/' + idApp + '/' + name;

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
	 * Método encargado de obtener los datos del parámetro de la UNIDAD PROGRAMÁTICA por nombre
	 * @param idApp Representa el id de la aplicación
	 * @param idUp Representa el id de la unidad programática
	 * @param name Nombre del parámetro a buscar
	 */
	public ShowByUnidadProgramaticaNombre(idApp: string, idUp: string, name: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/filtro-unidad-programatica/' + idApp + '/' + idUp + '/' + name;

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
	 * Método encargado de insertar los datos de los parámetros
	 * @param data Conjunto de datos para insertar
	 */
	public CreateUpdate(data: Array<IParametro>): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.put(this.apiUrl, data).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
