// Definición typescript para el servicio AutorizacionService v7.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (08-07-2020) Ing. Dagoberto Gómez Jiménez

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { environment } from 'environments/environment'; // variables de ambiente (desarrollo/producción)
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Se importa los servicios a utilizar
import { UtilidadesService } from './utilidades.service';
import { StorageService } from './storage.service';
import { PathsService } from './../../admin/catalogos/paths/paths.service';
import { PerfilesService } from './../../admin/catalogos/perfiles/perfiles.service';
import { AplicacionesService } from './../..//admin/catalogos/aplicaciones/aplicaciones.service';
import { PermisosUsuariosService } from './../../admin/usuarios/permisos-usuarios/permisos-usuarios.service';

// Se importan las interfaces a utilizar
import { IHttpResponse } from '../interfaces/http-response';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { ELEMENTO_ACTIVO } from '../decorators/activate.decorator';

/**
 * Servicio encargado de gestionar los accesos del usuario dentro de la aplicación.
 */
@Injectable({ providedIn: 'root' })
export class AutorizacionService implements CanActivate, CanActivateChild {
	/**
     * Url del servicio api a consumir por el servicio
     */
	private apiUrl = environment.urlApi.main;  // URL web API

	/**
     * Constructor de la clase
     * @param router Parámetro que representa las rutas de la aplicación
     * @param http Representa el servicio HTTP
     * @param util Representa el servicio de utilidades
     * @param storage Representa el servicio de alamcenamiento temporal
     * @param aplicacionesService Representa el servicio de aplicaciones arca del catálogo
     * @param pathsService Representa el servicio para paths
     * @param perfilesService Representa el servicio de perfiles del catálogo
     * @param permisosUsuariosService Representa el servicio de permisos de usuario
     */
	constructor(private router: Router,
		private http: HttpClient,
		private util: UtilidadesService,
		private storage: StorageService,
		private aplicacionesService: AplicacionesService,
		private pathsService: PathsService,
		private perfilesService: PerfilesService,
		private permisosUsuariosService: PermisosUsuariosService) { }

	// Métodos públicos

	/**
     * Método que se encarga de establecer si activa/desactiva el acceso a la ruta donde
     * se consulte dependiendo de la sesión actual del usuario (JWT)
     * @param route Indica la ruta que se esta consultando
     * @param state Indica el estado de la ruta
     * @returns Retorna verdadero / falso según datos del JWT
     */
	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		// Valida si existe un componente o si se esta enviando por medio de la definición de rutas datos para el manejo de permisos
		if (route.component || route.data) {
			// Obtiene los permisos para el componente
			const permisos = route.component[ELEMENTO_ACTIVO];
			// Valida si existen
			if (permisos) {
				if (!this.ValidateByNombrePermiso(permisos)) {
					// Navega a la página sin autorización
					this.router.navigate(['/bitzu/not-authorized']);
					// Retorna falso
					return false;
				}
			}
		}

		// Se valida si la ruta se quiere consumir enviando como parámetro un token válido
		if (route.queryParams['key']) {
			// Si el token existe lo establece en el local storage para que el interceptor
			// lo envie en la consulta
			this.UpdateToken(route.queryParams['key']);
		}

		// Se valida si existe el token localmente
		if (this.ShowToken()) {
			// La ruta (path definido en los archivos de rutas) se puede obtener de: state.url
			// Valida que sea cualquier ruta menos CORE (core y /core son diferentes a /core/)
			if (state.url.indexOf('/core/') === -1) {
				// Se valida que el token sea es válido contra el servidor
				this.ValidateToken().then(resp => {
					// Si existe retorna verdadero
					return true;
				}).catch(err => {
					// Valida si el error corresponde a una renovación de credenciales para obviarlo (true)
					// (408 = Request Timeout)
					return (err.status === 408) ? true : false;
				});
			}
			// Si existe retorna verdadero
			return true;
		}
		else {
			// Si no se encuentra logueado lo envia a la ventana de logueo
			this.router.navigate(['/bitzu/login']);
			// Retorna falso
			return false;
		}
	};

	/**
     * Método que se encarga de establecer si activa/desactiva el acceso a la ruta HIJA donde
     * se consulte dependiendo de la sesión actual del usuario (JWT)
     * @param route Indica la ruta HIJA que se esta consultando
     * @param state Indica el estado de la ruta
     * @returns Retorna verdadero / falso según datos del JWT
     */
	public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		// Invoca la función de rutas
		return this.canActivate(route, state);
	};

	/**
     * Método encargado de establecer los datos del inicio de sesión en el almacenamiento interno
     * @param data Parámetro que contiene los datos (tokek, datos del usuario, etc)
     */
	public LogIn(data: any): void {
		// Establece el token enviado por el servidor
		this.UpdateToken(data.token);
		// Establece los datos del usuarios
		this.util.UpdateUsuarioLocal(data.usuario);
	};

	/**
     * Método que se encarga de eliminar los datos de la sesión actual
     */
	public LogOut(): void {
		// Eliminar el token
		this.DeleteToken();
		// Elimina los datos del usuario
		this.util.RemoveUsuarioLocal();
		// Elimina los datos de los parámetros
		this.util.RemoveParametrosLocal();
		// Elimina la cookie con el token de renovación (si existiese)
		this.util.RemoveCookie('arca-key-renew');
		// Elimina los datos del servicio de storage (si existiesen)
		this.storage.eliminar();
		// Al salir destruye las cookies de Pentaho en el navegador
		this.util.RemoveCookie('JSESSIONID');
		this.util.RemoveCookie('server-time');
		this.util.RemoveCookie('session-expiry');
		this.util.RemoveCookie('session-flushed');
		this.util.RemoveCookie('client-time-offset');
		// Elimina el dato de los mensajes de error (si existiese)
		localStorage.removeItem('arca-httpErrorResponse');
	};

	/**
     * Método que retorna el valor del token establecido en el almacenamiento local
     * @returns Cadena de caracteres que representa el JWT almacenado para el usuario
     */
	public ShowToken(): string {
		// Se trata de obtener la información de la cookie que contiene el token de renovación (si existiese)
		const COOKIE = this.util.ShowCookie('arca-key-renew');
		// Se valida si existe una cookie asociada a un token de renovación
		if (COOKIE) {
			// Se establece el nuevo token
			this.UpdateToken(COOKIE);
			// Se elimina la cookie
			this.util.RemoveCookie('arca-key-renew');
		}
		// Retorna el token establecido localmente
		return localStorage.getItem('arca-key') || null;
	};

	/**
    * Método encargado de validar si el usuario tiene permisos para la aplicación indicada
    * @param app Nombre de la aplicación
    * @returns Indica verdadero o falso según criterio de búsqueda
    */
	public ValidateByNombreAplicacion(app: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			// Obtiene los datos del usuario en el local storage
			const usuario = this.util.ListUsuarioLocal();
			// Valida si hay datos para el usuario actual en el local storage
			if (!usuario) {
				// Retorna falso
				resolve(false);
			}
			else {
				// Se llama a la función del servicio que envia los datos al server
				this.aplicacionesService.ShowAplicacionByNombre(app).then((res) => {
					// Recibe la respuesta
					if (res.exito && res.data) {
						// Retorna la validación
						resolve(usuario.aplicacion_id === res.data._id);
					}
					else {
						// Retorna falso
						resolve(false);
					}

				}, (err) => {
					// Retorna falso
					resolve(false);
				});
			}
		});
	};

	/**
    * Método encargado de validar si el usuario tiene permisos para el perfil indicado
    * @param perfil Nombre del perfil
    * @returns Indica verdadero o falso según criterio de búsqueda
    */
	public ValidateByNombrePerfil(perfil: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			// Obtiene los datos del usuario en el local storage
			const usuario = this.util.ListUsuarioLocal();
			// Valida si hay datos para el usuario actual en el local storage
			if (!usuario || usuario.permisos.length === 0) {
				// Retorna falso
				resolve(false);
			}
			else {
				// Se llama a la función del servicio que envia los datos al server
				this.perfilesService.ShowByNombre(usuario.aplicacion_id, perfil).then((res) => {
					// Recibe la respuesta
					if (res.exito && res.data) {
						// Recorre el arreglo y valida si existe el valor indicado
						const valor = usuario.permisos.some(_perfil => _perfil.perfil_id === res.data._id);
						// Retorna la validación
						resolve(valor);
					}
					else {
						// Retorna falso
						resolve(false);
					}

				}, (err) => {
					// Retorna falso
					resolve(false);
				});
			}
		});
	};

	/**
     * Método encargado de validar si el usuario tiene permisos para el path indicado
     * @param path Nombre del path
     * @returns Indica verdadero o falso según criterio de búsqueda
     */
	public ValidateByNombrePath(path: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			// Obtiene los datos del usuario en el local storage
			const usuario = this.util.ListUsuarioLocal();
			// Valida si hay datos para el usuario actual en el local storage
			if (!usuario || usuario.permisos.length === 0) {
				// Retorna falso
				resolve(false);
			}
			else {
				// Se llama a la función del servicio que envia los datos al server
				this.pathsService.ShowPathByNombre(usuario.aplicacion_id, path).then((res) => {
					// Recibe la respuesta
					if (res.exito && res.data) {
						// Recorre el arreglo y recorre los perfiles que tenga el usuario
						const valor = usuario.permisos.some(_perfil => {
							// Recorre el arreglo de paths del perfil y valida si existe el path indicado
							return _perfil.paths.some(_path => _path === res.data._id);
						});
						// Retorna la validación
						resolve(valor);
					}
					else {
						// Retorna falso
						resolve(false);
					}

				}, (err) => {
					// Retorna falso
					resolve(false);
				});
			}
		});
	};

	// /**
	// * Método encargado de validar si el usuario tiene permisos
	// * @param permiso Nombre del permiso
	// * @returns Indica verdadero o falso según criterio de búsqueda
	// */
	// public ValidateByNombrePermiso(permiso: string): Promise<boolean> {
	// 	return new Promise((resolve, reject) => {
	// 		// Obtiene los datos del usuario en el local storage
	// 		const usuarioLocal = this.util.ListUsuarioLocal();
	// 		// Valida si hay datos para el usuario actual en el local storage
	// 		if (!usuarioLocal || usuarioLocal.permisos.length === 0) {
	// 			// Retorna falso
	// 			resolve(false);
	// 		}
	// 		else {
	// 			// Se llama a la función del servicio que envia los datos al server
	// 			this.permisosUsuariosService.ValidarPermisoUsuarioPorNombre(usuarioLocal.aplicacion_id,
	// 				usuarioLocal.unidadProgramatica_id,
	// 				usuarioLocal.usuario_id,
	// 				permiso).then((res) => {
	// 					// Retorna la validación
	// 					resolve(res.exito);
	// 				}, (err) => {
	// 					// Retorna falso
	// 					resolve(false);
	// 				});
	// 		}
	// 	});
	// };

	/**
    * Método encargado de validar si el usuario tiene permisos
    * @param permisos Lista de permisos
    * @returns Indica verdadero o falso según criterio de búsqueda
    */
	public ValidateByNombrePermiso(permisos: string[]): boolean {
		// Obtiene los datos del usuario en el local storage
		const usuarioLocal = this.util.ListUsuarioLocal();
		// Valida si hay datos para el usuario actual en el local storage
		if (!usuarioLocal || !usuarioLocal.permisos || usuarioLocal.permisos.length === 0) {
			// Retorna falso
			return false;
		}
		else {
			// Recorre el arreglo de permisos indicados para validar cada uno
			return usuarioLocal.permisos.some(_permiso => {
				// Recorre los permisos del local storage y valida si el permiso existe
				if (permisos.some((_permisolocal, index) => {
					// Si existe el permiso retorna verdadero
					if (_permisolocal === _permiso.nombre) {
						// Sale del búcle
						return true;
					}
				})) {
					// Retorna verdadero
					return true;
				}
			});
		}
	};

	/**
    * Método encargado de validar si el usuario tiene permisos para el id de perfil indicado
    * @param idPerfil Id del perfil
    * @returns Indica verdadero o falso según criterio de búsqueda
    */
	public ValidateByIdPerfil(idPerfil: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			// Obtiene los datos del usuario en el local storage
			const usuario = this.util.ListUsuarioLocal();
			// Valida si hay datos para el usuario actual en el local storage
			if (!usuario || usuario.permisos.length === 0) {
				// Retorna falso
				resolve(false);
			}
			else {
				// Recorre el arreglo y valida si existe el valor indicado
				const valor = usuario.permisos.some(_perfil => _perfil.perfil_id === idPerfil);
				// Retorna la validación
				resolve(valor);
			}
		});
	};

	// Métodos privados

	/**
     * Método que establece el valor del token en el almacenamiento local
     * @param key Parámetro que representa el JWT que se almacera localmente
     */
	private UpdateToken(key: string): void {
		localStorage.setItem('arca-key', key);
	};

	/**
     * Método que elimina el token del almacenamiento local
     */
	private DeleteToken(): void {
		localStorage.removeItem('arca-key');
	};

	/**
   * Método que obtiene la información de la fecha y hora del servidor de aplicaciones
   * @returns Retorna un objeto de tipo IHttpResponse con el dato de la fecha y hora actual del servidor
   * de aplicaciones
   */
	private ValidateToken(): Promise<IHttpResponse> {
		// Url completa del servicio
		const URL = this.apiUrl + '/autorizacion';
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
