// Definición typescript para el servicio UnidadesProgramaticasInicioSesionService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// variables de ambiente (desarrollo/producción)
import { environment } from 'environments/environment';
// importación de librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../../shared/interfaces/crud';
import { IHttpResponse } from './../../../shared/interfaces/http-response';
import { IUnidadProgramaticaInicioSesion } from '../interfaces/unidad-programatica-inicio-sesion';

/**
 * Servicio con las funcionalidades para operar mediante el protocolo HTTP para las unidades programáticas
 * de inicio de sesión
 */
@Injectable()
export class UnidadesProgramaticasInicioSesionService implements ICRUD {

	/** Url del servicio api a consumir por el servicio */
	private apiUrl = environment.urlApi.main + '/admin/catalogos/unidades-programaticas-inicio-sesion/';

	/**
	 *  Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	/**
	 * Método que obtiene la información de la lista de deficiones de las unidades programáticas
	 * autorizadas
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
	 * Método que obtiene la información de las unidades programáticas de inicio de sesión
	 * @param id Id de la unidad programática de inicio de sesión
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Show(id: string): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(this.apiUrl + '/' + id).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Método que obtiene la información de las unidades programáticas de inicio de sesión
	 * asociadas a la aplicación actual
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ShowByAplicacionLocal(): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(this.apiUrl + '/aplicacion').pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Método que obtiene la información las unidades programáticas de inicio de sesión por aplicación
	 * @param id Id de la aplicación arca
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ShowByIdAplicacion(id: string): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(this.apiUrl + '/aplicacion/' + id).pipe(
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
	public Create(data: IUnidadProgramaticaInicioSesion): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(this.apiUrl, data).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 *  Método que se encarga de eliminar el registro de los items del catálogo en la base de datos.
	 * @param id Id del documento a eliminar
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Delete(id: string): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.delete(this.apiUrl + '/' + id).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 *  Método que se encarga de crear registros de los items del catálogo en la base de datos.
	 * @param data Parámetro con los datos para realizar la actualización en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos del catálogo solicitado
	 */
	public Update(data: IUnidadProgramaticaInicioSesion): Promise<IHttpResponse> {
		// Se construye la url
		const _url = this.apiUrl + '/' + data._id;
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.put(_url, data).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
