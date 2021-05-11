// Definición typescript para el componente DistritosEditarComponent v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Yendri González Sánchez <yvgonzals@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Se importan los servicios a utilizar
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { DistritosService } from './distritos.service';
import { CantonesService } from '../cantones/cantones.service';
import { ProvinciasService } from '../provincias/provincias.service';
import { UtilidadesService } from './../../../shared/services/utilidades.service';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_distritos'])
/**
 * Componente destinado al despligue y manejo del catálogo de distritos
 */
@Component({
	selector: 'arca-distritos',
	templateUrl: './distritos-editar.component.html',
	styleUrls: ['./distritos-editar.component.scss']
})
export class DistritosEditarComponent implements OnInit {
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que almacena los datos obtenidos de los catálogos
	 */
	public catalogo: any = [];
	/**
	 * ariable que contiene el filtro del texto a buscar en la lista
	 */
	public txtFiltro: string;
	/**
	 * Representa el item catálogo
	 */
	public item: {
		_id: String;
		idSIAH: String;
		idCantonSIAH: String;
		idCanton: any;
		codigo: String;
		descripcion: String;
		estado: Boolean;
	} = {
			_id: '',
			idSIAH: '',
			idCantonSIAH: '',
			idCanton: '',
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
	public provincias: any = [];
	/**
	 * Variable que representa la provincia seleccionada por el usuario
	 */
	public provinciaSeleccionada: any;
	/**
	 * Variable que almacena los datos para cantones
	 */
	public cantones: any = [];
	/**
	 * Variable que representa el canton seleccionado por el usuario
	 */
	public cantonSeleccionado: any;
	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param distritosService Variable que representa a los servicios de distritos del core base
	 * @param cantonesService Variable que representa a los servicios de cantones del core base
	 * @param provinciasService Variable que representa a los servicios de provincias del core base
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 */
	constructor(private _location: Location,
		private catalogoService: DistritosService,
		private cantonesService: CantonesService,
		private provinciasService: ProvinciasService,
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
	 * Método en cargado de obtener los distritos
	 * @param idCanton representa el identificador del canton elegido por el usuario
	 */
	public ObtenerDistritoByCanton(data: any): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.ShowDistritoByCanton(data).then((res) => {
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
		});
	};

	/**
	   * Método en cargado de obtener los cantones por provincia
	   * @param idProvincia representa el id de la provincia asociada
	   */
	public ObtenerCantonByProvincia(data: any): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.cantonesService.ShowCantonByProvincia(data).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.cantones = res.data;
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'No se encontraron datos', res.mensaje);
			}

		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
		});
	};

	// Métodos privados

	/**
	 * Método en cargado de obtener las provincias
	 */
	private ObtenerProvincias(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.provinciasService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.provincias = res.data;
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
			idSIAH: '',
			idCantonSIAH: '',
			idCanton: '',
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
		// Carga el catálogo de provincias
		this.ObtenerProvincias();
	};
}
