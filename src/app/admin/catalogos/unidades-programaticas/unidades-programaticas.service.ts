
// Definición typescript para el servicio UnidadesProgramaticasService v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Servicio con las funcionalidades para operar mediante el protocolo HTTP
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

// variables de ambiente (desarrollo/producción)
import { environment } from 'environments/environment';
// importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../../shared/interfaces/crud';
import { IHttpResponse } from './../../../shared/interfaces/http-response';
import { IUnidadProgramatica } from './../../../shared/interfaces/unidad-programatica';

/** Servicio con las funcionalidades para operar mediante el protocolo HTTP para unidades programáticas del catálogo general */
@Injectable({
	providedIn: 'root'
})
export class UnidadesProgramaticasService implements ICRUD {
	/** Url del servicio api a consumir por el servicio */
	private apiUrl = environment.urlApi.main + '/admin/catalogos/unidades-programaticas/'; // URL web API
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
	 * Método que obtiene la información de una unidad programática desde el catálogo de unidades programáticas
	 * @param id Id de la unidad programática
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Show(id: string): Promise<IHttpResponse> {
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
	 *  Método que se encarga de crear registros de los items del catálogo en la base de datos.
	 * @param data Parámetro con los datos para realizar la inserción en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Create(data: IUnidadProgramatica): Promise<IHttpResponse> {
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
	 *  Método que se encarga de actualizar registros de los items del catálogo en la base de datos.
	 * @param data Parámetro con los datos para realizar la actualización en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Update(data: IUnidadProgramatica): Promise<IHttpResponse> {
		// Se construye la url
		const _url = this.apiUrl + '/' + data._id;

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
};
