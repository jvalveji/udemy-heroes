// Definición typescript para el componente UnidadesProgramaticasInicioSesionComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Se importan los componentes a utilizar
import { AutocompleteComponent } from './../../../shared/controls/autocomplete/autocomplete.component';

// Se importan los servicios a utilizar
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { UnidadesProgramaticasService } from './../unidades-programaticas/unidades-programaticas.service';
import { AplicacionesService } from './../aplicaciones/aplicaciones.service';
import { UnidadesProgramaticasInicioSesionService } from './unidades-programaticas-inicio-sesion.service';

// Se importan las interfaces a utilizar
import { IUnidadProgramaticaInicioSesion } from '../interfaces/unidad-programatica-inicio-sesion';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_unidades_programaticas_inicio_sesion'])
/**
 * Componente que permite crear la definición de las unidades progrmaticas que
 * pueden iniciar sesión en la aplicación
 */
@Component({
	selector: 'arca-unidades-programaticas-inicio-sesion',
	templateUrl: './unidades-programaticas-inicio-sesion.component.html',
	styleUrls: ['./unidades-programaticas-inicio-sesion.component.scss']
})
export class UnidadesProgramaticasInicioSesionComponent implements OnInit {
	/**
	* Se "instancia" el componente de autocompletar (en el html) para accederlo
	*/
	@ViewChild('unidadesProgramaticasAutoComplete') unidadesProgramaticasAutoComplete: AutocompleteComponent;
	/**
	   * Variable para la barra de progreso
	   */
	public esCargando = false;
	/**
	 * Variable que representa el catálogo de unidades programáticas
	 */
	public tiposUnidadesProgramaticas: any;
	/**
	 * Variable que representa el catálogo de aplicaciones Arca
	 */
	public tiposAplicacionesArca: any;
	/**
	   * Bandera que habilia o deshabilita el modo de edición
	   */
	public esEditar = false;
	/**
	   * Bandera que habilita o deshabilita la sección de los grupos
	   */
	public esGrupoActivo = false;
	/**
	 * Variable que indica el id de la aplicación seleccionada
	 */
	public appSeleccionada: any;
	/**
	 * Variable que almacena de forma temporal los items que se agregan a la aplicación Arca
	 */
	public tempUnidadesProgramaticas: any;
	/**
	 * Variable que contiene el item seleccionado del autocompletar de unidades programáticas
	 */
	public upSeleccionada: any;

	/**
	   * Constructor de la clase
	   * @param _location Parametro que representa el servicio de localización de rutas
	   * @param msgBox Representa el servicio para las ventanas de dialogo
	   * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param unidadesProgramaticasService Representa servicio de unidades programáticas
	 * @param aplicacionesService Representa servicio de aplicaciones arca
	 * @param unidadesProgramaticasInicioSesionService Representa servicio de unidades programáticas que están
	 * autorizadas a inciar sesión en la aplicación
	   */
	constructor(
		private _location: Location,
		private msgBox: DialogService,
		private snackBar: MatSnackBar,
		private unidadesProgramaticasService: UnidadesProgramaticasService,
		private aplicacionesService: AplicacionesService,
		private unidadesProgramaticasInicioSesionService: UnidadesProgramaticasInicioSesionService
	) { }

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
	 * mostrar el grupo seleccionado por el usuario.
	 * @param {any} item Representa la aplicación seleccionada
	   */
	public MostrarDetallesGrupo(item: any): void {
		this.appSeleccionada = item;
		this.esEditar = true;
		this.esGrupoActivo = true;
		this.tempUnidadesProgramaticas = [];
		// Obtiene las unidades programáticas de inicio sesión para la app
		this.ObtenerCatalogoUnidadesProgramaticasInicioSesion(item._id);
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
	 * Método encargado de establecer el valor seleccionado por el usuario para
	 * la unidad programatica
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public SeleccionarUnidadProgramatica(item: any): void {
		// Asigan el valor a la variable general
		this.upSeleccionada = item;
	};

	/**
	 * Método encargado de agregar la unidad programática seleccionada a la colección
	 */
	public AgregarUP(): void {
		// Se valida que NO exista la UP en el arreglo
		if (!this.ValidarExistenciaUnidadProgramatica()) {
			// Se establecen los datos a guardar
			const datos: IUnidadProgramaticaInicioSesion = {
				aplicacion_id: this.appSeleccionada._id,
				unidadProgramatica_id: this.upSeleccionada._id,
				estado: true
			};
			// Inicia la barra de progreso
			this.esCargando = true;
			// Se llama a la función del servicio que envia los datos al server
			this.unidadesProgramaticasInicioSesionService.Create(datos).then(
				res => {
					// Oculta la barra de progreso una vez obtenida la respuesta
					this.esCargando = false;
					// Recibe la respuesta
					if (res.exito) {
						// Muestra el mensaje de error
						this.snackBar.open('El proceso se ha realizado satisfactoriamente.', null, {
							duration: 5000
						});
						// Se cambia el ID de la unidad programática por el objeto completo de unidad programatica
						res.data.unidadProgramatica_id = this.upSeleccionada;
						// Se inserta en el arreglo la nueva unidad incluida
						this.tempUnidadesProgramaticas.unshift(res.data);
						// Se limpia el combo de unidades programáticas
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
		}
	};

	/**
   * Método encargado de eliminar el documento de unidad programática inicio sesión
   * @param {string} id Indica el id del documento a eliminar
   * @param {number} index Indica el indice en el arreglo
   */
	public EliminarUP(id: string, index: number): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.unidadesProgramaticasInicioSesionService.Delete(id).then(
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
					this.tempUnidadesProgramaticas.splice(index, 1);
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

	/**
	   * Método en cargado de obtener el catálogo de unidades programaticas
	   */
	private ObtenerCatalogoUnidadesProgramaticas(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.unidadesProgramaticasService.List().then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Se asigna los datos a la variable para mostrar la lista de ítems.
					this.tiposUnidadesProgramaticas = res.data;
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
	 * Método en cargado de obtener el catálogo de unidades programaticas que
	 * pueden iniciar sesión en la aplicación
	 * @param id Id de la aplicación arca
	 */
	private ObtenerCatalogoUnidadesProgramaticasInicioSesion(id: string): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.unidadesProgramaticasInicioSesionService.ShowByIdAplicacion(id).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Se asigna los datos a la variable para mostrar la lista de ítems.
					this.tempUnidadesProgramaticas = res.data;
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
	 * Método encargado de validar si existe una unidad programática dentro del arreglo de unidades
	 * por aplicación
	 */
	private ValidarExistenciaUnidadProgramatica(): boolean {
		// Se validan condiciones iniciales
		if (!this.upSeleccionada) { return true; } // Error por no seleccionar una UP del combo
		if (this.tempUnidadesProgramaticas.length === 0) { return false; }
		// Se recorre el arreglo de unidades de la aplicación
		return this.tempUnidadesProgramaticas.some(unidad => {
			// valida si existe el elemento
			if (unidad.unidadProgramatica_id._id === this.upSeleccionada._id) {
				// Retorna verdadero y sale del ciclo
				return true;
			}
		});
	};

	/**
	 * Método encargado de limpiar los datos del formulario
	 */
	private Limpiar() {
		this.upSeleccionada = null;
		this.unidadesProgramaticasAutoComplete.Reset();
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit(): void {
		// Obtiene los catálogos
		this.ObtenerCatalogoAplicacionesArca();
		this.ObtenerCatalogoUnidadesProgramaticas();
	};
}
