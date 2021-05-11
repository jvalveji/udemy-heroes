// Definición typescript para el servicio EtlsTaskService v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

// variables de ambiente (desarrollo/producción)
import { environment } from 'environments/environment';
// importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from '../../../shared/interfaces/crud';
import { IHttpResponse } from '../../../shared/interfaces/http-response';

/**
 * Espacio de nombres para los tipos de respuestas esperadas a la ejecución de un ETL en Pentaho
 */
export namespace TiposRespuestaETLPentaho {
	/**
	 * Listado de tipos
	 */
	export enum Tipos {
		/**
		 * Normal; solo ejecuta
		 */
		Normal,
		/**
		 * Ejecución del ETL con una respuesta JSON
		 */
		JSON,
		/**
		 * Ejecución del ETL con una respuesta XML
		 */
		XML
	};
};

/**
 * Servicio con las funcionalidades para interarctuar con los procesos (Etls) de Pentaho
 */
@Injectable()
export class EtlsTaskService {
	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/shared/pentaho/etls'; // URL web API

	/**
	 *  Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	 *  Método que obtiene la información de la lista de Etls que se han ejecutado en el servidor
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
	 * @param name Parámetro con el nombre del etl a buscar
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Show(name: string): Promise<IHttpResponse> {
		// Se contruye la URL
		const _url = this.apiUrl + '/status/' + name;

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
	* Método encargado de ejecutar el Etl en el servidor de Pentaho
	* @param _rootEtl Indica la ruta del fichero en el servidor de Pentaho (incluye el nombre del fichero)
	* @param _tipo Indica el tipo de respuesta esperada para la ejecución del ETL (Html/JSON/XML.
	* @param _parametros (opcional) Indica los parámetros a enviar al servidor (Ej.: [{param1:'uno'},{param2:'dos'}])
	* @param _credenciales (opcional) Indica datos de logueo para ejecutar el etl en el servidor Pentaho(Ej.: {user:'JDoe',pass:'12345'})
	* @summary 	Si el ETL es un Data Service a nivel de Pentaho puede indicar dentro del objeto "propiedades" lo siguiente: _parametros.isDataService: true.
	*			De esta forma el servicio retornara los datos de forma pura (JSON / XML)
	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	*/
	public Create(_rootEtl: string, _tipo: TiposRespuestaETLPentaho.Tipos, _parametros?: any, _credenciales?: any): Promise<IHttpResponse> {
		// Se establecen los datos a enviar al servidor
		const data = { rootEtl: _rootEtl };

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
		// Se agrega el dato de tipo de respuestas del ETL
		data['isDataService'] = _tipo;

		// Se valida el tipo de respuesta esperada
		if (_tipo === TiposRespuestaETLPentaho.Tipos.Normal
			|| _tipo === TiposRespuestaETLPentaho.Tipos.JSON) {
			// Para este caso la respuesta esperada es en formato JSON o text normal

			// Crea la promesa con la solicitud al servidor
			return new Promise((resolve, reject) => {
				this.http.post(this.apiUrl, data)
					.pipe(map((res: IHttpResponse) => res))
					.subscribe(res => {
						resolve(res);
					}, (err) => {
						reject(err);
					});
			});
		} else {
			// Para este caso se espera que la respuesta sea XML
			// Importante: Del lado del servicio rest se debe incluir el header al response que corresponde a un XML
			// Ej.: response.set('Content-Type', 'text/xml');

			// Crea la promesa con la solicitud al servidor
			return new Promise((resolve, reject) => {
				this.http.post(this.apiUrl, data, {
					responseType: 'text'
				})
					// .pipe(map((res: IHttpResponse) => res))
					.subscribe(res => {
						// Se crea una variable con el tipo de respuesta IHttpResponse
						const _res: IHttpResponse = {
							exito: true,
							data: res
						};
						// Se retorna la respuesta
						resolve(_res);
					}, (err) => {
						reject(err);
					});
			});
		}
	};
};
