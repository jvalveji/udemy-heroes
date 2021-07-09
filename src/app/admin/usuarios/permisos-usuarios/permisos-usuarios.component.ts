// Definición typescript para el componente PermisosUsuariosComponent v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { environment } from 'environments/environment';
import { Component, OnInit, OnDestroy, ViewEncapsulation, AfterContentInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Se importan los servicios a utilizar
import { StorageService } from './../../../shared/services/storage.service';
import { PermisosUsuariosService } from './permisos-usuarios.service';
import { UtilidadesService } from './../../../shared/services/utilidades.service';
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { PermisosService } from './../../catalogos/permisos/permisos.service';
import { AplicacionesService } from './../../catalogos/aplicaciones/aplicaciones.service';
import { UnidadesProgramaticasService } from './../../catalogos/unidades-programaticas/unidades-programaticas.service';

// Se importan las interfaces a utilizar
import { IPermiso } from './../../catalogos/interfaces/permiso';
import { IPermisoUsuario } from './../../catalogos/interfaces/permiso-usuario';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_permisos_usuarios'])
/**
 * Componente destinado al despligue y manejo de los permisos de usuario en la aplicación
 */
@Component({
	selector: 'arca-permisos-usuarios',
	templateUrl: './permisos-usuarios.component.html',
	styleUrls: ['./permisos-usuarios.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	providers: [PermisosUsuariosService, UtilidadesService],
})
export class PermisosUsuariosComponent implements OnInit, OnDestroy, AfterContentInit {
	/**
	 * Variable que almacena los datos del id de usuario y persona
	 */
	public datosUsuario: any;
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que almacena los datos de las aplicaciones disponibles del Arca - MEAN
	 */
	public arcaAplicaciones: any;
	/**
	 * Variable que almacena los datos de las unidades programáticas disponibles del Arca - MEAN
	 */
	public arcaUnidadesProgramaticas: any;
	/**
	 * Variable que contendran la información de los permisos de forma temporal (los que se modifican)
	 */
	public permisosTemporal: any;
	/**
	 * Variable que indica la aplicación que fue seleccionada
	 */
	public appSeleccionada: any;
	/**
	 * Variable que indica la unidad programática que fue seleccionada
	 */
	public upSeleccionada: any;
	/**
	 * Variable que indica la lista de permisos que sos agregados del perfil del usuario
	 */
	private permisosAgregados: any;
	/**
	 * Variable que indica la lista de permisos que sos eliminados del perfil del usuario
	 */
	private permisosEliminados: any;
	/**
	 * Variable que indica si se permite cambiar la aplicación o no
	 */
	public esEditarAplicacionUP: boolean;
	/**
	 * Variable que indica si se permite cambiar la unidad programática o no
	 */
	public estadoPanelAplicacionUP: boolean;
	/**
	 * Variable que muestra/oculta el panel de permisos de usuario
	 */
	public esPanelListaPermisos: boolean;
	/**
	 * Variable que indica si se muestra o no los controles de edición de permisos
	 */
	public esModoEditarPermisos: boolean;
	/**
	 * Variable que indica si se procede a importar un perfil de un usuario o no
	 */
	public esImportarUsuario: boolean;
	/**
	 * Variable que indica si el usuario actual posee o no un perfil administrador
	 */
	public esAdministrador: boolean;
	/**
	 * Variable que contiene los permisos chequeados para el usuario seleccionado
	 */
	public permisosSeleccionados: Array<IPermiso>;
	/**
	 * Variable que contiene los permisos que se muestran en el resumen inicial
	 */
	public permisosActualesUsuarioVista: Array<IPermiso>;
	/**
	 * Variable que contiene los permisos actuales basado en el catálogo de permisos- usuario
	 */
	private permisosActualesUsuarioCatalogo: Array<IPermisoUsuario>;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param storage Representa el servicio de almacenamiento temporal entre componentes
	 * @param utils Representa el servicio de utilidades
	 * @param permisosUsuariosService Representa a los servicios para los permisos asignados al usuario
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param coreService Variable que representa a los servicios del core base
	 * @param unidadesProgramaticasService Variable que representa los servicios de la unidades programaticas
	 * @param permisosService Variable que representa los servicios para permisos del catálogo general
	 */
	constructor(private _location: Location,
		private storage: StorageService,
		private utils: UtilidadesService,
		private permisosUsuariosService: PermisosUsuariosService,
		private snackBar: MatSnackBar,
		private msgBox: DialogService,
		private aplicacionesService: AplicacionesService,
		private unidadesProgramaticasService: UnidadesProgramaticasService,
		private permisosService: PermisosService) {
		// Inicializa variables
		this.permisosTemporal = [];
		this.permisosEliminados = [];
		this.permisosAgregados = [];
		this.esAdministrador = false;
		this.esEditarAplicacionUP = false;
		this.estadoPanelAplicacionUP = false;
		this.esModoEditarPermisos = false;
		this.esImportarUsuario = false;
		this.permisosActualesUsuarioVista = [];
		this.permisosActualesUsuarioCatalogo = [];
		this.permisosSeleccionados = [];
	}

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior
	 */
	public IrPaginaAnterior(): void {
		// Se verifica si existen datos sin guardar antes de abandonar
		if (this.EsDatosModificados()) {
			// Mensaje a mostrar
			let mensaje = '¿Desea abandonar sin confirmar los cambios?<br>';
			mensaje += '<sub>* Para confirmar de clic en el candado abierto.</sub>';
			// Muestra el mensaje de confirmación
			this.msgBox.open('QUESTION', 'Datos sin confirmar', mensaje)
				.subscribe(res => {
					// Valida la respuesta
					if (res === 'YES') {
						// Retorna a la página anterior
						this._location.back();
					}
				});
		}
		else {
			// Retorna a la página anterior
			this._location.back();
		}
	};

	/**
	 * Método encargado de realizar la acción de editar el perfil para el usuario
	 * @param estado Indicador si es TRUE (es editar) / FALSE (cierra formulario)
	 */
	public AccionEditarPermisos(estado: boolean): void {
		// Valida el estado
		if (estado) {
			this.esModoEditarPermisos = true;
			this.esEditarAplicacionUP = true;
			this.esPanelListaPermisos = true;
		}
		else {
			// Valida si existen datos sin almacenar
			if (this.EsDatosModificados()) {
				// Llama al método de guardar
				this.Guardar();
			}
			else {
				this.esModoEditarPermisos = false;
				this.esEditarAplicacionUP = false;
				this.esPanelListaPermisos = false;
			}
		}
	};

	/**
	 * Método encargado de seleccionar una aplicación de la lista
	 * @param item Representa la aplicación seleccionada
	 */
	public SeleccionarAplicacion(item: any): void {
		// Valida si existen datos sin almacenar
		if (this.EsDatosModificados()) {
			// Valida si esta seleccionado otra aplicación diferente a la actual
			if (this.appSeleccionada !== item) {
				// Llama al método de guardar
				this.Guardar();
			}
		}

		// Asigna los datos del item seleccionado a la variable que muestra la información en el panel de aplicaciones
		this.appSeleccionada = item;
		// Se realiza la consulta que obtiene los permisos asociados a la aplicación seleccionada
		this.ObtenerPermisosPorAplicacion(item._id);
		// Valida si tambien se ha seleccionado la unidad programática
		if (this.upSeleccionada) {
			// Colpasa el panel
			this.estadoPanelAplicacionUP = false;
			// Obtiene los permisos actuales del usuario seleccionado
			this.ObtenerPermisosUsuarioSeleccionado();
		}
	};

	/**
	 * Método encargado de seleccionar la unidad programática de la lista
	 * @param item Representa la aplicación seleccionada
	 */
	public SeleccionarUnidadProgramatica(item: any): void {
		// Valida si existen datos sin almacenar
		if (this.EsDatosModificados()) {
			// Valida si esta seleccionado otra unidad programática diferente a la actual
			if (this.upSeleccionada !== item) {
				// Llama al método de guardar
				this.Guardar();
			}
		}

		// Asigna los datos del item seleccionado a la variable que muestra la información en el panel de aplicaciones
		this.upSeleccionada = item;

		// Obtiene los permisos actuales del usuario seleccionado
		this.ObtenerPermisosUsuarioSeleccionado();

		// Colpasa el panel
		this.estadoPanelAplicacionUP = false;
	};

	/**
	 * Método encargado de guardar los datos modificados en el formulario
	 */
	public Guardar(): void {
		// Inicia la barra de progreso
		this.esCargando = true;

		// Variable que contiene los datos del perfil para actualizar
		const datos = {
			usuario_id: this.datosUsuario.usuario.id,
			aplicacion_id: this.appSeleccionada._id,
			unidadProgramatica_id: this.upSeleccionada._id,
			permisos: {
				agregados: this.permisosAgregados,
				eliminados: this.permisosEliminados
			}
		};

		// Se llama a la función del servicio que envia los datos al server
		this.permisosUsuariosService.UpdateByUsuarioYUnidadProgramatica(datos).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});

				// Recarga los datos del usuario
				this.ObtenerPermisosUsuarioSeleccionado();
				// Limpia todo despues de actualizar/insertar datos
				this.esModoEditarPermisos = false;
				this.esEditarAplicacionUP = false;
				this.esPanelListaPermisos = false;
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error', res.mensaje);
				// .subscribe(res => alert(res));
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			// .subscribe(res => alert(res));
		});
	};

	// Métodos privados

	/**
	 * Método en cargado de obtener las aplicaciones arca disponibles
	 */
	private ObtenerAplicaciones(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.aplicacionesService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos obtenidos
				this.arcaAplicaciones = res.data;
				// De las aplicaciones obtenidas se selecciona por default la que
				// pertenece a la aplicación actual
				this.arcaAplicaciones.some(app => {
					// Se valida la aplicación actual
					if (app.idApp === environment.aplicativo) {
						// Se asigna como aplicación default a la actual
						this.appSeleccionada = app;
						// sale del bucle
						return true;
					}
				});
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error', res.mensaje);
				// .subscribe(res => alert(res));
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método en cargado de obtener las aplicaciones arca disponibles
	 */
	private ObtenerUnidadesProgramaticas(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.unidadesProgramaticasService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Obtiene los datos del usuario local
				const usuarioLocal = this.utils.ListUsuarioLocal();
				// Asigna los datos obtenidos
				this.arcaUnidadesProgramaticas = res.data;
				// De las unidades obtenidas se selecciona por default la que
				// pertenece a la unidad actual
				this.arcaUnidadesProgramaticas.some(up => {
					// Se valida la aplicación actual
					if (up._id === usuarioLocal.unidadProgramatica_id) {
						// Se asigna como aplicación default a la actual
						this.upSeleccionada = up;
						// sale del bucle
						return true;
					}
				});
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error', res.mensaje);
				// .subscribe(res => alert(res));
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método encargado de obtener los permisos por aplicación
	 * @param app_id Id de la aplicación
	 */
	private ObtenerPermisosPorAplicacion(app_id: string): void {
		// Limpia la variable que maneja los permisos
		this.permisosTemporal = [];
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.permisosService.ShowByIdAplicacion(app_id).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos obtenidos del servicio
				if (res.data && res.data.length > 0) {
					// Se modifican los datos para poder mapearlos en el autocompletar
					this.permisosTemporal = res.data;
				}
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error', res.mensaje);
				// .subscribe(res => alert(res));
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método que se encarga de validar el permiso del usuario actual y determinar si puede
	 * asignar permisos más allá de la aplicación actual y la unidad programática actual
	 */
	private ValidarPermisosUsuarioActual(): void {
		// Muestra la barra de progreso una vez obtenida la respuesta
		this.esCargando = true;
		// Obtiene los datos del usuario local
		const usuarioLocal = this.utils.ListUsuarioLocal();
		// Obtiene los datos para el perfil administrador de sistemas
		this.permisosUsuariosService.ValidarPermisoUsuarioPorNombre(usuarioLocal.aplicacion_id,
			usuarioLocal.unidadProgramatica_id,
			usuarioLocal.usuario_id,
			'adm_usuarios').then((res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Asigna la respuesta TRUE/FALSE (DAGOBERTO)
				this.esAdministrador = res.exito;
			}, (err) => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
				// .subscribe(res => alert(res));
			});
	};

	/**
	 * Método encargado de obtener los datos del perfil del usuario seleccionado
	 * para editar; estos permisos son por aplicación y la unidad programática
	 */
	private ObtenerPermisosUsuarioSeleccionado(): void {
		// Limpia arreglos
		this.permisosActualesUsuarioVista = [];
		this.permisosActualesUsuarioCatalogo = [];
		this.permisosSeleccionados = [];
		// Oculta el panel de permisos (checkbox)
		this.esPanelListaPermisos = false;

		// Inicia la barra de progreso
		this.esCargando = true;
		// Se obtiene los datos del usuario
		// Se establecen los parámetros de la consulta
		const filtro = {
			usuario: this.datosUsuario.usuario.id, // Usuario seleccionado
			up: this.upSeleccionada._id, // Up seleccionada
			app: this.appSeleccionada._id// Aplicación seleccionada
		};

		// Se llama a la función del servicio que envia los datos al server
		this.permisosUsuariosService.ListByUsuarioAplicacionUnidadProgramatica(filtro).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Muestra el panel de permisos (checkbox)
			this.esPanelListaPermisos = true;
			// Recibe la respuesta
			if (res.exito) {
				// Valida si hay permisos actualmente para el usuario
				if (res.data.length > 0) {
					// Recorre los permisos recibidos
					res.data.forEach(permiso => {
						// Recorre el arrglo de permisos de la aplicación
						this.permisosTemporal.some((temp, _index) => {
							if (temp._id === permiso.permiso_id) {
								// Asigna el permiso al arreglo de permisos actuales
								this.permisosActualesUsuarioVista.push(temp); // Vista
								this.permisosActualesUsuarioCatalogo.push(permiso);
								// Si existe se selecciona en la vista
								this.permisosSeleccionados.push(permiso.permiso_id);
								return true;
							}
						});
					});
				}
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error', res.mensaje);
				// .subscribe(res => alert(res));
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método encargado de validar si hay modificaciones en los datos
	 * @returns Retonar un valor booleano indicando si hubo cambios o no
	 */
	private EsDatosModificados(): boolean {
		// Se crea un arreglo con solo los id de los permisos para poder compararlo
		const _permisosActuales = this.permisosActualesUsuarioCatalogo.map(_permiso => {
			return _permiso.permiso_id;
		});

		// Valida si hay diferencias entre los permisos seleccionados y los actuales
		if (this.utils.DiffEstadoObjeto(_permisosActuales, this.permisosSeleccionados)) {
			// Limpia arreglos
			this.permisosAgregados = [];
			this.permisosEliminados = [];
			// Recorre los seleccionados para agregalos al arreglo
			this.permisosSeleccionados.forEach(_permiso => {
				// Recorre los permisos actuales del usuario y busca si el seleccionado NO existe
				if (!this.permisosActualesUsuarioCatalogo.some(_actual => _actual.permiso_id === _permiso)) {
					// Como NO existe el seleccionado entre los actuales lo agrega al arreglo
					this.permisosAgregados.push(_permiso);
				}
			});

			// Recorre los actuales para agregarlos al arreglo
			this.permisosActualesUsuarioCatalogo.forEach(_actual => {
				// Recorre los permisos seleccionados y busca si el actual NO existe
				if (!this.permisosSeleccionados.some(_permiso => _permiso === _actual.permiso_id)) {
					// Como NO existe se agrega el ID del documento asociado al permiso del usuario
					this.permisosEliminados.push(_actual._id);
				}
			});

			return true;
		}
		return false;
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Obtiene los datos enviados desde el componente de listar
		this.datosUsuario = this.storage._storage();
		// Se carga la lista de aplicaciones del arca
		this.ObtenerAplicaciones();
		// Se carga la lista de unidades programaticas
		this.ObtenerUnidadesProgramaticas();
		// Se valida el los permisos del usuario actual
		this.ValidarPermisosUsuarioActual();
		// Obtiene los datos del usuario local
		const usuarioLocal = this.utils.ListUsuarioLocal();
		// Se obtiene los permisos por la aplicación
		this.ObtenerPermisosPorAplicacion(usuarioLocal.aplicacion_id);
	};

	/**
	 * Método que se invoca una vez que la vista ya encuentra cargada
	 */
	public ngAfterContentInit() {
		// Se establece un "retardo" en la ejecución de la función para
		// dar chance a que cargue visualmente los checkbox
		setTimeout(() => {
			// Obtiene los permisos actuales del usuario seleccionado
			this.ObtenerPermisosUsuarioSeleccionado();
		}, 2500);
	};

	/**
	 * Método de finalización del componente
	 */
	public ngOnDestroy() {
		// Elimina los datos del almacenamiento temporal
		this.storage.eliminar();
	};
}
