// Definición typescript para el servicio PermisosUsuariosService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Se importan las interfaces a utilizar
import { ICRUD } from './../../../shared/interfaces/crud';
import { IHttpResponse } from './../../../shared/interfaces/http-response';

/**
 * Servicio encargado de exponer el CRUD sobre los permisos de los usuarios del sistema.
 */
@Injectable()
export class PermisosUsuariosService implements ICRUD {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main + '/admin/usuarios/permisos';  // URL web API

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
	 * Método que obtiene los datos de los permisos del usuario por aplicación y unidad programática
	 * @param filtro Parámetro que indica el filtro de búsqueda para el permiso del usuario
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ListByUsuarioAplicacionUnidadProgramatica(filtro: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/' + filtro.app + '/' + filtro.up + '/' + filtro.usuario

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
	 * Método que se encarga de actualizar las aplicaciones y perfiles el usuario
	 * para la unidad programática actual
	 * @param data Parámetro con los datos para realizar la actualización en la base de datos
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public UpdateByUsuarioYUnidadProgramatica(data: any): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/' + data.aplicacion_id + '/' + data.unidadProgramatica_id + '/' + data.usuario_id;

		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.put(URL, data.permisos).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Método que valida si el usuario posee el permiso para la aplicación y unidad programática
	 * @param aplicacion_id Indica el id de la aplicación
	 * @param unidadProgramatica_id Indica el id de la uniad programáticas
	 * @param usuario_id Indica el id del usuario
	 * @param permiso Indica el nombre del permiso a validar
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ValidarPermisoUsuarioPorNombre(aplicacion_id: string, unidadProgramatica_id: string, usuario_id: string, permiso: string): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/' + aplicacion_id + '/' + unidadProgramatica_id + '/' + usuario_id + '/' + permiso;

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
