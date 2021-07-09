// Definición typescript para el servicio ArticulosService v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importa las interfaces a utilizar
import { ICRUD } from './../../../shared/interfaces/crud';
import { IHttpResponse } from './../../../shared/interfaces/http-response';

/**
 * Servicio encargado de exponer el CRUD sobre los articulos de los catálogos del sistema.
 */
@Injectable()
export class ArticulosService implements ICRUD {
	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/admin/catalogos'; // URL web API

	/**
	 * Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	 * Método que obtiene la información de la lista de todos los articulos del core
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public List(): Promise<IHttpResponse> {
		throw new Error('Method no implementado.');
	}

	/**
	 * Método que obtiene la información especifica  de los grupos solicitidos de artículos
	 * @returns Retorna un objeto de tipo IHttpResponse con la lista de clases del catálogo solicitado
	 */
	public ShowByClasesArticulos(): Promise<IHttpResponse> {
		const url = this.apiUrl + '/clases';

		return new Promise((resolve, reject) => {
			this.http
				.get(url)
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
	 * Método que obtiene la información especifica  de los grupos solicitidos de artículos
	 * @returns Retorna un objeto de tipo IHttpResponse con la lista de subClases del catálogo solicitado
	 */
	public ShowBySubClasesArticulos(): Promise<IHttpResponse> {
		const url = this.apiUrl + '/subClases';

		return new Promise((resolve, reject) => {
			this.http
				.get(url)
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
	 * Método que obtiene la información especifica  de los grupos solicitidos de artículos
	 * @returns Retorna un objeto de tipo IHttpResponse con la lista de grupos del catálogo solicitado
	 */
	public ShowByGruposArticulos(): Promise<IHttpResponse> {
		const url = this.apiUrl + '/grupos';

		return new Promise((resolve, reject) => {
			this.http
				.get(url)
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
	 * Método que obtiene la información especifica de las subClases solicitidas por clase.
	 * @param id Indica el id de la clase con la que se va a filtrar las subClases.
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos de subClases solicitados.
	 */
	public ShowSubClaseByClaseArcticulos(id: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const url = this.apiUrl + '/subClases/' + id;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(url)
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
	 * Método que obtiene la información especifica  de los grupos solicitidos por clase.
	 * @param id Indica el id de la subClase con el que se va a filtrar los grupos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos de grupos solicitados
	 */
	public ShowGruposBySubClaseArticulos(id: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const url = this.apiUrl + '/grupos/' + id;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(url)
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
}
