// Definición typescript para el componente PermisosEditarComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Se importan los servicios a utilizar
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { AplicacionesService } from '../aplicaciones/aplicaciones.service';
import { PermisosService } from './permisos.service';

// Se importan las interfaces a utilizar
import { IPermiso } from '../interfaces/permiso';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_permisos'])
/**
 * Componente que permite crear la definición de los permisos por aplicación
 */
@Component({
	selector: 'arca-permisos-editar',
	templateUrl: './permisos-editar.component.html',
	styleUrls: ['./permisos-editar.component.scss']
})
export class PermisosEditarComponent implements OnInit {
	/**
   * Variable que representa el formulario
   */
	public frmPermisos: FormGroup;
	/**
	   * Variable para la barra de progreso
	   */
	public esCargando = false;
	/**
	 * Variable que representa el catálogo de permisos
	 */
	public tiposPermisos: any;
	/**
	 * Variable que representa el catálogo de aplicaciones Arca
	 */
	public tiposAplicacionesArca: any;
	/**
	   * Bandera que habilia o deshabilita el modo de edición
	   */
	public esEditar: boolean;
	/**
	   * Bandera que habilita o deshabilita la sección de los grPermisoos
	   */
	public esGrupoActivo: boolean;
	/**
	 * Variable que indica el id de la aplicación seleccionada
	 */
	public appSeleccionada: any;
	/**
	 * Variable que almacena de forma temporal los items que se agregan a la aplicación Arca
	 */
	public tempPermisos: any;
	/**
	 * Variable que contiene el item seleccionado del autocompletar de permisos
	 */
	public permisoSeleccionado: any;

	/**
	   * Constructor de la clase
	   * @param fb Representa un objeto de tipo FormBuilder
	   * @param _location Parametro que representa el servicio de localización de rutas
	   * @param msgBox Representa el servicio para las ventanas de dialogo
	   * @param snackBar Representa el componente snackBar para mostrar mensajes
	   * @param aplicacionesService Representa servicio de aplicaciones arca
	   * @param PermisosService Representa servicio de permisos
	   */
	constructor(
		private fb: FormBuilder,
		private _location: Location,
		private msgBox: DialogService,
		private snackBar: MatSnackBar,
		private aplicacionesService: AplicacionesService,
		private permisosService: PermisosService
	) {
		// Asigna los controles al objeto formulario
		this.frmPermisos = this.fb.group({
			idPermiso: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			nombre: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			descripcion: ['', Validators.minLength(3)],
			esLocal: true,
			estado: true
		});

		this.esGrupoActivo = false;
		this.esEditar = false;
	}

	// Métodos públicos

	/**
	   * Método encargado de redirigir al usuario a la vista anterior y comprueba si el usuario modifico atributos
	   */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	/**
	   * Método encargado de habilitar las banderas necesarias para
	 * mostrar el grPermisoo seleccionado por el usuario.
	 * @param {any} item Representa la aplicación seleccionada
	   */
	public MostrarDetallesGrupo(item: any): void {
		this.appSeleccionada = item;
		this.esEditar = true;
		this.esGrupoActivo = true;
		this.tempPermisos = [];
		// Obtiene las permisos de inicio sesión para la app
		this.ObtenerCatalogoPermisosAplicacion(item._id);
	};

	/**
	   * Método encargado de deshabilitar las banderas necesarias para desaparecer
	 * el formulario de edición y mostrar el listado
	   */
	public CerrarGrupo(): void {
		this.esGrupoActivo = false;
		this.esEditar = false;
	};

	/**
	 * Método encargado de establecer el valor seleccionado por el usuario para el permiso
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public SeleccionarPermiso(item: any): void {
		// Asigan el valor a la variable general
		this.permisoSeleccionado = item;
	};

	/**
	 * Método encargado de agregar la permiso seleccionada a la colección
	 */
	public AgregarPermiso(): void {
		// Se crea la interfaz con los datos a almacenar
		const datos: IPermiso = {
			aplicacion_id: this.appSeleccionada._id,
			idPermiso: this.frmPermisos.value.idPermiso,
			nombre: this.frmPermisos.value.nombre,
			descripcion: this.frmPermisos.value.descripcion,
			esLocal: true,
			estado: this.frmPermisos.value.estado
		};

		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.permisosService.Create(datos).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de error
					this.snackBar.open('El proceso se ha realizado satisfactoriamente.', null, {
						duration: 5000
					});
					// Se inserta en el arreglo el nueva permiso incluido
					this.tempPermisos.unshift(res.data);
					// Se limpia el combo de permisos
					this.Limpiar();
				} else {
					// Muestra el mensaje de error
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			}
		);

	};

	/**
   * Método encargado de eliminar el documento de permisos
   * @param {string} id Indica el id del documento a eliminar
   * @param {number} index Indica el indice en el arreglo
   */
	public EliminarPermiso(id: string, index: number): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.permisosService.Delete(id).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de error
					this.snackBar.open('El proceso se ha realizado satisfactoriamente.', null, {
						duration: 5000
					});
					/// Elimina el elemento
					this.tempPermisos.splice(index, 1);
				} else {
					// Muestra el mensaje de error
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			}
		);
	};

	// Métodos privados

	/**
	   * Método en cargado de obtener el catálogo de aplicaciones Arca
	   */
	private ObtenerCatalogoAplicacionesArca(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.aplicacionesService.List().then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Se asigna los datos a la variable para mostrar la lista de ítems.
					this.tiposAplicacionesArca = res.data;
				} else {
					// Muestra el mensaje de error
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			}
		);
	};

	// /**
	//    * Método en cargado de obtener el catálogo de permisos
	//    */
	// private ObtenerCatalogoPermisos(): void {
	// 	// Inicia la barra de progreso
	// 	this.esCargando = true;
	// 	// Se llama a la función del servicio que envia los datos al server
	// 	this.permisosService.List().then(
	// 		res => {
	// 			// Oculta la barra de progreso una vez obtenida la respuesta
	// 			this.esCargando = false;
	// 			// Recibe la respuesta
	// 			if (res.exito) {
	// 				// Se asigna los datos a la variable para mostrar la lista de ítems.
	// 				this.tiposPermisos = res.data;
	// 			} else {
	// 				// Muestra el mensaje de error
	// 				this.snackBar.open(res.mensaje, null, {
	// 					duration: 5000
	// 				});
	// 			}
	// 		},
	// 		err => {
	// 			// Oculta la barra de progreso en caso de error
	// 			this.esCargando = false;
	// 			// Muestra el mensaje con el error
	// 			if (err.error) this.msgBox.open('ERROR', 'Error de carga', err.error.message);
	// 		}
	// 	);
	// };

	/**
	 * Método en cargado de obtener el catálogo de permisos por aplicación
	 * @param id Id de la aplicación arca
	 */
	private ObtenerCatalogoPermisosAplicacion(id: string): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.permisosService.ShowByIdAplicacion(id).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Se asigna los datos a la variable para mostrar la lista de ítems.
					this.tempPermisos = res.data;
				} else {
					// Muestra el mensaje de error
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			}
		);
	};

	/**
	 * Método encargado de limpiar los datos del formulario
	 */
	private Limpiar() {
		this.permisoSeleccionado = null;
		this.frmPermisos.reset();
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit(): void {
		// Obtiene los catálogos
		this.ObtenerCatalogoAplicacionesArca();
		// this.ObtenerCatalogoPermisos();
	};
}
