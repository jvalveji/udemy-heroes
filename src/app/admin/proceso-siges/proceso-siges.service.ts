// Definición typescript para el servicio ProcesoSIGESService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (29-06-2020) Ing. Dagoberto Gómez Jiménez

// variables de ambiente (desarrollo/producción)
import { environment } from 'environments/environment';
// importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../shared/interfaces/crud';
import { IHttpResponse } from './../../shared/interfaces/http-response';

/**
 * Servicio con las funcionalidades para operar mediante el protocolo HTTP para el proceso de carga
 * de datos del catálogo de SIGES
 */
@Injectable()
export class ProcesoSIGESService implements ICRUD {
	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/admin/proceso-siges'; // URL web API

	/**
	 *  Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	* Método no implementado
	*/
	List(): Promise<IHttpResponse> {
		throw new Error('Method not implemented.');
	};

	/**
	 *  Método que se encarga de subir un fichero Excel con los datos del SIGES al servidor
	 * @param form Parámetro con los datos del formulario a subir
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Upload(form: FormData): Promise<IHttpResponse> {
		// Se declaran encabezados
		const headers = new HttpHeaders();
		headers.set('Content-Type', 'multipart/form-data');
		headers.set('Accept', 'multipart/form-data');

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(this.apiUrl + '/upload', form, { headers }).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	}
};
