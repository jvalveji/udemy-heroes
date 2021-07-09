// Definición typescript para el servicio PrinterService v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (19-05-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { IHttpResponse } from '../../interfaces/http-response';
import { IDocumento } from './documento';
/**
 * Servicio encargado de gestionar las operaciones CRUD en el manejo
 * del componente de impresoras
 */
@Injectable()
export class PrinterService {
	/**
  	* Url del servicio api a consumir por el servicio
  	*/
	private apiUrl = environment.urlApi.printer;  // URL web API

	/**
	 * Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	 * Método encargado de listar las impresoras locales del usuario actual
	 */
	public PrintList(): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + 'list';

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
	 * Método encargado de listar las propiedades(nombres de impresora por tipo de impresión) de las impresoras locales del usuario actual
	 * Por defecto se crean los siguientesn tipos de impresión (*****tratar de utilizar estos, si se crean nuevos tratar de que sean en plural por estandar)
	 * Comprobantes
	 * Etiquetas
	 * Reportes
	 * Laminas
	 * Otra
	 */
	public ParamPrintList(): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + 'propertiesList';

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
  	* Método encargado de crear un nuevo trabajo de impresión
  	* @param data
  	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
  	*/
	public PrintCreate(data: IDocumento): Promise<IHttpResponse> {

		// Urls completa del servicio
		const url = this.apiUrl + 'printpdfbyjson';
		return new Promise((resolve, reject) => {
			this.http.post(url, data).pipe(
				map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				},
					(err) => {
						reject(err);
					});
		});
	};

	/**
	* Método encargado de crear o actualizar los parámetros locales de impresión
	* @param data representa el json con los parámetros
	* @returns Retorna un objeto de tipo IHttpResponse con los datos
	*/
	public ParamPrintCreate(data: any): Promise<IHttpResponse> {
		// Urls completa del servicio
		const url = this.apiUrl + 'propertiesCreate';
		return new Promise((resolve, reject) => {
			this.http.post(url, data).pipe(
				map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				},
					(err) => {
						reject(err);
					});
		});
	};

	/**
   	* Método encargado de crear un nuevo trabajo de impresión
   	* @param data Representan los datos de imrpesión
   	* @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
   	*/
	public PrintByURL(data: any): Promise<IHttpResponse> {
		// Variable para concatenar la ruta del reporte
		let urlPentaho = '/home' + data._reportPath + '/' + data._reportName;
		// Se reemplazan los caracteres '/' por '%3A'
		urlPentaho = urlPentaho.replace(/\//g, '%3A');
		// Concatena los datos de usuario y contraseña y lo establece la salida a pdf
		urlPentaho += '/generatedContent?output-target=pageable/pdf&userid=' + data._reportUser + '&password=' + data._reportPw;
		// En caso de existir parámetros los concatena
		if (data._reportParams) {
			urlPentaho += '&' + data._reportParams;
		}
		// se establecen los parámetros para el servicio de arcaprinters
		const param: any = {
			'printerName': data._printerName,
			'url': environment.pentaho + urlPentaho
		};

		// Urls completa del servicio
		const url = this.apiUrl + 'printurl';
		return new Promise((resolve, reject) => {
			this.http.post(url, param).pipe(
				map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				},
					(err) => {
						reject(err);
					});
		});
	};
}
