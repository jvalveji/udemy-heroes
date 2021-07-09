// Definición typescript para el servicio UsuariosService v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../shared/interfaces/crud';
import { IHttpResponse } from './../../shared/interfaces/http-response';

/**
 * Servicio encargado de exponer el CRUD sobre los usuarios del sistema.
 */
@Injectable()
export class UsuariosService implements ICRUD {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/admin/usuarios/main/';  // URL web API

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
	 * Método que obtiene la información de la lista de usuarios del sistema por filtro
	 * @param _filtro Parámetro que indica el filtro de búsqueda para los usuarios
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Show(_filtro: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + ((_filtro) ? _filtro : 'todos');

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
	 * Método que obtiene la información especifica del usuario
	 * @param _usuario Indica el id del usuario en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ShowById(_usuario: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + 'id/' + _usuario;

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
	 * Método que se encarga de crear un nuevo registro de usuarios en la base de datos.
	 * @param _data Parámetro con los datos para realizar la inserción en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Create(_data: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.post(URL, _data).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Método que se encarga de actualizar un registro de usuarios en la base de datos.
	 * @param _id Parámetro que indica el id del usuario a actualizar los datos
	 * @param _data Parámetro con los datos para realizar la actualización en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Update(_id: any, _data: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + _id;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.put(URL, _data).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
	/**
	 * Método que se encarga de resetear la contraseña del usuario
	 * @param id Parámetro que indica el id del usuario a actualizar los datos
	 * @param esMise Parámetro que indica si el usuario es mise o no
	 * @param notificaciones Parámetro con los datos para enviar la notificación al usuario
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public Reset(id: any, esMise: boolean, notificaciones: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + id;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.patch(URL, [{ esMise: esMise }, notificaciones]).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
