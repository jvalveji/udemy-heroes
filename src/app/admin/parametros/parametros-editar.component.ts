// Definición typescript para el componente ParametrosEditarComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Se importan los servicios a utilizar
import { DialogService } from './../../shared/controls/dialog/dialog.service';
import { ParametrosService } from './parametros.service';
import { StorageService } from './../../shared/services/storage.service';
import { UtilidadesService } from './../../shared/services/utilidades.service';

// Se importan las interfaces a utilizar
import { IAplicacion } from '../catalogos/interfaces/aplicacion';
import { IUnidadProgramatica } from './../../shared/interfaces/unidad-programatica';
import { IParametro } from '../catalogos/interfaces/parametro';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_parametros_editar'])
/**
 * Componente destinado al despligue y manejo de los parámetros de la aplicación
 */
@Component({
	selector: 'arca-parametros-editar',
	templateUrl: './parametros-editar.component.html',
	styleUrls: ['./parametros-editar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class ParametrosEditarComponent implements OnInit, OnDestroy {

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
	/**
	 * Variable que indica si el boton de guardar es activo o no
	 */
	public esBotonListo: boolean;


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

	public tiposParametros: any;

	public descripcionTipoParametro: string;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param utils Representa el servicio de utilidades
	 * @param parametrosService Variable que representa a los parametros del core base
	 * @param storage Representa el servicio de almacenamiento temporal entre componentes
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 */
	constructor(private _location: Location,
		private utils: UtilidadesService,
		private parametrosService: ParametrosService,
		private storage: StorageService,
		private msgBox: DialogService,
		private snackBar: MatSnackBar) {
		// Inicializa variables
		this.txtFiltro = null;
		this.esBotonListo = true;
		this.esAreaSearch = true;
		this.esAreaFiltros = false;
		this.esFiltroAplicaciones = false
		this.esFiltroUnidadesProgramaticas = false;
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
	 * Método encargado de rellenar con ceros a la izquierda un dígito
	 * @param valor Valor a rellenar
	 * @param tam Tamaño máximo de la cadena
	 * @returns Retorna una cadena con los ceros concatenados al valor indicado
	 */
	public RellenarConZeros(valor: string, tam: number): string {
		return this.utils.PadLeftZero(valor, tam);
	};

	/**
	 * Método encargado de agregar un item a la lista de parametro
	 */
	public AgregarParametro(): void {
		// Se crea una constante de tipo interfaz
		const parametro: IParametro = {
			nombre: '',
			valor: '',
			estado: true
		};
		// Valida el tipo de parametro para asignar los datos de aplicación y unidad programática
		if (this.tiposParametros.id === 2 || this.tiposParametros.id === 3) {
			// Asigna el id de la apliación
			parametro.aplicacion_id = this.aplicacionSeleccionada._id;
			if (this.tiposParametros.id === 3) {
				// Asigna el id de la unidad programática
				parametro.unidadProgramatica_id = this.upSeleccionada._id;
			}
		}
		// Se agrega la constante al arreglo
		this.listaParametros.unshift(parametro);
	};

	/**
	 * Método encargado de actualizar/insertar los datos de los parametros
	 */
	public Guardar(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.parametrosService.CreateUpdate(this.listaParametros).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 3000
				});
				// Retorna a la vista anterior
				this.IrPaginaAnterior();
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
	 * Método encargado de obtener los parámetros almacenados en el localstorage
	 */
	private ObtenerParametrosStorage(): void {
		// Obtiene los datos enviados desde el componente de listar
		const datos = this.storage._storage();
		// Valida que existan datos para consultar
		if (datos) {
			// Separa los datos en variables
			this.tiposParametros = datos[0];
			this.listaParametros = datos[1];
			this.aplicacionSeleccionada = datos[2];
			this.upSeleccionada = datos[3];
			// Se establece la descripción customizada a mostrar en el campo del tipo de parámetro
			this.descripcionTipoParametro = this.tiposParametros.descripcion;
			if (this.tiposParametros.id === 2 || this.tiposParametros.id === 3) {
				// Agrega el nombre de la aplicación seleccionada
				this.descripcionTipoParametro += ' [ ' + this.aplicacionSeleccionada.nombre;
				if (this.tiposParametros.id === 3) {
					// Agrega el nombre de la unidad programática seleccionaa
					this.descripcionTipoParametro += ' - ' + this.upSeleccionada.descripcion;
				}
				this.descripcionTipoParametro += ' ]';
			}
		}
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit(): void {
		// Obtiene los parametros almacenados en el storage
		this.ObtenerParametrosStorage();
	};

	/**
	 * Método de finalización del componente
	 */
	public ngOnDestroy(): void {
		// Elimina los datos del almacenamiento temporal
		this.storage.eliminar();
	};
}
