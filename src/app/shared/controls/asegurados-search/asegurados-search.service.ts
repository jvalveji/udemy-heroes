// Definición typescript para el servicio AseguradosSearchService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from '../../../shared/interfaces/crud';
import { IHttpResponse } from '../../../shared/interfaces/http-response';

/**
 * Servicio encargado de exponer el CRUD sobre las consultas SIAC.
 */
@Injectable()
export class AseguradosSearchService implements ICRUD {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/shared/asegurados/';  // URL web API

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
	 * Método que obtiene los datos del paciente por tipo de identificación e identificación
	 * @param filtro Parámetro que indica el filtro de búsqueda para la consulta SIAC (tipo de identificación e identificación)
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public showByID(filtro: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + `${filtro.tipoIdentificacion}/${filtro.identificacion}`;

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
	 * Método que obtiene los datos del paciente por tipo de identificación e identificación
	 * @param filtro Parámetro que indica el filtro de búsqueda para la consulta SIAC (tipo de identificación e identificación)
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public showByFilter(filtro: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + `${filtro.tipoIdentificacion}/${filtro.nombre}/${filtro.primerApellido}/${filtro.segundoApellido}/${filtro.sexo}`;

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
}
