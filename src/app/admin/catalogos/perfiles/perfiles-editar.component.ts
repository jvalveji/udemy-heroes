// Definición typescript para el componente PerfilesEditarComponent v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';

// Se importan los servicios a utilizar
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { AutorizacionService } from './../../../shared/services/autorizacion.service';
import { PerfilesService } from './perfiles.service';
import { AplicacionesService } from '../aplicaciones/aplicaciones.service';
import { UtilidadesService } from './../../../shared/services/utilidades.service';

// Se importan las interfaces a utilizar
import { IPerfil } from '../interfaces/perfil';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_perfiles'])
/**
 * Componente destinado al despligue y manejo del catálogo de perfiles de usuario por aplicación
 */
@Component({
	selector: 'arca-perfiles-editar',
	templateUrl: './perfiles-editar.component.html',
	styleUrls: ['./perfiles-editar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class PerfilesEditarComponent implements OnInit {
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando: boolean;
	/**
	 * Variables que almacenan los datos obtenidos del catálogo de aplicaciones
	 */
	public aplicaciones: any;
	/**
	 * Variables que almacenan los datos obtenidos del catálogo de perfiles por aplicación
	 */
	public perfiles: any;
	/**
	 * Variable que almacena la aplicación actual seleccionada
	 */
	private appActual: any;
	/**
	 * Variable que representa el formulario
	 */
	public frmPerfiles: FormGroup;
	/**
	 * Variable que indica si el tab de perfiles esta activo/inactivo
	 */
	public estadoTabPerfiles = false;
	/**
	 * Variable que indica si el usuario es administrador
	 */
	public esAdministrador: boolean;
	/**
	 * Variable que indica el texto de búsqueda del catálogo
	 */
	public txtFiltro: any = null;
	/**
	 * Variable para indicar si se esta en modo edición
	 */
	public esEdicion: true;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param aplicacionesService Variable que representa a los servicios de aplicaciones arca del core base
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param fb Representa un objeto de tipo FormBuilder
	 * @param auth Representa el servicio de autorización
	 * @param perfilesService Representa el servicio de perfiles del catálogo general
	 * @param utils Representa el servicio de utilidades
	 */
	constructor(private _location: Location,
		private aplicacionesService: AplicacionesService,
		private perfilesService: PerfilesService,
		private msgBox: DialogService,
		private snackBar: MatSnackBar,
		private fb: FormBuilder,
		private auth: AutorizacionService,
		private utils: UtilidadesService) {
		// Asigna los controles al objeto formulario
		this.frmPerfiles = this.fb.group({
			'_id': [null],
			'idPerfil': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'nombre': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'descripcion': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'estado': [{ value: true }]
		});
		// Inicializa el indice y la bandera de estado
		this.estadoTabPerfiles = false;
		this.esAdministrador = false;
		this.perfiles = [];
	}

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior
	 */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	/**
   * Método encargado de gestionar el cambio de tab
   * @param event Evento cambio de tab
   */
	public CambiarVistaTab(event: MatTabChangeEvent): void {
		// Valida si el tab seleccionado es el inicial
		if (event.index === 0) {
			this.estadoTabPerfiles = false;
		}
	};

	/**
	 * Método encragado de limpiar el formulario
	 */
	public Limpiar(): void {
		// Limpia el formulario
		this.frmPerfiles.reset({ _id: null, estado: true });
	};

	/**
	 * Método encargado de agregar un nuevo item al catálogo
	 */
	public AgregarPerfil(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se declara una variable de tipo interfaz (perfil)
		const perfil: IPerfil = {
			aplicacion_id: this.appActual._id,
			idPerfil: this.frmPerfiles.controls.idPerfil.value,
			nombre: this.frmPerfiles.controls.nombre.value,
			descripcion: this.frmPerfiles.controls.descripcion.value,
			estado: true,
			esLocal: true
		};
		// Se llama a la función del servicio que envia los datos al server
		this.perfilesService.Create(perfil).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
				// Almacena el dato recien agregado al arreglo que muestra la info al usuario
				this.perfiles.push(res.data);
				// Limpiar formulario para agregar nuevo items
				this.Limpiar();
			}
			else {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
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
	 * Método encargado de actualizar el item en el catálogo
	 * @param item Representa el item a actualizar
	 */
	public ActualizarPerfil(item: IPerfil): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.perfilesService.Update(item).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
			}
			else {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
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
	 * Método encargado de eliminar el item en el catálogo
	 * @param item Representa el item a eliminar
	 * @param index Representa la posicion en el arreglo
	 */
	public EliminarItem(item: IPerfil, index: number): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.perfilesService.Update(item).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
				// Elimina el item del arreglo
				this.perfiles.splice(index, 1);
			}
			else {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
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
	 * Método en cargado de obtener las perfiles de la aplicación
	 * @param item Indica la aplicación de la cuál se obtendran los perfiles
	 */
	public ObtenerPerfiles(item: any): void {
		// Limpia el arreglo de perfiles
		this.perfiles = [];
		// Asigna el nombre de la aplicación a una variable
		this.appActual = item;
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.perfilesService.ShowByAplicacion(this.appActual._id).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.perfiles = res.data;
				// Muestra el tab de perfiles
				this.estadoTabPerfiles = true;
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
				this.aplicaciones = res.data;
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
	 * Método encargado de verificar si el usuario actual es administrador para esta aplicación
	 */
	private ValidarPerfilAdministrador(): void {
		// Invoca el servicio encargado de validar el perfil
		this.esAdministrador = this.auth.ValidateByNombrePermiso(['administracion']);
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit(): void {
		// Carga el catálogo de aplicaciones arca
		this.ObtenerAplicaciones();
		// Validar perfil administrador
		this.ValidarPerfilAdministrador();
	};
}
