// Definición typescript para el servicio HospitalizacionService v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// Se importan las interfaces a utilizar
import { ICRUD } from '../interfaces/crud';
import { IHttpResponse } from '../interfaces/http-response';

/**
 * Servicio encargado de exponer el CRUD para los servicios del sistema
 * Arca - Hospitalización (HCore)
 */
@Injectable({ providedIn: 'root' })
export class HospitalizacionService implements ICRUD {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlWs.hospitalizacion;  // URL web API

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
	 * Obtener la información por el id de la admisión
	 * @param idAdmision Id de la admisión a buscar
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ShowByAdmisionPorId(idAdmision: string): Promise<any> {
		// Url completa del servicio
		const URL = environment.urlApi.main + '/widgets/control-visitas/ObtenerIdAdmision/' + idAdmision;
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(URL)
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Obtener la información de las visitas por unidad programática
	 * @param idUnidadProgramatica Id de la unidad programática
	 * @returns Retorna un objeto de tipo IHttpResponse con los datos solicitados
	 */
	public ShowByVisitasPorUnidadProgramatica(idUnidadProgramatica: string): Promise<any> {
		// Url completa del servicio
		const URL = environment.urlApi.main + '/widgets/control-visitas/ObtenerVisitasUP/' + idUnidadProgramatica;
		return new Promise((resolve, reject) => {
			this.http
				.get(URL)
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Obtiene la información de la admisión por la identificación del asegurado
	 * @param identificacion Número de identificación del asegurado
	 * @param idUnidadProgramatica Identificador de la unidad programática
	 * @returns Retorna un objeto de tipo <any> con la información de la admisión
	 */
	public ShowByAdmisionPorIdentificacion(identificacion: string, idUnidadProgramatica: string): Promise<any> {
		// Parametros a enviar al servicio
		const PARAMS = new HttpParams();
		PARAMS.append('idTipoIdentificacion', '0');
		PARAMS.append('identificacion', identificacion);
		PARAMS.append('idUnidadProgramatica', idUnidadProgramatica);
		// Url completa del servicio
		const URL = this.apiUrl + '/ObtenerInformacionAdmisionPorIdentificacion';

		return new Promise((resolve, reject) => {
			this.http
				.get(URL, { params: PARAMS })
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Obtiene la información de las visitas que tiene permitido el asegurado de forma simultánea
	 * @param idAdmision Número de admisión asociado al asegurado
	 * @returns Retorna un objeto de tipo <any> con la información del número de visitas permitidas por admisión
	 */
	public ShowByNumeroVisitasPorIdAdmision(idAdmision: number): Promise<any> {
		// Parametros a enviar al servicio
		const PARAMS = new HttpParams();
		PARAMS.append('idAdmision', idAdmision.toString());
		// Url completa del servicio
		const URL = this.apiUrl + '/ObtenerNumeroVisitasPorIdAdmision';

		return new Promise((resolve, reject) => {
			this.http
				.get(URL, { params: PARAMS })
				.subscribe(res => {
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};
}
