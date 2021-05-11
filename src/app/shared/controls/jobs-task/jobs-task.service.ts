// Definición typescript para el servicio JobsTaskService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

// variables de ambiente (desarrollo/producción)
import { environment } from 'environments/environment';
// importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from '../../../shared/interfaces/crud';
import { IHttpResponse } from '../../../shared/interfaces/http-response';

/**
 * Servicio con las funcionalidades para interarctuar con los procesos (JOBS) de Pentaho
 */
@Injectable()
export class JobsTaskService implements ICRUD {
	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/shared/pentaho/jobs'; // URL web API

	/**
	 *  Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	 *  Método que obtiene la información de la lista de Jobs que se han ejecutado en el servidor
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
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
	 *  Método que se encarga de obtener el estado actual de un proceso ejecutado en el servidor de pentaho
	 * @param name Parámetro con el nombre del job a buscar
	 * @param id Parámetro con el id del job a buscar
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Show(name: string, id?: string, _credenciales?: any): Promise<IHttpResponse> {
		// Se contruye la URL
		const _url = this.apiUrl + '/status/' + name + ((id) ? '/' + id : '');

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
	* Método encargado de ejecutar el Job en el servidor de Pentaho
	* @param _rootJob Indica la ruta del fichero en el servidor de Pentaho (incluye el nombre del fichero)
	* @param _parametros Indica los parámetros a enviar al servidor (Ej.: [{param1:'uno'},{param2:'dos'}])
	* @param _credenciales Indica datos de logueo para ejecutar el job en el servidor Pentaho(Ej.: {user:'JDoe',pass:'12345'})
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public Create(_rootJob: string, _parametros?: any, _credenciales?: any): Promise<IHttpResponse> {
		// Se establecen los datos a enviar al servidor
		const data = { rootJob: _rootJob };

		// Valida si existen los datos para los parametros
		if (_parametros) {
			// Agrega una nueva propiedad con los parametros
			data['parametros'] = _parametros;
		}
		// Valida si existen los datos para las credenciales
		if (_credenciales) {
			// Agrega una nueva propiedad con las credenciales
			data['credenciales'] = _credenciales;
		}

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http.post(this.apiUrl, data).pipe(
				map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
};
