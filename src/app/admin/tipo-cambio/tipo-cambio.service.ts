// Definición typescript para el servicio TipoCambioService v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Descripción: Servicio con las funcionalidades para operar mediante el protocolo HTTP
// Modificado: (31-07-2020) Ing. Dagoberto Gómez Jiménez

// Variables de ambiente (desarrollo/producción)
import { environment } from 'environments/environment';

// Importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { IHttpResponse } from './../../shared/interfaces/http-response';
import { ICRUD } from './../../shared/interfaces/crud';

@Injectable()
export class TipoCambioService implements ICRUD {
	/** Url del servicio api a consumir por el servicio */
	private apiUrl = environment.urlApi.main; // URL web API

	constructor(private http: HttpClient) { }

	/**
	* Método que se encarga de obtener las monedas que estan disponibles para convertir.
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public List(): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(this.apiUrl + '/admin/tipo-cambio').pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 *  Método que se encarga de crear/actualizar registros de los items del catálogo en la base de datos.
	 * @param data Parámetro con los datos para realizar la inserción en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Create(data: any): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(this.apiUrl + '/admin/tipo-cambio', data)
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
	};

	/**
	 *  Método que se encarga de crear/actualizar registros de los items del catálogo en la base de datos.
	 * @param data Parámetro con los datos para realizar la inserción en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Update(data: any): Promise<IHttpResponse> {
		const URL = this.apiUrl + '/admin/tipo-cambio' + `/${data._id}`;
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
	};

	/**
	* Método que se encarga de obtener los indicadores por la fecha de creacion guardados en la base de datos
	* @param _data Parámetro con los datos para realizar la consulta del WS
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ObtenerIndicadoresEconomicosWS(_data: any): Promise<IHttpResponse> {

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(this.apiUrl + '/admin/tipo-cambio/indicadorEconomico', { items: _data }).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	* Método que se encarga de obtener los indicadores por dia guardados en la base de datos.
	* @param _data Parámetro con los datos para realizar la consulta del WS
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ObtenerIndicadoresPorDia(_data: any): Promise<IHttpResponse> {

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(this.apiUrl + '/admin/tipo-cambio/indicadoresEconomicosPorDia', { items: _data }).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	* Método que se encarga de obtener los indicadores por la fecha de creacion guardados en la base de datos
	* @param _data Parámetro con los datos para realizar la consulta del WS
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ObtenerIndicadoresPorDiaCreacion(_data: any): Promise<IHttpResponse> {

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(this.apiUrl + '/admin/tipo-cambio/indicadoresEconomicosPorDiaCreacion', { items: _data }).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
