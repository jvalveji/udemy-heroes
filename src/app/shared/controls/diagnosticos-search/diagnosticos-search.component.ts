// Definición typescript para el componente DiagnosticosSearchComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/operators/startWith';
import 'rxjs/operators/map';

// Se agregan los servicios a utilizar
import { DiagnosticosService } from './../../../admin/catalogos/diagnosticos/diagnosticos.service';
import { DialogService } from '../dialog/dialog.service';

// Se agregan los componentes a utilizar
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';

/**
 * Componente destinado a la búsqueda de diagnósticos basados en el CIE10
 */
@Component({
	selector: 'arca-diagnosticos-search',
	templateUrl: './diagnosticos-search.component.html',
	styleUrls: ['./diagnosticos-search.component.scss'],
	providers: [DiagnosticosService]
})
export class DiagnosticosSearchComponent implements OnInit {
	/**
	 * Se "instancia" el componente de autocompletar  de los capítulos del CIE10 (en el html) para accederlos por código
	 */
	@ViewChild('capitulosAutoComplete') capitulosAutoComplete: AutocompleteComponent;
	/**
	 * Se "instancia" el componente de autocompletar  de los grupos del CIE10 (en el html) para accederlos por código
	 */
	@ViewChild('gruposAutoComplete') gruposAutoComplete: AutocompleteComponent;
	/**
	 * Se "instancia" el componente de autocompletar  de las categorías del CIE10 (en el html) para accederlos por código
	 */
	@ViewChild('categoriasAutoComplete') categoriasAutoComplete: AutocompleteComponent;
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Muestra oculta el DIV de filtrado
	 */
	public mostrarFiltroTexto = true;
	/**
	 * Indica si la búsqueda en los autocompletar se ejecuta
	 */
	public esEventoAutoCompletar = false;
	/**
	 * Variable que muestra/oculta el mensaje información para la búsqueda
	 */
	public mostrarInfoBusqueda = true;
	/**
	 * Variable que muestra/oculta el mensaje de error para la búsqueda
	 */
	public mostrarInfoError = false;
	/**
	 * Variable de tipo formulario que almacenara el valor del texto a filtrar
	 */
	public frmDiagnosticos: FormGroup;
	/**
	 * Variable que representa el catálogo de capítulos del CIE10
	 */
	public catalogoCapitulos: any;
	/**
	 * Variable que representa el catálogo de grupos del CIE10
	 */
	public catalogoGrupos: any;
	/**
	 * Variable que representa el catálogo de categorías del CIE10
	 */
	public catalogoCategorias: any;
	/**
	 * Variable que representa los diagnósticos del CIE10
	 */
	public catalogoCIE10: any;
	/**
	 * Variable que almacena el item seleccionado por el usuario
	 */
	public itemSeleccionado: any;
	/**
	 * Variable que almacena el capítulo seleccionado por el usuario
	 */
	public capituloSeleccionado: any;
	/**
	 * Variable que almacena el grupo seleccionado por el usuario
	 */
	public grupoSeleccionado: any;
	/**
	 * Variable que almacena la categoría seleccionada por el usuario
	 */
	public categoriaSeleccionada: any;

	/**
	* Atributo de salida que retorna el item seleccionado por el usuario
	*/
	@Output('ItemSeleccionado')
	private ItemSeleccionado: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Contructor de la clase
	 * @param fb Representa un objeto de tipo FormBuilder
	 * @param dxService Representa el servicio de diagnósticos
	 * @param msgbox Representa la ventana de dialogo de mensajes
	 */
	constructor(private fb: FormBuilder,
		private dxService: DiagnosticosService,
		private msgBox: DialogService) {
		// Asigna los controles al objeto formulario
		this.frmDiagnosticos = this.fb.group({
			'txtFiltro': ['', Validators.compose([Validators.required, Validators.minLength(3)])]
		});
		// Habilita el campo de texto de búsqueda
		this.mostrarFiltroTexto = true;
		this.itemSeleccionado = [];
	}

	// Métodos Públicos

	/**
	 * Método encargado de establecer el valor seleccionado por el usuario; por tanto se encarga
	 * de enviar la respuesta a traves del servicio del componente
	 */
	public EstablecerSeleccion(): void {
		this.ItemSeleccionado.emit(this.itemSeleccionado);
	};

	/**
	 * Método encargado de resetear el control
	 * (Este deberia ser accedido únicamente mediante el decorador @ViewChild)
	 */
	public Reset(): void {
		// Limpia todo
		this.Clear();
		// Retorna nulo como valor seleccionado
		this.ItemSeleccionado.emit(null);
		// Maneja los mensaje de información
		this.mostrarInfoBusqueda = true;
		this.mostrarInfoError = false;
	};

	/**
	 * Método encargado de limpiar el control (elimina los datos)
	 * (Este deberia ser accedido únicamente mediante el decorador @ViewChild)
	 */
	public Clear(): void {
		// Establece sobre el item seleccionado nuevamente la lista de objetos
		this.itemSeleccionado = [];
		this.frmDiagnosticos.reset(); // Limpia el formulario
		// Limpia TODO
		this.LimpiarCapitulosDelFormulario();
		this.LimpiarGruposDelFormulario();
		this.LimpiarCategoriasDelFormulario();
		// Limpiar resultados de la búsqueda
		this.catalogoCIE10 = null;
		// Muestra el filtro de texto de búsqueda
		this.mostrarFiltroTexto = true;
		// Maneja los mensaje de información
		this.mostrarInfoBusqueda = true;
		this.mostrarInfoError = false;
	};

	/**
	 * Método encargado de establecer el valor del capitulo CIE10 seleccionado por el usuario
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public SeleccionarCapitulo(item: any): void {
		// Indica que realizp la acción de seleccionar el autocompletar
		// (esto evita que se CIERRE la ventana de filtros por el evento que cierra
		// cuando se da clic en cualquier lugar de la ventana)
		this.esEventoAutoCompletar = true;
		// Asigna el capitulo seleccionado
		this.capituloSeleccionado = (item) ? item : null;
		// Valida si selecciono algo para cargar el catálogo de grupos
		if (this.capituloSeleccionado) {
			this.ObtenerCatalogoGrupos(this.capituloSeleccionado._id);
		}
	};

	/**
	 * Método encargado de establecer el valor del grupo CIE10 seleccionado por el usuario
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public SeleccionarGrupo(item: any): void {
		// Indica que realizp la acción de seleccionar el autocompletar
		// (esto evita que se CIERRE la ventana de filtros por el evento que cierra
		// cuando se da clic en cualquier lugarr de la ventana)
		this.esEventoAutoCompletar = true;
		// Asigna el capitulo seleccionado
		this.grupoSeleccionado = (item) ? item : null;
		// Valida si selecciono algo para cargar el catálogo de categorías
		if (this.grupoSeleccionado) {
			this.ObtenerCatalogoCategorias(this.grupoSeleccionado._id);
		}
	};

	/**
	 * Método encargado de establecer el valor de la categoría CIE10 seleccionada por el usuario
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public SeleccionarCategoria(item: any): void {
		// Indica que realizp la acción de seleccionar el autocompletar
		// (esto evita que se CIERRE la ventana de filtros por el evento que cierra
		// cuando se da clic en cualquier lugarr de la ventana)
		this.esEventoAutoCompletar = true;
		// Asigna el capitulo seleccionado
		this.categoriaSeleccionada = (item) ? item : null;
	};

	/**
	 * Método encargado de buscar la información del diagnóstico
	 */
	public Buscar(): void {
		// Muestra la barra de progreso
		this.esCargando = true;
		// Limpia la lista de resultados
		this.catalogoCIE10 = null;
		// Vuelve a habilitar el filtro de texto
		this.mostrarFiltroTexto = true;
		// Valida que el formulario este válido antes de ir a buscar
		if (this.frmDiagnosticos.controls.txtFiltro.valid) {
			// Se llama a la función del servicio que envia los datos al server
			this.dxService.ShowDiagnosticoByDescripcion(this.frmDiagnosticos.controls.txtFiltro.value,
				(this.capituloSeleccionado) ? this.capituloSeleccionado._id : null,
				(this.grupoSeleccionado) ? this.grupoSeleccionado._id : null,
				(this.categoriaSeleccionada) ? this.categoriaSeleccionada._id : null
			).then((res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Oculta los mensajes de información
					this.mostrarInfoBusqueda = false;
					this.mostrarInfoError = false;
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
					this.catalogoCIE10 = res.data;
				}
				else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error en la búsqueda', res.mensaje);
					// .subscribe(res => alert(res));
					// Limpia el formulario
				}

			}, (err) => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error de validación del logueo
				this.msgBox.open('ERROR', 'Error en la búsqueda', err.error.mensaje);
				// .subscribe(res => alert(res));
			});
		}
		else {
			// Maneja los mensajes de información
			this.mostrarInfoBusqueda = false;
			this.mostrarInfoError = true;
		}
	};

	/**
	 * Método encargado de cerrar la ventana de filtros
	 */
	public CerrarFiltrosAutocompletar(): void {
		// Muestra el filtro de texto de búsqueda
		this.mostrarFiltroTexto = true;
		// Limpia filtros de autocompletar de búsqueda
		this.LimpiarCapitulosDelFormulario();
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
		this.catalogoCIE10.splice(index, 1);
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
	* Método encargado de limpiar los datos para filtrar por capítulos
	*/
	public LimpiarCapitulosDelFormulario(): void {
		// Limpia los datos de los items seleccionados
		this.capituloSeleccionado = null;
		this.grupoSeleccionado = null;
		this.categoriaSeleccionada = null;
		// Limpia los datos de lo catálogos
		this.catalogoGrupos = null;
		this.catalogoCategorias = null;
		// Limpia los controles de autocompletar
		if (this.capitulosAutoComplete) { this.capitulosAutoComplete.Reset() };
		if (this.gruposAutoComplete) { this.gruposAutoComplete.Reset() };
		if (this.categoriasAutoComplete) { this.categoriasAutoComplete.Reset() };
	};

	/**
	 * Método encargado de limpiar los datos para filtrar por grupos
	 */
	public LimpiarGruposDelFormulario(): void {
		// Limpia los datos de los items seleccionados
		this.grupoSeleccionado = null;
		this.categoriaSeleccionada = null;
		// Limpia los datos de lo catálogos
		this.catalogoCategorias = null;
		// Limpia los controles de autocompletar
		if (this.gruposAutoComplete) { this.gruposAutoComplete.Reset() };
		if (this.categoriasAutoComplete) { this.categoriasAutoComplete.Reset() };
	};

	/**
	 * Método encargado de limpiar los datos para filtrar por categorias
	 */
	public LimpiarCategoriasDelFormulario(): void {
		// Limpia los datos de los items seleccionados
		this.categoriaSeleccionada = null;
		// Limpia los controles de autocompletar
		if (this.categoriasAutoComplete) { this.categoriasAutoComplete.Reset() };
	};

	// Métodos privados

	/**
	 * Método encargado de obtener el catálogo de capítulos del CIE10
	 */
	private ObtenerCatalogoCapitulos(): void {
		// Muestra la barra de progreso
		this.esCargando = true;
		// Limpia el formulario para la siguiente búsqueda
		this.LimpiarCapitulosDelFormulario();

		// Se llama a la función del servicio que envia los datos al server
		this.dxService.ShowByCapitulosCIE10().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos de la respuesta
				this.catalogoCapitulos = res.data[0];
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error en la búsqueda', res.mensaje);
				// .subscribe(res => alert(res));
				// Limpia el formulario
			}

		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error de validación del logueo
			this.msgBox.open('ERROR', 'Error en la búsqueda', err.error.mensaje);
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método encargado de obtener el catálogo de grupos del CIE10
	 * @param capituloId Indica el id del capitulo a filtrar
	 */
	private ObtenerCatalogoGrupos(capituloId: string): void {
		// Muestra la barra de progreso
		this.esCargando = true;
		// Limpia el formulario para la siguiente búsqueda
		this.LimpiarGruposDelFormulario();

		// Se llama a la función del servicio que envia los datos al server
		this.dxService.ShowByGruposCIE10(capituloId).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos de la respuesta
				this.catalogoGrupos = res.data[0];
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error en la búsqueda', res.mensaje);
				// .subscribe(res => alert(res));
				// Limpia el formulario
			}

		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error de validación del logueo
			this.msgBox.open('ERROR', 'Error en la búsqueda', err.error.mensaje);
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método encargado de obtener el catálogo de categorías del CIE10
	 * @param grupoId Indica el id del grupo a filtrar
	 */
	private ObtenerCatalogoCategorias(grupoId: string): void {
		// Muestra la barra de progreso
		this.esCargando = true;
		// Limpia el formulario para la siguiente búsqueda
		this.LimpiarCategoriasDelFormulario();

		// Se llama a la función del servicio que envia los datos al server
		this.dxService.ShowByCategoriasCIE10(grupoId).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos de la respuesta
				this.catalogoCategorias = res.data[0];
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error en la búsqueda', res.mensaje);
				// .subscribe(res => alert(res));
				// Limpia el formulario
			}

		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error de validación del logueo
			this.msgBox.open('ERROR', 'Error en la búsqueda', err.error.mensaje);
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Carga la lista de capítulos del CIE10
		this.ObtenerCatalogoCapitulos();
	};
}
