// Definición typescript para el servicio ServiciosService v4.0.0
// Proyecto: Arca - Nutrición
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
import { IServicio } from '../interfaces/servicio';

/** Servicio con las funcionalidades para operar mediante el protocolo HTTP para lista de servicios desde el catálogo general */
@Injectable()
export class ServiciosService implements ICRUD {
	/** Url del servicio api a consumir por el servicio */
	private apiUrl = environment.urlApi.main + '/admin/catalogos/servicios'; // URL web API
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
	 *  Método que obtiene la información de la lista del catálogo (solo los que contenga el código SIGES)
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public ListBySIGES(): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(this.apiUrl + '/SIGES/').pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	  *  Método que obtiene un elemento especifico del catálogo
	  * @param id Parámetro con el id del documento
	  * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	  */
	public Show(id: string): Promise<IHttpResponse> {
		// Se construye la url
		const _url = this.apiUrl + '/' + id;
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(_url).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	  *  Método que obtiene un elemento especifico del catálogo por código SIGES
	  * @param id Parámetro con el id del documento
	  * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	  */
	public ShowByIdSIGES(id: number): Promise<IHttpResponse> {
		// Se construye la url
		const _url = this.apiUrl + '/siges/' + id;
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(_url).pipe(
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
	public Create(data: IServicio): Promise<IHttpResponse> {
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
	public Update(data: IServicio): Promise<IHttpResponse> {
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
