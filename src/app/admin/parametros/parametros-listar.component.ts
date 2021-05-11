// Definición typescript para el componente ParametrosListarComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

// Se importan los servicios a utilizar
import { DialogService } from './../../shared/controls/dialog/dialog.service';
import { ParametrosService } from './parametros.service';
import { AutorizacionService } from './../../shared/services/autorizacion.service';
import { AplicacionesService } from '../catalogos/aplicaciones/aplicaciones.service';
import { UnidadesProgramaticasService } from '../catalogos/unidades-programaticas/unidades-programaticas.service';
import { StorageService } from './../../shared/services/storage.service';

// Se importan las interfaces a utilizar
import { IAplicacion } from '../catalogos/interfaces/aplicacion';
import { IUnidadProgramatica } from './../../shared/interfaces/unidad-programatica';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_parametros'])
/**
 * Componente destinado al despligue y manejo de los parámetros de la aplicación
 */
@Component({
	selector: 'arca-parametros-listar',
	templateUrl: './parametros-listar.component.html',
	styleUrls: ['./parametros-listar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class ParametrosListarComponent implements OnInit {

	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que almacena los datos obtenidos de los parámetros
	 */
	public listaParametros: any;
	public parametrosGlobales: any;
	public parametrosAplicacion: any;
	public parametrosUnidadProgramatica: any;
	/**
	 * Variable que contiene el filtro del texto a buscar en la lista
	 */
	public txtFiltro: string;

	public esBotonEditar: boolean;

	/**
	  * Variable que representa el catálogo de aplicaciones Arca
	  */
	public aplicacionesArca: any;

	public unidadesProgramaticas: any;
	/**
	 * Representa la aplicación seleccionada
	 */
	public aplicacionSeleccionada: IAplicacion;

	public upSeleccionada: IUnidadProgramatica;

	public tipoParametroSeleccionado: any;

	/**
   * Indicador para mostrar/ocultar el area de filtros
   */
	public esAreaFiltros: boolean;
	/**
	 * Indicador si el usuario actual es un administrador de sistema
	 */
	public esAdministrador: boolean;

	public esAreaSearch: boolean;

	public esFiltroUnidadesProgramaticas: boolean;

	public esFiltroAplicaciones: boolean;

	public tiposParametros = [
		{ id: 1, descripcion: 'Globales' },
		{ id: 2, descripcion: 'Por Aplicacion' },
		{ id: 3, descripcion: 'Por Unidad Programática' }
	];

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param auth Variable que representa los servicios de autorización
	 * @param parametrosService Variable que representa a los parametros del core base
	 * @param aplicacionesService Representa al servicio de aplicaciones arca
	 * @param unidadesProgramaticasService Representa al servicio de catalogo de unidades programáticas
	 * @param storage Representa el servicio de almacenamiento temporal entre componentes
	 * @param router Representa el módulo de ruteo
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 */
	constructor(private _location: Location,
		private auth: AutorizacionService,
		private parametrosService: ParametrosService,
		private aplicacionesService: AplicacionesService,
		private unidadesProgramaticasService: UnidadesProgramaticasService,
		private storage: StorageService,
		private router: Router,
		private msgBox: DialogService,
		private snackBar: MatSnackBar) {
		// Inicializa variables
		this.txtFiltro = null;
		this.esAreaSearch = true;
		this.esAreaFiltros = false;
		this.esFiltroAplicaciones = false
		this.esFiltroUnidadesProgramaticas = false;
		this.esBotonEditar = false;
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
	 * Método encargado de obtener los datos de los parámetros por tipo
	 * @param tipo Representa al tipo de parámetro seleccionado
	 */
	public ObtenerParametros(tipo: any): void {
		// Asigna el tipo de parámetro actual seleccionado
		this.tipoParametroSeleccionado = tipo;
		// Limpia la lista que se muestra al usuario
		this.listaParametros = [];
		// Se valida el tipo de parametro a obtener y si ya existen los datos en memoria local
		switch (this.tipoParametroSeleccionado.id) {
			case 1: // Globales
				// Deshabilita los filtros
				this.esAreaFiltros = false;
				this.esFiltroAplicaciones = false;
				this.esFiltroUnidadesProgramaticas = false;
				// Si ya existen en memoria se cargan a la variable que los muestra
				// En caso contrario se cargan la primera vez
				if (this.parametrosGlobales) {
					this.esBotonEditar = true;
					this.listaParametros = this.parametrosGlobales
				}
				else { this.ObtenerParametrosGlobales(); }
				break;

			case 2: // Por aplicación
				// Habilita el area de filtros
				this.esAreaFiltros = true;
				this.esFiltroAplicaciones = true;
				this.esFiltroUnidadesProgramaticas = false; // Deshabilita
				// Si ya existen en memoria se cargan a la variable que los muestra
				// En caso contrario se cargan la primera vez
				if (this.parametrosAplicacion) {
					this.esBotonEditar = true;
					this.listaParametros = this.parametrosAplicacion
				}
				else { this.VerificarFiltrosPorAplicacion(); }
				break;

			case 3: // Por unidad programática
				// Habilita el area de filtros
				this.esAreaFiltros = true;
				this.esFiltroAplicaciones = true;
				this.esFiltroUnidadesProgramaticas = true;
				// Si ya existen en memoria se cargan a la variable que los muestra
				// En caso contrario se cargan la primera vez
				if (this.parametrosAplicacion && this.parametrosUnidadProgramatica) {
					this.esBotonEditar = true;
					this.listaParametros = this.parametrosUnidadProgramatica
				}
				else { this.VerificarFiltrosPorUnidadProgramatica(); }
				break;
		};
	};

	/**
	 * Método encargado de llamar a la vista de edición de parámetros
	 * @param tipo Representa al tipo de parámetro seleccionado
	 */
	public EditarParametros(tipo: any): void {
		// Establece los datos a pasar al siguiente componente por medio de servicio temporal
		this.storage.storage([tipo, this.listaParametros, this.aplicacionSeleccionada, this.upSeleccionada]);
		// Lo envia a la ventana de logueo (envia el usuario como parámetro pero se oculta en la URL)
		this.router.navigate(['/bitzu/admin/parametros/editar']);
	};

	/**
	 * Método encargado de validar los filtros necesarios para obtener los datos por aplicación
	 */
	public VerificarFiltrosPorAplicacion(): void {
		// Limpia la lista que se muestra al usuario
		this.listaParametros = [];
		// Se valida que exista seleccionada una aplicación para ejecutar la consulta
		if (this.aplicacionSeleccionada && this.tipoParametroSeleccionado.id === 2) {
			this.ObtenerParametrosPorAplicacion();
		}
		else {
			this.esBotonEditar = false;
			// Muestra el mensaje para indicar al usuario que debe seleccionar una aplicación
			this.snackBar.open('Debe seleccionar una aplicación para cargar los datos.', null, {
				duration: 3000
			});
		}
	};

	/**
	 * Método encargado de validar los filtros necesarios para obtener los datos por unidad programatica
	 */
	public VerificarFiltrosPorUnidadProgramatica(): void {
		// Limpia la lista que se muestra al usuario
		this.listaParametros = [];
		// Se valida que exista seleccionada una aplicación para ejecutar la consulta
		if (this.aplicacionSeleccionada && this.upSeleccionada && this.tipoParametroSeleccionado.id === 3) {
			this.ObtenerParametrosPorUnidadProgramatica();
		}
		else {
			this.esBotonEditar = false;
			// Muestra el mensaje para indicar al usuario que debe seleccionar una aplicación y/o unidad programática
			this.snackBar.open('Debe seleccionar una aplicación y una unidad programática para cargar los datos.', null, {
				duration: 3000
			});
		}
	};

	// Métodos privados

	/**
	 * Método encargado de obtener la lista de aplicaciones Arca disponibles
	 */
	private ObtenerAplicacionesArca(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.aplicacionesService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.aplicacionesArca = res.data;
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
	 * Método encargado de obtener la lista de unidades programáticas
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
				// Asigna las unidades programáticas a la variable general
				this.unidadesProgramaticas = res.data;
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
	 * Método encargado de obtener los parámetros GLOBALES
	 */
	private ObtenerParametrosGlobales(): void {
		// Habilita el botón de editar
		this.esBotonEditar = true;
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.parametrosService.ListByGlobal().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Establece los datos obtenidos
				this.listaParametros = res.data;
				this.parametrosGlobales = res.data;
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
	 * Método encargado de obtener los parámetros POR APLICACION
	 */
	private ObtenerParametrosPorAplicacion(): void {
		// Habilita el botón de editar
		this.esBotonEditar = true;
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.parametrosService.ListByAplicacion(this.aplicacionSeleccionada._id).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Establece los datos obtenidos
				this.listaParametros = res.data;
				this.parametrosAplicacion = res.data;
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
	 * Método encargado de obtener los parámetros POR UNIDAD PROGRAMATICA
	 */
	private ObtenerParametrosPorUnidadProgramatica(): void {
		// Habilita el botón de editar
		this.esBotonEditar = true;
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.parametrosService.ListByUnidadProgramatica(this.aplicacionSeleccionada._id, this.upSeleccionada._id).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Establece los datos obtenidos
				this.listaParametros = res.data;
				this.parametrosUnidadProgramatica = res.data;
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
	 * Método inicial del componente
	 */
	public ngOnInit(): void {
		// Valida la respuesta
		if (this.auth.ValidateByNombrePermiso(['administracion'])) {
			this.esAdministrador = true;
			// Carga la lista de aplicaciones
			this.ObtenerAplicacionesArca();
			// Obtiene el catálogo de unidades programáticas
			this.ObtenerUnidadesProgramaticas();

		}
		// else {
		//   // Predefinir los filtros para el usuario actual (NO ADMINISTRADOR)
		//   this.PreFiltradoUsuarioNoAdministrador();
		// }
	};
}
