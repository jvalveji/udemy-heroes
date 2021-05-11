// Definición typescript para el servicio DiagnosticosService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importa las interfaces a utilizar
import { ICRUD } from './../../../shared/interfaces/crud';
import { IHttpResponse } from './../../../shared/interfaces/http-response';

/**
 * Servicio encargado de exponer el CRUD sobre el catálogo de diagnósticos.
 */
@Injectable()
export class DiagnosticosService implements ICRUD {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/admin/catalogos';  // URL web API

	/**
	 * Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	 * Método no implementado
	 */
	public List(): Promise<IHttpResponse> {
		throw new Error('Servicio no implementado.');
	};

	/**
	* Método que obtiene la información del catálogo de capítulos que componen el CIE10
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ShowByCapitulosCIE10(): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/diagnosticos/capitulos';

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
	* Método que obtiene la información del catálogo de grupos que componen el CIE10
	* @param capitulo Indica el ID del capítulo para filtrar en el grupo
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ShowByGruposCIE10(capitulo: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/diagnosticos/grupos/' + capitulo;

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
	* Método que obtiene la información del catálogo de categorías que componen el CIE10
	* @param capitulo Indica el ID del grupo para filtrar en las categorías
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ShowByCategoriasCIE10(grupo: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/diagnosticos/categorias/' + grupo;

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
	* Método que obtiene la información del catálogo de diagnósticos del CIE10 por código de diagnóstico
	* @param codigo Indica el código CIE10 del diagnóstico a buscar
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ShowDiagnosticoByCodigo(codigo: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/diagnosticos/codigoCIE10/' + codigo;

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
	* Método que obtiene la información del catálogo de diagnósticos del CIE10 por descripción de diagnóstico
	* @param descripcion Indica la descripción del diagnóstico a buscar
	* @param capitulo (Opcional)Indica el ID de la categoría CIE10
	* @param grupo (Opcional)Indica el ID del grupo CIE10
	* @param categoria (Opcional)Indica el ID de la categoría CIE10
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public ShowDiagnosticoByDescripcion(descripcion: string, capitulo?: string, grupo?: string, categoria?: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/diagnosticos/descripcionCIE10/' + descripcion;
		// Variable con los parametros a pasar al servicio
		const params = '/' + ((capitulo) ? capitulo : '0') + '/' + ((grupo) ? grupo : '0') + '/' + ((categoria) ? categoria : '0');

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(URL + params).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
