// Definición typescript para el servicio HttpInterceptorResponseService v3.0.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (16-07-2020) Ing. Dagoberto Gómez Jiménez

import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
	HttpEvent,
	HttpHandler,
	HttpRequest,
	HttpResponse,
	HttpErrorResponse,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Se importa el servicio de autorización
import { AutorizacionService } from './autorizacion.service';
import { DialogService } from '../controls/dialog/dialog.service';

/**
 * Servicio encargado de gestionar (interceptar) TODAS las operaciones RESPONSE
 * provenientes del servidor
 */
@Injectable({ providedIn: 'root' })
export class HttpInterceptorResponseService implements HttpInterceptor {

	/**
	 * Constructor de la clase
	 * @param inj Variable que representa al servicio de Injectores de angular
	 * @param router variable que maneja las rutas d ela aplicación
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 */
	constructor(private inj: Injector,
		private router: Router,
		private msgBox: DialogService) { }

	/**
	 * Método encargado de capturar TODAS las solicitudes recibidas desde el servidor
	 * @param req Parámetro que representa la solicitud recibida
	 * @param next Parámetro que representa la interfaz que transforma la solictud en un observable
	 * @returns Retorna el evento response generado desde el servidor
	 */
	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Variable que accede al servicio de autorizaciones
		const AUTH = this.inj.get(AutorizacionService);

		return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
			if (event instanceof HttpResponse) {
				// Response
				// Se obtiene la respuesta y se valida que:
				//  * Sea exitosa (200 y exito=true)
				//  * Que contenga el token para almacenarlo
				if (event.status === 200 && event.body.exito && event.body.data && event.body.data.token) {
					// Se establecen los datos de inicio de sesión de forma local
					AUTH.LogIn(event.body.data);
				}
			}
		}, ((err: any) => {
			if (err instanceof HttpErrorResponse) {
				// Valida si el error devuelto es del tipo:
				//  * Unauthorized(401) [Token inválido]
				//  * Forbidden(403) [Crendeciales vencidas = token vencido pero no se puede renovar]
				//  * Timeout(408) [Crendeciales vencidas] (NO DEBE HACER NADA YA QUE SE MANEJA LA COOKIE)
				//  * Conflict(409) [Crendeciales inválidas]
				if (err.status === 401 || err.status === 403 || err.status === 409) {
					// Valida si ya existe la bandera que indica que ya fue llamado una vez
					// la ventana que indica al usuario el error (cualquier error)
					if (!localStorage.getItem('arca-httpErrorResponse')) {
						// Como NO existe; se crea (solo una vez)
						localStorage.setItem('arca-httpErrorResponse', 'true');
					}
					else {
						// Debido a que ya existe una ventana de vencimiento de sesión
						// se envia al CATCH de los response una respuesta;
						// esto provocara un error a nivel de consola pero no se mostrará
						// al usuario ninguna ventana ADICIONAL. Una vez que el usuario acepte la ventana de
						// dialogo o refresque o cierre la pestaña/navegador se limpiará
						// automáticamente la consola
						next.handle(req);
					}

					// Se valida el tipo de mensaje a mostrar
					let MSG = null;
					switch (err.status) {
						case 401:
							MSG = 'Error';
							break;
						case 403:
							MSG = 'Vencimiento de sesión';
							break;
						case 409:
							MSG = 'Problema de credenciales';
							break;
					}
					// Muestra el mensaje con el error de validaicón del token
					this.msgBox.open('ERROR', MSG, err.error.mensaje)
						.subscribe(res => {
							// Limpia TODO antes de salir
							AUTH.LogOut();
							// Lo envia a la ventana de logueo
							this.router.navigate(['/bitzu/login']);
							// Limpia la consola
							console.clear();
						});
				}
			}
		})
		));
	};
}
