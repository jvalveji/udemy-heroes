
// Definición typescript para el servicio ArticulosSigesSearchService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Fabián Cascante Arce <fcascant@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

import { map } from 'rxjs/operators';
import { environment } from 'environments/environment'; // Variables de ambiente
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Se importan las interfaces a utilizar
import { ICRUD } from '../../interfaces/crud';
import { IHttpResponse } from '../../interfaces/http-response';

/**
 * Servicio encargado de exponer el CRUD para los artículos del SIGES
 */
@Injectable()
export class ArticulosSigesSearchService implements ICRUD {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrlArticulos = environment.urlApi.main + '/shared/articulos/';  // URL web API

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
	* Método que obtiene la información especifica del artículo solicitado con los parámetros.
	* @param params Indica los parámetros con los que se va a filtrar el artículo.
	* @returns Retorna un objeto de tipo IHttpResponse con los datos de los artículos solicitados con el filtro.
	*/

	public showByFiltro(params: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const url = this.apiUrlArticulos + params.clase_id + '/' + params.subClase_id + '/' + params.grupo_id + '/' + params.filtro;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(url).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
