// Definición typescript para el componente PathsEditarComponent v6.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';

// Se importan los servicios a utilizar
import { cloneDeep } from 'lodash';
import { PathsService } from './paths.service';
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { AutorizacionService } from './../../../shared/services/autorizacion.service';
import { AplicacionesService } from '../aplicaciones/aplicaciones.service';
import { UtilidadesService } from './../../../shared/services/utilidades.service';

// Se importan las interfaces a utilizar
import { IPath } from '../interfaces/path';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_paths'])
/**
 * Componente destinado al despligue y manejo del catálogo de perfiles de usuario por aplicación
 */
@Component({
	selector: 'arca-paths-editar',
	templateUrl: './paths-editar.component.html',
	styleUrls: ['./paths-editar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class PathsEditarComponent implements OnInit {
	/**
   * Variable para mostrar/ocultar la barra de progreso
   */
	public esCargando = false;
	/**
   * Variable que almacena los datos del catálogo de aplicaciones
   */
	public aplicaciones: any;
	/**
   * Variable que almacena los datos del catálogo de paths por aplicación
   */
	public paths: any;
	/**
   * Variable que representa el formulario
   */
	public frmPaths: FormGroup;
	/**
   * Variable que representa el indice del arreglo que se esta editando
   */
	public indice: number;
	/**
   * Variable que indica si los datos han sido editados
   */
	public esEditado: boolean;
	/**
   * Variable que indica el estado del tab
   */
	public estadoTabPaths: boolean;
	/**
   * Variable que indica si el usuario es administrador
   */
	public esAdministrador: boolean;
	/**
   * Variable para controlar el campo de filtro
   */
	public txtFiltro: string;

	/**
   * Constructor de la clase
   * @param _location Parametro que representa el servicio de localización de rutas
   * @param pathsService Variable que representa a los servicios del para paths
   * @param aplicacionesService Variable que representa a los servicios de aplicaciones arca del core base
   * @param msgBox Representa el servicio para las ventanas de dialogo
   * @param snackBar Representa el componente snackBar para mostrar mensajes
   * @param fb Representa un objeto de tipo FormBuilder
   * @param auth Representa el servicio de autorización
   * @param utils Representa el servicio de utilidades
   */
	constructor(private _location: Location,
		private pathsService: PathsService,
		private aplicacionesService: AplicacionesService,
		private msgBox: DialogService,
		private snackBar: MatSnackBar,
		private fb: FormBuilder,
		private auth: AutorizacionService,
		private utils: UtilidadesService) {
		// Asigna los controles al objeto formulario
		this.frmPaths = this.fb.group({
			'_id': [null],
			'idPath': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'nombre': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'path': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'descripcion': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'icono': ['', Validators.compose([Validators.minLength(3)])],
			'estado': [{ value: true }]
		});

		// Inicializa el indice y la bandera de estado
		this.indice = null;
		this.esEditado = false;
		this.estadoTabPaths = false;
		this.esAdministrador = false;
	}
	/**
   * Variable que almacena la aplicación actual seleccionada
   */
	private appActual: string;
	/**
   * Variable que representa los paths originales
   */
	private pathsOriginal: any;

	// Métodos públicos

	/**
   * Método encargado de redirigir al usuario a la vista anterior
   */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	}

	/**
   * Método encargado de gestionar el cambio de tab
   * @param event Evento cambio de tab
   */
	public CambiarVistaTab(event: MatTabChangeEvent): void {
		// Valida si el tab seleccionado es el inicial
		if (event.index === 0) {
			// deshabilita el botón de guardar
			this.esEditado = false;
			this.estadoTabPaths = false;
		}
	}

	/**
   * Método encragado de limpiar el formulario
   */
	public Limpiar(): void {
		// Limpia el formulario
		this.frmPaths.reset({ _id: null, estado: true });
		// Limpia el indice del item (esto cuando es modo edición)
		this.indice = null;
	}

	/**
   * Método encargado de agregar un nuevo item al arreglo items del catálogo
   */
	public AgregarItem(): void {
		// Se declara una variable de tipo interfaz (path)
		const path: IPath = {
			idPath: this.frmPaths.controls.idPath.value,
			nombre: this.frmPaths.controls.nombre.value,
			path: this.frmPaths.controls.path.value,
			descripcion: this.frmPaths.controls.descripcion.value,
			icono: (this.frmPaths.controls.icono.value) ? this.frmPaths.controls.icono.value : 'mdi-set-center',
			estado: true
		};

		// Valida si posee el dato del identificador(_id) para agregarlo
		if (this.frmPaths.controls._id.value) { path['_id'] = this.frmPaths.controls._id.value; }

		// Valida si el arreglo no posee items para inicializarlo
		if (!this.paths) { this.paths = { aplicacion_id: this.appActual, items: [] }; }
		// Valida si se esta en modo editar
		if (this.indice !== null) {
			// Edita el valor
			this.paths[this.indice] = path;
			// Indica que ya no se esta editando
			this.indice = null;
		}
		else {
			// Agrega una nueva unidad de medida
			this.paths.unshift(path); // Primero
			// this.paths.push(unidad); // Último
		}
		// Limpia el formulario
		this.frmPaths.reset({ _id: null, estado: true });
		// Indica en la bandera que hubo un cambio
		this.esEditado = true;
	}

	/**
   * Método encargado de validar si un item ha sido editado
   */
	public EsEditarItem(): void {
		// Valida si el item actual es diferente al item inicial (lo cual indica un cambio)
		this.esEditado = this.utils.DiffEstadoObjeto(this.pathsOriginal, this.paths);
	}

	/**
   * Método encargado de eliminar un item
   * @param _index Indice del item en el arreglo
   */
	public ActualizarEstadoItem(_index: number): void {
		// Obtiene el estado del item
		const estado = this.paths[_index].estado;
		// Edita el valor
		this.paths[_index].estado = estado ? false : true;
		// Indica en la bandera que hubo un cambio
		this.esEditado = true;
	}

	/**
   * Método encargado de eliminar un item
   * @param _index Indice del item en el arreglo
   */
	public EliminarItem(_index: number): void {
		// Elimina el item del arrgelo
		this.paths.splice(_index, 1);
		// Indica en la bandera que hubo un cambio
		this.esEditado = true;
	}

	/**
   * Método en cargado de obtener los paths de la aplicación
   * @param id Indica el id de la aplicación de la cuál se obtendran los paths
   */
	public ObtenerPaths(id: any): void {
		// Limpia el arreglo de paths
		this.paths = null;
		// Asigan el nombre de la aplicación a una variable
		this.appActual = id;
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.pathsService.ListPathsByAplicacion(id).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.paths = (res.data) ? res.data[0] : null;
				// Se crea el path original la primera vez
				this.pathsOriginal = cloneDeep(this.paths);
				// Muestra el tab de paths
				this.estadoTabPaths = true;
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
	}

	/**
   * Método en cargado de actualizar/incluir los paths por aplicación
   */
	public Guardar(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.pathsService.UpdateByPaths(this.paths.aplicacion_id, this.paths).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Establece el path actual como el original para las validaciones
				this.pathsOriginal = cloneDeep(this.paths);
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
				// Indica el estado de la bandera
				this.esEditado = false;
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
	}

	/**
   * Método inicial del componente
   */
	public ngOnInit() {
		// Carga el catálogo de aplicaciones arca
		this.ObtenerAplicaciones();
		// Validar perfil administrador
		this.ValidarPerfilAdministrador();
	}

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
				this.aplicaciones = res.data[0];
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
	}

	/**
   * Método encargado de verificar si el usuario actual es administrador para esta aplicación
   */
	private ValidarPerfilAdministrador(): void {
		// Invoca el servicio encargado de validar el perfil
		this.esAdministrador = this.auth.ValidateByNombrePermiso(['administracion']);
	}
}
