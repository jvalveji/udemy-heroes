// Definición typescript para el servicio bancosService v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Descripción: Servicio con las funcionalidades para operar mediante el protocolo HTTP
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

// Variables de ambiente (desarrollo/producción)
import { environment } from 'environments/environment';

// importación de librerias de angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

// Se importa las interfaces a utilizar
import { IHttpResponse } from './../../../shared/interfaces/http-response';
import { ICRUD } from './../../../shared/interfaces/crud';

@Injectable()
export class BancosService implements ICRUD {
	/** Url del servicio api a consumir por el servicio */
	private apiUrl = environment.urlApi.main + '/admin/catalogos/bancos'; // URL web API
	constructor(private http: HttpClient) { }

	/**
	 * Método que se encarga de obtener los bancos que se encuentran en el catalogo.
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	List(): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/bancos';
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(URL)
				.pipe(map((res: IHttpResponse) => res))
				.subscribe(
					(res) => {
						resolve(res);
					},
					(err) => {
						reject(err);
					}
				);
		});
	}
	/**
	 * Método que se encarga de obtener los bancos habilitados.
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	ListBancosHabilitados(): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/bancosHabilitados';
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(URL)
				.pipe(map((res: IHttpResponse) => res))
				.subscribe(
					(res) => {
						resolve(res);
					},
					(err) => {
						reject(err);
					}
				);
		});
	}
	/**
	 * Método que se encarga de obtener el banco por id.
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	showByName(data: any): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(this.apiUrl + '/showByName', data)
				.pipe(map((res: IHttpResponse) => res))
				.subscribe(
					(res) => {
						resolve(res);
					},
					(err) => {
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
					(res) => {
						resolve(res);
					},
					(err) => {
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
					(res) => {
						resolve(res);
					},
					(err) => {
						reject(err);
					}
				);
		});
	}
	Remove?(
		filter: any
	): Promise<
		import('./../../../shared/interfaces/http-response').IHttpResponse
	> {
		throw new Error('Method not implemented.');
	}
}
