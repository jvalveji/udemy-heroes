// Definición typescript para el servicio HttpInterceptorRequestService v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (22-06-2020) Ing. Dagoberto Gómez Jiménez

import { Injectable, Injector } from '@angular/core';
import {
	HttpEvent,
	HttpHandler,
	HttpRequest,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

// Se importa el servicio de autorización
import { AutorizacionService } from './autorizacion.service';

/**
 * Servicio encargado de gestionar (interceptar) TODAS las operaciones REQUEST
 * dirigidas hacia el servidor
 */
@Injectable({ providedIn: 'root' })
export class HttpInterceptorRequestService implements HttpInterceptor {

	/**
     * Constructor de la clase
     * @param inj Variable que representa al servicio de Injectores de angular
     */
	constructor(private inj: Injector) { }

	/**
     * Método encargado de capturar TODAS las solicitudes enviadas hacia el servidor
     * @param req Parámetro que representa la solicitud hecha
     * @param next Parámetro que representa la interfaz que transforma la solictud en un observable
     * @returns Retorna el evento request generado por el usuario
     */
	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Variable que almacenara la solicitud que se enviara al servidor
		let HTTP_REQUEST = req;
		// Se hace una validación para revisar si el request es hacia un servcios que NO corresponde
		// a los servicios rest del arca; solo los del arca requieren el encabezado de autorización
		if (!req.headers.has('X-NoInterceptor')) {
			// Variable que accede al servicio de autorizaciones
			const AUTH = this.inj.get(AutorizacionService);
			// Obtiene el JWT desde el servicio de autorización
			const AUTH_HEADER = AUTH.ShowToken();
			// Valida si existe el token (en caso contrario deja el valor del request default)
			if (AUTH_HEADER) {
				// Se clona la solicitud y se le agrega a los headers el token de autorización y se habilita
				// el uso de credenciales (esto para el manejo de cookies que permitira refrescar tokens)
				HTTP_REQUEST = req.clone({ headers: req.headers.set('Authorization', AUTH_HEADER), withCredentials: true });
			}
		}

		// Se continua el flujo del proceso con el request
		return next.handle(HTTP_REQUEST);
	};
}
