// Definición typescript para el componente AutocompleteComponent v1.8.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2019) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";

/**
 * Componente destinado al manejo de listas desplegables según filtro indicado
 * por medio de la acción de autocompletar
 */
@Component({
	selector: "arca-autocomplete",
	templateUrl: "./autocomplete.component.html",
	styleUrls: ["./autocomplete.component.scss"],
})
export class AutocompleteComponent implements OnInit {
	/**
	 * Variable de tipo formulario que almacenara el valor del texto a filtrar
	 */
	public filtro: FormControl;
	/**
	 * Variable para el manejo del texto descriptivo (placeholder) a mostrar en el campo de búsqueda
	 */
	public placeholder: string;
	/**
	 * Variable que contendra la lista de items en los cuales se basará la búsqueda
	 */
	private source: Array<any>;
	/**
	 * Variable que contendra la lista de items filtrados a partir de texto de búsqueda
	 */
	public resultadoFiltro: any;
	/**
	 * Variable que contiene el valor default para establecerlo como el seleccionado en el filtro
	 */
	private defaultValue: any;
	/**
	 * Variable que almacenara el dato del item seleccionado
	 */
	private itemSeleccionado: any;

	/**
	 * Atributo de entrada para establecer el placeholder del input del control
	 */
	@Input()
	set Placeholder(_texto: string) {
		this.placeholder = _texto;
	}
	get Placeholder() {
		return this.placeholder;
	}

	/**
	 * Atributo de entrada para establecer la lista de elementos a filtrar en el control
	 */
	@Input()
	set Source(_items: Array<any>) {
		this.source = _items;
	}
	get Source() {
		return this.source;
	}
	/**
	 * Atributo de entrada para establecer un valor default a seleccionar en la lista de elementos del control
	 */
	@Input()
	set ValorDefault(_id: any) {
		this.defaultValue = _id;
	}
	get ValorDefault() {
		return this.defaultValue;
	}
	/**
	 * Atributo de entrada para establecer si el control esta deshabilitado o no
	 */
	@Input()
	set Disable(_disable: boolean) {
		// Valida si el control esta deshabilitado o no
		if (_disable) {
			this.filtro.disable();
		} else {
			this.filtro.enable();
		}
	}

	/**
	 * Atributo de salida que retorna el item seleccionado por el usuario
	 */
	@Output("ItemSeleccionado")
	private ItemSeleccionado: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Atributo de salida que retorna el item seleccionado por el usuario
	 */
	@Output("ItemDigitado")
	private ItemDigitado: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Contructor de la clase
	 */
	constructor() {
		// Se instancia la clase que asocia la variable a un campo de formulario
		this.filtro = new FormControl();
		// A la variable de los items filtrados se le asigna los items que fueron filtrados
		// a partir del texto de búsqueda
		this.resultadoFiltro = this.filtro.valueChanges.pipe(
			startWith(""),
			map((texto) => this.FiltrarItems(texto))
		);
	}

	// Métodos Públicos

	/**
	 * Método encargado de establecer el valor seleccionado por el usuario; por tanto se encarga
	 * de enviar la respuesta a traves del servicio del componente
	 */
	public EstablecerSeleccion(): void {
		this.ItemSeleccionado.emit(this.itemSeleccionado[0]);
	}

	public ValidarItemDigitado(valor: any): void {
		this.ItemDigitado.emit(valor.target.value);
	}

	/**
	 * Método encargado de resetear el control
	 * (Este deberia ser accedido únicamente mediante el decorador @ViewChild)
	 */
	public Reset(): void {
		// Establece sobre el item seleccionado nuevamente la lista de objetos
		this.itemSeleccionado = this.source;
		/// Establece nulo al valor del campo de filtro
		this.filtro.setValue(null);
		// Retorna nulo como valor seleccionado
		this.ItemSeleccionado.emit(null);
	}

	/**
	 * Método encargado de restablecer el valor visual del control mediante una descripción pasada por defecto
	 * (Este deberia ser accedido únicamente mediante el decorador @ViewChild)
	 * @param descripcion representa la descripción del elemento de la colección de elementos
	 */
	public ValorDefaultByDescripcion(descripcion: string): void {
		// Establece sobre el item seleccionado nuevamente la lista de objetos
		this.itemSeleccionado = this.source;
		/// Establece el valor de la descripción visual
		this.filtro.setValue(descripcion);
		// Se envía la selección al componente padre
		this.EstablecerSeleccion();
	}

	/**
	 * Método encargado de limpiar el control (elimina los datos)
	 * (Este deberia ser accedido únicamente mediante el decorador @ViewChild)
	 */
	public Clear(): void {
		// Limpia el arreglo general de búsqueda
		this.source = null;
		// Establece sobre el item seleccionado nuevamente la lista de objetos
		this.itemSeleccionado = null;
		/// Establece nulo al valor del campo de filtro
		this.filtro.setValue(null);
	}

	// Métodos Privados

	/**
	 * Método encargado de filtrar la lista de items a partir del texto de búsqueda indicado
	 * @param filtro Parámetro que contiene el valor del texto que se esta filtrando
	 * @returns Retorna un objeto de tipo <any> que representa el valor del item seleccionado
	 */
	private FiltrarItems(filtro: string): any {
		// Se limpia la variable global del item seleccionado
		this.itemSeleccionado = null;
		// Se aplica el filtro dado por el usuario y se escoge el item
		this.itemSeleccionado =
			filtro && this.source
				? this.source.filter(
						(s) =>
							s.descripcion
								.toLowerCase()
								.indexOf(filtro.toLowerCase()) !== -1
				  )
				: this.source;
		// Se retorna el filtrado para irlo mostrando en la lista desplegable
		return this.itemSeleccionado;
	}

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Variable que contendra el valor default
		let VALOR_DEFAULT = null;
		// Valida si existe un valor default para establecercelo al componente desde el inicio.
		if (
			typeof this.source !== "undefined" &&
			this.source !== null &&
			this.source.length !== 0
		) {
			// Valida el tipo de propiedad ID que posee el arreglo (id / _id)
			VALOR_DEFAULT = this.source.filter((s) =>
				s.hasOwnProperty("id") ? s.id : s._id === this.defaultValue
			);
			// Obtiene la descripción del valor default
			if (VALOR_DEFAULT.length > 0) {
				VALOR_DEFAULT = VALOR_DEFAULT[0].descripcion;
			}
		}
		// Establece el filtro
		this.filtro.setValue(VALOR_DEFAULT);
	}
}
