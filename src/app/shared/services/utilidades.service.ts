// Definición typescript para el servicio UtilidadesService v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (30-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval as observableInterval } from 'rxjs';
import { share, map } from 'rxjs/operators';
import moment from 'moment';

// Se importan las interfaces a utilizar
import { IHttpResponse } from '../interfaces/http-response';

/**
 * Servicio encargado de suministrar funcionalidades utilitarias generales
 * para toda la aplicación
 */
@Injectable({ providedIn: 'root' })
export class UtilidadesService {

	/**
	 * Url del servicio api a consumir por el servicio
	 */
	private apiUrl = environment.urlApi.main;  // URL web API
	/**
	 * Variable que contendra la información de la hora y fecha actual
	 */
	private reloj: Observable<Date>;
	/**
	 * Variable que representa la expresión regular para manejo de fechas
	 * @example
	 * Ejemplo de formatos en español:
	 * mm/dd/yyyy, m/d/yyyy
	 *
	 * [Regex101]{@link https://regex101.com/r/vF0fL6/1}
	 */
	public DATE_REGEX = new RegExp(/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/);
	/**
	 * Variable que representa la expresión regular para manejo de tiempo (horas y minutos)
	 * @example
	 * Ejemplo de formatos:
	 * h:mm am/pm, hh:mm AM/PM
	 *
	 * [Regex101]{@link https://regex101.com/r/j2Cfqd/1/}
	 */
	public TIME_REGEX = new RegExp(/^((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))$/);

	/**
	 * Constructor de la clase
	 * @param http Variable que representa al módulo HTTP
	 */
	constructor(private http: HttpClient) { }

	// Métodos públicos

	/**
	 * Método que obtiene la información de la fecha y hora del servidor de aplicaciones
	 * @returns Retorna un objeto de tipo IHttpResponse con el dato de la fecha y hora actual del servidor
	 * de aplicaciones
	 */
	public ShowServidorNTP(): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/shared/utilidades/ntp';
		// Crea la promesa con la solicitud al servidor
		return new Promise((resolve, reject) => {
			this.http
				.get(URL).pipe(
					map((res: IHttpResponse) => res))
				.subscribe(res => {
					// Establec el dato de la fecha y hora
					this.CreateInicioReloj(res.data);
					resolve(res);
				}, (err) => {
					reject(err);
				});
		});
	};

	/**
	 * Método que retorna la información de la fecha y hora del reloj
	 * @returns Retorna un objeto de tipo fecha con el dato de la fecha actual
	 */
	public ShowInfoReloj(): Observable<Date> {
		return this.reloj;
	};

	/**
	 * Método encargado de crear/establecer una cookie
	 * @param nombre Nombre de la cookie
	 * @param value Valor de la cookie
	 * @param expireDays Cantidad de dias de expiración
	 * @param path URL asociado a la cookie
	 */
	public UpdateCookie(nombre: string, value: string, expireDays: number, path: string = ''): void {
		const d: Date = new Date();
		d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
		const EXPIRES = `expires=${d.toUTCString()}`;
		const CPATH: string = path ? `; path=${path}` : '';
		document.cookie = `${nombre}=${value}; ${EXPIRES}${CPATH}`;
	};

	/**
	 * Método encargado de retornar una cookie
	 * @param nombre Nombre de la cookie a obtener
	 * @returns Retorna una cookie ; si no existiese retorna nulo
	 */
	public ShowCookie(nombre: string): string {
		const LEN = (nombre.length + 1);
		return document.cookie
			.split(';')
			.map(c => c.trim())
			.filter(cookie => {
				return cookie.substring(0, LEN) === `${nombre}=`;
			})
			.map(cookie => {
				return decodeURIComponent(cookie.substring(LEN));
			})[0] || null;
	};

	/**
	 * Método encargado de eliminar una cookie
	 * @param nombre Nombre de la cookie a eliminar
	 */
	public RemoveCookie(nombre): void {
		this.UpdateCookie(nombre, '', -1);
	};

	/**
	   * Método que establece el valor de los datos del usuario de la plataforma
	   * @param data Parámetro que representa los datos del usuario
	   */
	public UpdateUsuarioLocal(data: any): void {
		localStorage.setItem('arca-user', JSON.stringify(data));
	};

	/**
	 * Método que retorna los datos del usuario guardados en el almacenamiento local
	 * @returns Objeto complejo tipo JSON con los datos del usuario en sesión
	 */
	public ListUsuarioLocal(): any {
		return JSON.parse(localStorage.getItem('arca-user') || null);
	};

	/**
	 * Método que elimina los datos del usuario del almacenamiento local
	 */
	public RemoveUsuarioLocal(): void {
		localStorage.removeItem('arca-user');
	};

	/**
	   * Método que establece el valor de los datos para los parámetros en la plataforma
	   * @param data Parámetro que representa los datos del usuario
	   */
	public UpdateParametrosLocal(data: string): void {
		localStorage.setItem('arca-parametros', JSON.stringify(data));
	};

	/**
	 * Método que obtiene el valor de los datos para los parámetros en la plataforma
	 * @returns Retorna un arreglo con los parámetros
	 */
	public ListParametrosLocal(): any {
		return JSON.parse(localStorage.getItem('arca-parametros') || null);
	};

	/**
	 * Método que elimina el token del almacenamiento local
	 */
	public RemoveParametrosLocal(): void {
		localStorage.removeItem('arca-parametros');
	};

	/**
	 * Método encargado de convertir un texto a formato fecha y hora
	 * @param dateStr Cadena que representa una fecha
	 * @param timeStr Cadena que representa el tiempo
	 * @returns Retorna el dato convertido como una fecha
	 */
	public ConvertirTextoAFecha(dateStr: string, timeStr: string): Date {
		if (!this.DATE_REGEX.test(dateStr) || !this.TIME_REGEX.test(timeStr)) {
			console.error('No se puede convertir la cadena a un objeto de tipo Date.');
			return;
		}
		const date = new Date(dateStr);
		const timeArr = timeStr.split(/[\s:]+/); // https://regex101.com/r/H4dMvA/1
		let hour = parseInt(timeArr[0], 10);
		const min = parseInt(timeArr[1], 10);
		const pm = timeArr[2].toLowerCase() === 'pm';

		if (!pm && hour === 12) {
			hour = 0;
		}
		if (pm && hour < 12) {
			hour += 12;
		}
		date.setHours(hour);
		date.setMinutes(min);
		return date;
	};

	/**
	 * Método encargado de convertir una fecha local a su UTC
	 * @param {Date} fecha Parámetro que representa una fecha
	 * @returns Retorna la fecha dada en formato UTC
	 */
	public LocalDateToUTC(fecha): Date {
		// Valida si el dato es una fecha
		if (fecha instanceof Date) {
			// retorna el valor en formato de fecha local (-6 horas para Costa Rica)
			return moment(fecha).add(-6, 'h').toDate();
		}
		// Si no es fecha retorna nulo
		return null;
	};

	/**
	 * Método encargado de convertir una fecha UTC a la fecha local
	 * @param {Date} fecha Parámetro que representa una fecha
	 * @returns Retorna la fecha dada en formato Local
	 */
	public UTCToLocalDate(fecha): Date {
		// Valida si el dato es una fecha
		if (fecha instanceof Date) {
			// retorna el valor en formato de fecha local (-6 horas para Costa Rica)
			return moment(fecha).add(6, 'h').toDate();
		}
		// Si no es fecha retorna nulo
		return null;
	};

	/**
	 * Método que retorna la diferencia entre 2 datos de tipo fecha
	 * @param date1 Fecha menor
	 * @param date2 Fecha mayor
	 * @param format Indica el formato de la respuesta:
	 *  * d = dias
	 *  * m = minutos
	 *  * s = segundos
	 * @returns Retorna un dato numérico con la diferencia indicada
	 */
	public DiffDates(date1: Date, date2: Date, format: any): number {
		// Valida los datos ingresados
		if (date1 && date2 && format) {
			const fecha1 = moment(date1);
			const fecha2 = moment(date2);
			// Retorna la diferencia de fechas
			return fecha2.diff(fecha1, format);
		}
		// Si no cumple retorna nulo
		return null;
	};

	/**
	 * Método encargado de "simular" un tiempo muerto
	 * @param time Cantidad de tiempo en segundos
	 * @example
	 * // Simular una pausa de 10 segundos
	 * console.log('Antes del Sleep ->' + new Date());
	 * utilidadesService.Sleep(10).then(function () {
	 *    // Acá se ejecuta el código que continua posterior al tiempo "muerto"
	 *    console.log('Despues del Sleep ->' + new Date());
	 * });
	 * @returns Retorna una promesa con el timeout establecido
	 */
	public Sleep(time): Promise<any> {
		return new Promise((resolve) => setTimeout(resolve, (time * 1000)));
	};

	/**
	 * Método encargado de convertir una cadena de texto (con formato JSON) a
	 * un objeto de tipo JSON
	 * @param str Cadena de texto (en formato JSON)
	 * @returns Retorna un objeto de tipo json
	 */
	public JSONize(str): any {
		try {
			if (typeof str === 'string' || str instanceof String) {
				return JSON.parse(str
					// wrap keys without quote with valid double quote
					.replace(/([$\w]+)\s*:/g, function (_, $1) {
						return '"' + $1 + '":';
					})
					// replacing single quote wrapped ones to double quote
					.replace(/'([^']+)'/g, function (_, $1) {
						return '"' + $1 + '"';
					}));
			} else {
				if (str !== undefined && (str.constructor === Array || str.constructor === Object)) {
					return str;
				} else {
					return null;
				}
			}
		} catch (error) {
			return null;
		}
	};

	/**
	 * Método que permite capitalizar una cadena de texto
	 * @param cadena Representa la cadena de texto a capitalizar
	 * @returns Retorna la cadena de texto formateada a capital
	 */
	public Capitalizar(cadena): string {
		return cadena.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
			return a.toUpperCase();
		});
	};

	/**
	 * Método encargado de comprobar si la estructura de dos objetos del mismo tipo
	 * tienen valores diferentes en sus atributos
	 * @param estadoAnterior representa objeto en un estado inicial
	 * @param estadoActual representa el otro objeto o el mismo en diferente lapso de tiempo
	 * @return Retorna verdadero si encuentra diferencias y falso en caso contrario
	 */
	public DiffEstadoObjeto(estadoAnterior: any, estadoActual: any): boolean {
		// en el caso de que las estructuras sean diferentes devuelve true
		if (this.TamanoAproximadoObjeto(estadoAnterior) !== this.TamanoAproximadoObjeto(estadoActual)) {
			return true;
		}
		// si las estructuras son iguales devuelve falso
		return false;
	};

	// Métodos privados

	/**
	 * Método que establece la fecha y hora base para el reloj
	 * @param fecha Dato de la fecha y hora recibido desde el servidor
	 */
	private CreateInicioReloj(fecha: any): void {
		// Se covierte el valor numérico en fecha
		let _fecha = null;

		try {
			// Dato de fecha
			_fecha = (fecha) ? new Date(fecha) : new Date();
		}
		catch (error) {
			// Dato de fecha
			_fecha = new Date();
		}

		// Se asigna a la variable observable un intervalo que cada segundo sume 1 segundo a la fecha y hora
		this.reloj = observableInterval(1000).pipe(map(tick => new Date(_fecha.setSeconds(_fecha.getSeconds() + 1))), share());
	};

	/**
	 *  Método se encarga de comprobar si un objeto contiene una propiedad pasada por parámetro
	 * @param objeto representa un objeto javascript
	 * @param propiedad representa nombre de la propiedad de un objeto
	 * @return true or false
	 */
	public Exist(objeto: any, propiedad: string): boolean {
		// si la propiedad existe en el objeto devuelve true de lo contrario false
		return Object(objeto).hasOwnProperty(propiedad);
	};

	/**
	 * Método encargado de obtener el "peso" en bytes de un objeto
	 * @param object Objeto a "pesar"
	 * @returns {number} Retorna el tamaño aproximado del objeto en bytes
	 */
	public TamanoAproximadoObjeto(object: any): number {

		const objectList = [];
		// Se agrega la función a una variable
		const sumaUnicode = this.ObtenerSumaUnicodeCadena;

		const recurse = function (value) {
			let bytes = 0;

			if (typeof value === 'boolean') {
				bytes = 4;
			}
			else if (typeof value === 'string') {
				bytes = sumaUnicode(value);
			}
			else if (typeof value === 'number') {
				bytes = 8;
			}
			else if
				(
				typeof value === 'object'
				&& objectList.indexOf(value) === -1
			) {
				objectList[objectList.length] = value;

				for (const i in value) {
					bytes += 8; // an assumed existence overhead
					bytes += recurse(value[i])
				}
			}

			return bytes;
		}

		return recurse(object);
	};

	/**
	 * Función encargada de obtener la suma de los valores unicode de una cadena de texto
	 * @param str Cadena de texto a "pesar"
	 * @returns {number} Retorna la suma de los valores unicode
	 */
	public ObtenerSumaUnicodeCadena(str: string): number {
		// Contador
		let sum = 0;
		// Valida la cadena recibida; en caso de ser nula o indefinida se asigna como cadena vacia
		str = (str) ? str : '';
		// Ciclo que recorre la cadena de texto
		for (let i = 0; i < str.length; i++) {
			// Obtiene el caracter en su valor unicode y lo suma
			sum += str.charCodeAt(i);
		}
		// Retorna la suma
		return sum;
	};

	/**
	 * Función encargada de rellenar con ceros (0) a la izquierda del dígito
	 * @param value Indica el valor a agregar los ceros
	 * @param length Indica el tamaño máximo de la cadena
	 */
	public PadLeftZero(value: string, length: number): string {
		return (value.toString().length < length) ? this.PadLeftZero('0' + value, length) :
			value;
	};

	/**
	 * Función que se encarga de "convertir" carácteres extraños, tildes y "ñ" de una cadena de texto
	 * @see https://stackoverflow.com/a/37511463/9278088
	 * @param text Cadena de texto a limpiar
	 */
	public ClearString(text: any): string {
		// Valida que existan datos y sea una cadena de texto
		if (!text || !(typeof text === 'string' || text instanceof String)) { return null; }
		// Retorna el resultado
		return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	};

	/**
	 * Función se encarga de calcular la edad actual en años, meses y días y devolverla en formato de cadena de texto
	 * @param { Date | String } fechaNacimiento representa la fecha de nacimiento
	 * @param { Date | String } fechaHoraActual representa la fecha actual se recomienda utilizar la función ShowServidorNTP() para obtener el dato del servidor de aplicaciones
	 * @returns { String } edad actual en años, meses y días
	 */
	public CurrentAge(fechaNacimiento: any, fechaHoraActual: any): string {

		/** se valida que los datos no sean nulos */
		if (fechaNacimiento && fechaHoraActual) {

			/** representa la fecha de nacimiento en formato Date */
			let fechaInicial = moment(new Date(fechaNacimiento));

			/** se agrega la fecha actual  *** se recomienda utilizar la función ShowServidorNTP() para obtener el dato del servidor de aplicaciones */
			let fechaActual = moment(new Date(fechaHoraActual));

			/** representa el calculo de la cantidad de años con respecto a la fecha actual */
			let years = fechaActual.diff(fechaInicial, 'year');
			// se suman los años a la fecha inicial
			fechaInicial.add(years, 'years');

			/** representa el cálculo de la cantidad de meses con respecto a la fecha actual*/
			let months = fechaActual.diff(fechaInicial, 'months');
			// se suman los meses a la fecha inicial
			fechaInicial.add(months, 'months');

			/** representa la cantidad de días con respecto a la fecha actual */
			let days = fechaActual.diff(fechaInicial, 'days');

			/** se retorna la cadena de texto con la edad en años, meses y días */
			return years + ' años ' + months + ' meses ' + days + ' días';

		} else {
			return null;
		}
	};

	/**
	 * Método encargado de realizar el cambio de tema de la aplicación
	 */
	public GetTemaAplicacion(): string {
		// Se establece la variable del tema
		let temaDefault = 'light';
		// Se obtienen los datos del usuario de la conexión actual
		let usuarioActual = this.ListUsuarioLocal();

		// Valida si existe el tema en el localstorage
		if (usuarioActual.preferencias.temaApp) {
			temaDefault = usuarioActual.preferencias.temaApp;
		}

		// Se obtiene la preferencia del tema del usuario
		return (temaDefault === 'dark') ? 'ar-theme-dark arca-dark-theme' : 'ar-theme-light';
	};

	/**
	 * Evalua un valor para determinar si es falso o verdadero.
	 * @param value Valor a evaluar
	 * @description Puede aceptar los siguientes valores:
	 * 				- true / false
	 * 				- "true|TRUE" / "false|FALSE"
	 * 				- 1 / 0
	 * 				- "1" / "0"
	 * 				- "on|ON" / "off|OFF"
	 * 				- "yes|YES" / "no|NO"
	 * 				- Cualquier otro -> false
	 */
	public GetBoolean(value: any): boolean {
		switch (value) {
			case true:
			case 'true':
			case 'TRUE':
			case 1:
			case '1':
			case 'on':
			case 'ON':
			case 'yes':
			case 'YES':
				return true;
			default:
				return false;
		}
	};
}
