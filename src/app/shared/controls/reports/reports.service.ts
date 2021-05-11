// Definición typescript para el servicio PersonasService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Andrés Salas Brenes <asalasb@ccss.sa.cr>
// 					Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // Variables de ambiente
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Se importan las interfaces a utilizar
import { ICRUD } from '../../interfaces/crud';
import { IHttpResponse } from '../../interfaces/http-response';

/**
 * Servicio encargado de exponer el CRUD para el manejo de reportes de Pentaho
 */
@Injectable({
	providedIn: 'root'
})
export class ReportsPentahoService implements ICRUD {
	// Url del servicio api a consumir por el servicio
	private apiUrl = environment.urlApi.main;  // URL web API

	constructor(private http: HttpClient) { }

	/**
   	* Método no implementado
   	*/
	List(): Promise<IHttpResponse> {
		throw new Error('Method not implemented.');
	};

	/**
	 * Método encargado de obtener un reporte desde la plataforma Arca - Pentaho
	 * @param filter {any} Filtro con los datos a buscar
	 */
	Show(filter: any): Promise<any> {
		// Url completa del servicio
		const myURL = this.apiUrl + '/shared/pentaho/reportes' + filter.name;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			// Se crea una variable para los encabezados
			let headers = new HttpHeaders();
			// Ser agrega el tipo MIME
			headers = headers.set('Accept', filter.mime);
			// Se realiza consulta
			this.http
				.post(myURL, filter, { headers: headers, 'responseType': 'blob' as 'json' }).pipe(
					map((res: any) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
