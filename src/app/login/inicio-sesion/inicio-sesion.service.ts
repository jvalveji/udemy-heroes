// Definición typescript para el servicio InicioSesionService v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // Variables de ambiente
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importa las interfaces a utilizar
import { ICRUD } from './../../shared/interfaces/crud';
import { IHttpResponse } from './../../shared/interfaces/http-response';
import { ILogin } from '../interfaces/login';

/**
 * Servicio encargado de exponer el CRUD sobre el inicio de sesión de los usuarios
 * en el sistema
 */
@Injectable()
export class InicioSesionService implements ICRUD {

	/**
     * Url del servicio api a consumir por el servicio
     */
	private apiUrl = environment.urlApi.main + '/login';  // URL web API

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
     * Metódo que se encarga de obtener las unidades programáticas asociadas al usuario
     * @param usuario Nombre del usuario
     * @returns Retorna un objeto de tipo IHttpResponse
     */
	public Show(usuario: string): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			// Se declara un encabezado indicandos que el request
			// no requiere agregar en la petición la llave o token de Authorization
			const _headers = new HttpHeaders();
			_headers.set('X-NoInterceptor', 'NOT');

			this.http
				.get(this.apiUrl + '/ups/' + usuario, { headers: _headers }).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
     * Metódo que se encarga de enviar los datos de usuario y contraseña al servidor
     * y validar si el usuario puede iniciar sesión
     * @param credencial Parámetro de tipo ILogin con las credenciales del usuario
     * @returns Retorna un objeto de tipo IHttpResponse
     */
	public Update(credencial: ILogin): Promise<IHttpResponse> {
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			// Se declara un encabezado indicandos que el request
			// no requiere agregar en la petición la llave o token de Authorization
			const _headers = new HttpHeaders();
			_headers.set('X-NoInterceptor', 'NOT');

			// Realiza la consulta
			this.http
				.put(this.apiUrl + '/' + environment.aplicativo, credencial, { headers: _headers }).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
