// Definición typescript para el componente EspecialidadesEditarComponent v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Yendri González Sánchez <yvgonzals@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Se importan los servicios a utilizar
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { EspecialidadesService } from './especialidades.service';
import { ServiciosService } from '../servicios/servicios.service';
import { UtilidadesService } from './../../../shared/services/utilidades.service';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_especialidades'])
/**
 * Componente destinado al despligue y manejo del catálogo de especialidades
 */
@Component({
	selector: 'arca-especialidades',
	templateUrl: './especialidades-editar.component.html',
	styleUrls: ['./especialidades-editar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class EspecialidadesEditarComponent implements OnInit {
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que almacena los datos obtenidos de los catálogos
	 */
	public catalogo: any = [];
	/**
	 * Variable que contiene el filtro del texto a buscar en la lista
	 */
	public txtFiltro: string;
	/**
	 * Representa el item catálogo
	 */
	public item: {
		_id: String;
		idSIAH: number;
		idServicioSIAH: number;
		servicio_id: any;
		codigo: String;
		descripcion: String;
		estado: Boolean;
	} = {
			_id: '',
			idSIAH: 0,
			idServicioSIAH: 0,
			servicio_id: null,
			codigo: null,
			descripcion: '',
			estado: true
		};
	/**
	 * Representa bandera para indicar si el formulario se encuetra en edición
	 */
	public esEdicion = false;
	/**
	 * Representa el objeto en estado inicial antes de que el usuario manipule sus atributos
	 */
	public estadoInicial: any = null;
	/**
	 * Variable que almacena los datos para provincias
	 */
	public servicios: any = [];
	/**
	 * Variable que representa el servicio seleccionado por el usuario
	 */
	public servicioSeleccionado: any;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param EspecialidadesService Variable que representa a los servicios de las especialidades del core base
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 */
	constructor(private _location: Location,
		private catalogoService: EspecialidadesService,
		private serviciosService: ServiciosService,
		private msgBox: DialogService,
		private utilidadesService: UtilidadesService,
		private snackBar: MatSnackBar) { }

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior
	 */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	/**
	 * Método encargado de enviar los datos del catalogo al servidor para ser actualizados
	 */
	public ActualizarCatalogo(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.Update(this.item).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de éxito
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});
					this.estadoInicial = JSON.parse(JSON.stringify(this.catalogo));
				} else {
					// Muestra el mensaje de 404
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.snackBar.open(err.error.message, null, { duration: 5000 });
				}
			}
		);
	}

	/**
	 * Método en cargado de obtener los especialidades por id de servicio
	 * @param idServicio representa el objectId del servicio asociado
	 */
	public ObtenerEspecialidadesByServicio(data: any): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.ShowEspecialidadesByServicio(data).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.catalogo = res.data;
				// se almacena el estado inicial de la estructura
				this.estadoInicial = JSON.parse(JSON.stringify(this.catalogo));
			}
			else {
				// Muestra el mensaje de que no se encontraron registros asociados
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
	 * Método en cargado de obtener las servicios
	 */
	private ObtenerServicios(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.serviciosService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.servicios = res.data;
			}
			else {
				// Muestra el mensaje de que no se encontraron registros
				this.msgBox.open('ERROR', '', res.mensaje);
			}

		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
		});
	};

	/**
	 * Método encargado de limpiar el item
	 */
	public LimpiarItem() {
		this.item = null;
		this.item = {
			_id: '',
			idSIAH: 0,
			idServicioSIAH: 0,
			servicio_id: null,
			codigo: null,
			descripcion: '',
			estado: true
		};
	}

	/**
	 * Método encargado de capturar el item actual
	 * @param item representa el item seleccionado por el usuario
	 */
	public CapturarItem(item: any) {
		if (
			this.utilidadesService.DiffEstadoObjeto(this.estadoInicial, this.catalogo)
		) {
			this.ActualizarCatalogo();
		} else {
			this.item = item;
		}
	}

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Carga el catálogo de especialidades
		this.ObtenerServicios();
	};
}
