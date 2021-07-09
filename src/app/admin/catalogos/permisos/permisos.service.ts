// Definición typescript para el servicio PermisosService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// variables de ambiente (desarrollo/producción)
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment';
// importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../../shared/interfaces/crud';
import { IHttpResponse } from './../../../shared/interfaces/http-response';
import { IPermiso } from '../interfaces/permiso';

/**
 * Servicio con las funcionalidades para operar mediante el protocolo HTTP para los permisos
 */
@Injectable()
export class PermisosService implements ICRUD {

	/** Url del servicio api a consumir por el servicio */
	private apiUrl = environment.urlApi.main + '/admin/catalogos/permisos/';

	/**
	 *  Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	 * Método que obtiene la información de la lista de deficiones de los permisos
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
	 * Método que obtiene la información del permiso especifico
	 * @param id Id del permiso
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Show(id: string): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(this.apiUrl + '/' + id).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Método que obtiene la información de los permisos asociados a la aplicación actual
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ShowByAplicacionLocal(): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(this.apiUrl + '/aplicacion').pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Método que obtiene la información los permisos por aplicación especifica
	 * @param id Id de la aplicación arca
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ShowByIdAplicacion(id: string): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(this.apiUrl + '/aplicacion/' + id).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 *  Método que se encarga de crear registros de los items del catálogo en la base de datos.
	 * @param data Parámetro con los datos para realizar la inserción en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Create(data: IPermiso): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(this.apiUrl, data).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 *  Método que se encarga de eliminar el registro de los items del catálogo en la base de datos.
	 * @param id Id del documento a eliminar
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Delete(id: string): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.delete(this.apiUrl + id).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 *  Método que se encarga de actualizar registros de los items del catálogo en la base de datos.
	 * @param data Parámetro con los datos para realizar la actualización en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Update(data: IPermiso): Promise<IHttpResponse> {
		// Se construye la url
		const _url = this.apiUrl + data._id;
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.put(_url, data).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
