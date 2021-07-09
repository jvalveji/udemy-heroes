// Definición typescript para el componente ArticulosSigesSearchComponent v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Fabián Cascante Arce <fcascant@ccss.sa.cr>
// Modificado: (22-06-2020) Ing. Dagoberto Gómez Jiménez

import {
	Component,
	OnInit,
	ViewChild,
	Inject,
	Optional
} from '@angular/core';
import {
	FormGroup,
	Validators,
	FormBuilder
} from '@angular/forms';

import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import 'rxjs/operators/startWith';
import 'rxjs/operators/map';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Importa los servicios a utilizar en el módulo
import { ArticulosSigesSearchService } from './articulos-siges-search.service';
import { DialogService } from '../dialog/dialog.service';
import { ArticulosService } from './../../../admin/catalogos/articulos/articulos.service';

/**
 * Componente destinado al despligue y manejo de los artículos del SIGES en la aplicación
 */
@Component({
	selector: 'arca-articulos-siges-search',
	templateUrl: './articulos-siges-search.component.html',
	styleUrls: ['./articulos-siges-search.component.scss'],
	providers: [ArticulosSigesSearchService]
})
export class ArticulosSigesSearchComponent implements OnInit {
	/**
	 * Se "instancia" el componente de autocompletar (en el html) para accederlo (CLASES)
	 */
	@ViewChild('clasesAutoComplete') clasesAutoComplete: AutocompleteComponent;
	/**
	 * Se "instancia" el componente de autocompletar (en el html) para accederlo (SUBCLASES)
	 */
	@ViewChild('subClasesAutoComplete') subClasesAutoComplete: AutocompleteComponent;
	/**
	 * Se "instancia" el componente de autocompletar (en el html) para accederlo (GRUPOS)
	 */
	@ViewChild('gruposAutoComplete') gruposAutoComplete: AutocompleteComponent;
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable de estado para mostrar/ocultar el filtro
	 */
	public mostrarFiltroTexto = true;
	/**
	 * Variable de estado para indicar si la búsqueda del autocompletar se debe ejecutar
	 */
	public esEventoAutoCompletar = false;
	/**
	 * Variable que muestra/oculta el mensaje de búsqueda
	 */
	public mostrarInfoBusqueda = true;
	/**
	 * Variable que muestra/oculta el mensaje de error
	 */
	public mostrarInfoError = false;
	/**
	 * Variable que muestra/oculta el mensaje de datos no encontrados
	 */
	public mostrarInfoNoEncontrado = false;
	/**
	 * Variable que representa el formulario
	 */
	public frmArticulos: FormGroup;
	/**
	 *  Variable que contiene las clases obtenidas
	 */
	public catalogoClases: Array<any>;
	/**
	 * Variable que contiene las subClases obtenidas
	 */
	public catalogoSubClases: Array<any>;
	/**
	 * Variable que contiene los grupos obtenidos
	 */
	public catalogoGrupos: Array<any>;
	/**
	 * Variable tipo arraglo que contiene los artículos encontrados según los criterios de búsqueda.
	 */
	public articulosSIGES: Array<any>;
	/**
	 * Variable que almacena los datos del articulo seleccionado
	 */
	public itemSeleccionado: any;
	/**
	 * Variable que almacena los datos de la clase seleccionada
	 */
	public claseSeleccionado: any;
	/**
	 * Variable que almacena los datos de la subclase seleccionada
	 */
	public subClaseSeleccionado: any;
	/**
	 * Variable que almacena los datos del grupo seleccionado
	 */
	public grupoSeleccionado: any;
	/**
	 * Variable que contiene la descripción de la clase enviada desde otro componente.
	 */
	public idClaseSIGESDefault: null;
	/**
	 * Variable contiene el texto a buscar
	 */
	public txtFiltro: String;

	/**
	 * Constructor de la clase
	 * @param dataDialog Representa los datos que son enviados al componente desde otro componente
	 * @param ArticulosSigesSearchService Representa el servicio para artículos de SIGES.
	 * @param articulosService Representa el servicio para articulos de los catálgos del core.
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param fb Representa un objeto de tipo FormBuilder
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 */
	constructor(@Optional() @Inject(MAT_DIALOG_DATA) private dataDialog: any,
		private articulosSigesSearchService: ArticulosSigesSearchService,
		private articulosService: ArticulosService,
		public snackBar: MatSnackBar,
		private fb: FormBuilder,
		private msgBox: DialogService
	) {
		this.frmArticulos = this.fb.group({
			txtFiltro: [
				'',
				Validators.compose([Validators.required, Validators.minLength(3)])
			]
		});
		// Habilita el campo de texto de búsqueda
		this.mostrarFiltroTexto = true;
		this.itemSeleccionado = [];
		// Valida si existe datos default para el componente
		if (this.dataDialog) {
			// Si existe la clase se la asigna al valor default
			this.idClaseSIGESDefault = (this.dataDialog.clase) ? this.dataDialog.clase : null;
		}
	};

	/**
	 * Métodos públicos
	 */

	/**
	 * Método encargado de resetear el control
	 * (Este deberia ser accedido únicamente mediante el decorador @ViewChild)
	 */
	public Reset(): void {
		// Limpia todo
		this.Clear();
		// Maneja los mensaje de información
		this.mostrarInfoBusqueda = true;
		this.mostrarInfoError = false;
		this.mostrarInfoNoEncontrado = false;
	};

	/**
	 * Método encargado de limpiar el control (elimina los datos)
	 */
	public Clear(): void {
		// Establece sobre el item seleccionado nuevamente la lista de objetos
		this.itemSeleccionado = [];
		this.frmArticulos.reset(); // Limpia el formulario
		// Limpia TODO
		this.LimpiarClasesDelFormulario();
		this.LimpiarSubclaseDelFormulario();
		this.LimpiarGruposDelFormulario();
		// Limpiar resultados de la búsqueda
		this.articulosSIGES = null;
		// Muestra el filtro de texto de búsqueda
		this.mostrarFiltroTexto = true;
		// Maneja los mensaje de información
		this.mostrarInfoBusqueda = true;
		this.mostrarInfoError = false;
		this.mostrarInfoNoEncontrado = false;
	};

	/**
	 * Método encargado de limpiar toda la búsqueda
	 */
	public btnClear(): void {
		// Condición que verifica si itemSeleccionado contiene algo.
		if (this.itemSeleccionado.length !== 0) {
			// Muestra la barra de progreso
			this.esCargando = true;
			// Mensaje a mostrar
			const mensaje = 'Esta acción limpiará los artículos seleccionados y no se podrá revertir.';
			// Muestra el mensaje de confirmación.
			this.msgBox
				.open('QUESTION', '¿Seguro que desea limpiar la búsqueda?<br>', mensaje)
				.subscribe(res => {
					// Valida la respuesta
					if (res === 'YES') {
						// Oculta la barra de progreso una vez obtenida la respuesta
						this.esCargando = false;
						// Llama al método clear para proceder a limpiar todo el formulario
						this.Clear();
					} else {
						// Oculta la barra de progreso una vez obtenida la respuesta
						this.esCargando = false;
					}
				});
		} else {
			this.Clear();
		}
	};

	/**
	 * Método encargado de establecer la clase seleccionada por el usuario
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public SeleccionarClase(item): void {
		// Indica que realizp la acción de seleccionar el autocompletar
		// (esto evita que se CIERRE la ventana de filtros por el evento que cierra
		// cuando se da clic en cualquier lugar de la ventana)
		this.esEventoAutoCompletar = true;
		// Asigna la clase seleccionada
		this.claseSeleccionado = item ? item._id : null;
		// Valida si selecciono algo para cargar el catálogo de categorías
		if (this.claseSeleccionado) {
			this.ObtenerCatalogoSubClases(this.claseSeleccionado);
		}
	};

	/**
	 * Método encargado de establecer la clase seleccionada por el usuario
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public SeleccionarSubClase(item): void {
		// Indica que realizp la acción de seleccionar el autocompletar
		// (esto evita que se CIERRE la ventana de filtros por el evento que cierra
		// cuando se da clic en cualquier lugar de la ventana)
		this.esEventoAutoCompletar = true;
		// Asigna el capitulo seleccionado
		this.subClaseSeleccionado = item ? item : null;
		// Valida si selecciono algo para cargar el catálogo de categorías
		if (this.subClaseSeleccionado) {
			this.ObtenerCatalogoGrupos(this.subClaseSeleccionado);
		}
	};

	/**
	 * Método encargado de establecer el gruop seleccionado por el usuario
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public SeleccionarGrupo(item): void {
		// Indica que realizp la acción de seleccionar el autocompletar
		// (esto evita que se CIERRE la ventana de filtros por el evento que cierra
		// cuando se da clic en cualquier lugarr de la ventana)
		this.esEventoAutoCompletar = true;
		// Asigna el capitulo seleccionado
		this.grupoSeleccionado = item ? item : null;
	};

	/**
	 * Método encargado de buscar la información del articulo
	 */
	public Buscar(): void {
		// Se valida que al menos exista SIEMPRE la clase para ir a buscar
		if (!this.claseSeleccionado) {
			// Si no existe despliega el mensaje indicando que falta el filtro
			// Muestra el mensaje de error
			this.msgBox.open('INFO', 'Filtrado de datos', 'Debe indicar una CLASE para poder iniciar la búsqueda.');
			return;
		}

		// Se establecen los parámetros de la consulta
		const params = {
			clase_id: this.claseSeleccionado,
			subClase_id: this.subClaseSeleccionado
				? this.subClaseSeleccionado._id
				: null,
			grupo_id: this.grupoSeleccionado ? this.grupoSeleccionado._id : null,
			filtro: this.frmArticulos.controls.txtFiltro.value
		};
		// Muestra la barra de progreso
		this.esCargando = true;
		// Limpia la lista de resultados
		this.articulosSIGES = null;
		// Vuelve a habilitar el filtro de texto
		this.mostrarFiltroTexto = true;
		// Valida que el formulario este válido antes de ir a buscar
		if (this.frmArticulos.controls.txtFiltro.valid) {
			this.articulosSigesSearchService.showByFiltro(params).then(
				res => {
					// Oculta la barra de progreso una vez obtenida la respuesta
					this.esCargando = false;
					// Recibe la respuesta
					if (res.exito) {
						// Oculta los mensajes de información
						this.mostrarInfoBusqueda = false;
						this.mostrarInfoError = false;
						this.mostrarInfoNoEncontrado = false;
						// Recorre la lista de items que ya están seleccionados
						this.itemSeleccionado.forEach(seleccionado => {
							// Recorre los datos de la respuesta del server
							res.data.some(function (item, index) {
								// Valida si el item seleccionado existe en la respuesta del server
								if (item._id === seleccionado._id) {
									// Si el dato existe, SE ELIMINA del arreglo en la respuesta
									res.data.splice(index, 1);
									return true;
								}
							});
						});

						// Asigna los datos de la respuesta
						this.articulosSIGES = res.data;
					} else {
						// Muestra el mensaje de error
						this.MostrarSnackBar(res.mensaje, null);
						this.mostrarInfoBusqueda = false;
						this.mostrarInfoError = false;
						this.mostrarInfoNoEncontrado = true;
						// .subscribe(res => alert(res));
						// Limpia el formulario
					}
				},
				err => {
					this.mostrarInfoBusqueda = false;
					this.mostrarInfoError = false;
					this.mostrarInfoNoEncontrado = true;
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
					// Muestra el mensaje con el error de validación del logueo
					this.MostrarSnackBar(err.error.mensaje, null);
					// .subscribe(res => alert(res));
				}
			);
		} else {
			// Maneja los mensajes de información
			this.mostrarInfoBusqueda = false;
			this.mostrarInfoError = true;
			this.mostrarInfoNoEncontrado = false;
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
		}
	};

	/**
	 * Método encargado de cerrar la ventana de filtros
	 */
	public CerrarFiltrosAutocompletar(): void {
		// Muestra el filtro de texto de búsqueda
		this.mostrarFiltroTexto = true;
		// Limpia filtros de autocompletar de búsqueda
		this.LimpiarClasesDelFormulario();
	};

	/**
	 * Método encargado de establecer el item seleccionado
	 * @param item Parámetro que contiene el valor del item seleccionado
	 * @param index Parámetro que indica el indice seleccionado
	 */
	public SeleccionarItem(item: any, index: number): void {
		// Se agrega el item seleccionado al arreglo
		this.itemSeleccionado.push(item);
		// Se elimina del resultado de la búsqueda
		this.articulosSIGES.splice(index, 1);
	};

	/**
	 * Método encargado de eliminar el item seleccionado
	 * @param index Parámetro que indica el indice seleccionado
	 */
	public QuitarItemSeleccionado(index: number): void {
		// Se elimina del resultado de la búsqueda
		this.itemSeleccionado.splice(index, 1);
	};

	/**
	 * Método encargado de capturar los eventos CLICKS fuera del "scope" de esta etiqueta
	 * @param e Representa el evento click en la ventana
	 */
	public onClickedOutside(e: Event): void {
		// Valida si el evento lo genero un autocompletar
		if (!this.esEventoAutoCompletar) {
			// Si NO lo genera un autocompletar; cierra la ventana de filtros
			this.mostrarFiltroTexto = true;
		}
		// Resetea la bandera para los eventos de autocompletar
		this.esEventoAutoCompletar = false;
	};

	/**
	 * Método encargado de limpiar los datos para filtrar por clases
	 */
	public LimpiarClasesDelFormulario(): void {
		// Limpia los datos de los items seleccionados
		this.claseSeleccionado = null;
		this.subClaseSeleccionado = null;
		this.grupoSeleccionado = null;
		// Limpia los datos de lo catálogos
		this.catalogoSubClases = null;
		this.catalogoGrupos = null;
		// Limpia los controles de autocompletar
		if (this.clasesAutoComplete) {
			this.clasesAutoComplete.Reset();
		}
		if (this.subClasesAutoComplete) {
			this.subClasesAutoComplete.Reset();
		}
		if (this.gruposAutoComplete) {
			this.gruposAutoComplete.Reset();
		}
	};

	/**
	 * Método encargado de limpiar los datos para filtrar por subclases
	 */
	public LimpiarSubclaseDelFormulario(): void {
		// Limpia los datos de los items seleccionados
		this.subClaseSeleccionado = null;
		this.grupoSeleccionado = null;
		// Limpia los datos de lo catálogos
		this.catalogoGrupos = null;
		// Limpia los controles de autocompletar
		if (this.subClasesAutoComplete) {
			this.subClasesAutoComplete.Reset();
		}
		if (this.gruposAutoComplete) {
			this.gruposAutoComplete.Reset();
		}
	};

	/**
	 * Método encargado de limpiar los datos para filtrar por grupos
	 */
	public LimpiarGruposDelFormulario(): void {
		// Limpia los datos de los items seleccionados
		this.grupoSeleccionado = null;
		// Limpia los controles de autocompletar
		if (this.gruposAutoComplete) {
			this.gruposAutoComplete.Reset();
		}
	};

	/**
	 * Métodos privados
	 */

	/**
	 * Método que se encarga de obtener las clases de artículos SIGES.
	 */
	private ObtenerCatalogoClases(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Limpia el formulario para la siguiente búsqueda
		this.LimpiarClasesDelFormulario();
		// Se llama a la función del servicio que envia los datos al server
		this.articulosService.ShowByClasesArticulos().then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Asigna los datos de la respuesta
					this.catalogoClases = res.data;
					// valida si existe un valor default para la clase
					if (this.idClaseSIGESDefault) {
						// Recorre la lista de clases y determina si existe el valor para asignarlo como
						// el valor seleccionado
						this.catalogoClases.some(clase => {
							// Valida si hay coincidencia en el id
							if (parseInt(clase.idSIGES, 10) === this.idClaseSIGESDefault) {
								// Indica la clase como seleccionada
								this.SeleccionarClase(clase);
								// Establece el valor de autocompletar default
								this.clasesAutoComplete.filtro.setValue(clase.descripcion);
								return true;
							}
						});
					}
				} else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error en la búsqueda', res.mensaje);
					// .subscribe(res => alert(res));
					// Limpia el formulario
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error de validación del logueo
				this.msgBox.open('ERROR', 'Error en la búsqueda', err.error.mensaje);
				// .subscribe(res => alert(res));
			}
		);
	};

	/**
	 * Método encargado de obtener el catálogo de subclases de artículos SIGES
	 * @param capituloId Indica el id del capitulo a filtrar
	 */
	private ObtenerCatalogoSubClases(clase_id: any): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Limpia el formulario para la siguiente búsqueda
		this.LimpiarSubclaseDelFormulario();
		// Se llama a la función del servicio que envia los datos al server
		this.articulosService.ShowSubClaseByClaseArcticulos(clase_id).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Asigna los datos de la respuesta
					this.catalogoSubClases = res.data;
				} else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error en la búsqueda', res.mensaje);
					// .subscribe(res => alert(res));
					// Limpia el formulario
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error de validación del logueo
				this.msgBox.open('ERROR', 'Error en la búsqueda', err.error.mensaje);
				// .subscribe(res => alert(res));
			}
		);
	};

	/**
	 * Método encargado de obtener el catálogo de grupos de artículos SIGES
	 * @param subclase_id Indica el id de la grupos a filtrar
	 */
	private ObtenerCatalogoGrupos(grupo: any): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Limpia el formulario para la siguiente búsqueda
		this.LimpiarGruposDelFormulario();
		// Se llama a la función del servicio que envia los datos al server
		this.articulosService.ShowGruposBySubClaseArticulos(grupo._id).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Asigna los datos de la respuesta
					this.catalogoGrupos = res.data;
				} else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error en la búsqueda', res.mensaje);
					// .subscribe(res => alert(res));
					// Limpia el formulario
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error de validación del logueo
				this.msgBox.open('ERROR', 'Error en la búsqueda', err.error.mensaje);
				// .subscribe(res => alert(res));
			}
		);
	};

	/**
	 * Método encargado de crear los mensajes snackBar para la comunicación con el usuario.
	 * @param message Parámetro que obtiene el mensaje del snackBar.
	 * @param action Parámetro que obtiene la acción del snackBar.
	 */
	private MostrarSnackBar(message: string, action: string): void {
		this.snackBar.open(message, action, {
			duration: 3000
		});
	};

	/**
	* Método inicial del componente
	*/
	ngOnInit() {
		// Carga la lista de capítulos del CIE10
		this.ObtenerCatalogoClases();
	};
}
