// Definición typescript para el módulo PersonasSearchComponent v1.0.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr> (11-09-2018)
// Modificado: (20-06-2019) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
// Se importa libreria para el manejo de mensajes de error desde el servidor
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// Se importa los servicios
import { PersonasService } from './personas.service';
// Se importa el componente del dialogo para la búsqueda de las personas
import { DialogPersonasListarComponent } from './dialog-personas-listar/dialog-personas-listar.component';

/**
 * Componente de búsqueda de las personas en el Padrón Nacional
 */
@Component({
	selector: 'arca-personas-search',
	templateUrl: './personas-search.component.html',
	styleUrls: ['./personas-search.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class PersonasSearchComponent implements OnInit {

	/**
	 * Representa el texto que ingresó el usuario para realizar la búsqueda
	 */
	public txtFiltro = '';
	/**
	 * Representa la barra de carga cuando se realiza una comunicación al servidor
	 */
	public esCargando: Boolean = false;
	/**
	 * Representa la lista de las personas filtradas
	 */
	public filtroPersonas: any = [];
	/**
	 * Representa la lista de las personas filtradas para mostrar
	 */
	public filtroPersonasMostrar: any = [];
	/**
	 * Representa el tipo de búsqueda de la lista de la que se quiere observar.
	 * No. 1: Lista pequeña que se muestra debajo del campo de texto.
	 * No. 2: Lista grande que se muestra de forma de diálogo (MatDialog)
	 */
	public tipoBusqueda = 1;
	/**
   * Variable de estado para mostrar/ocultar el filtro
   */
	public mostrarListaSmall = true;
	/**
   * Atributo de entrada para establecer el tipo de búsqueda que desea el desarrollador
   */
	@Input()
	set TipoBusqueda(_tipo: number) {
		this.tipoBusqueda = _tipo;
	}
	get TipoBusqueda() {
		return this.tipoBusqueda;
	}
	/**
	* Atributo de salida que retorna el item seleccionado por el usuario
	*/
	@Output('ItemSeleccionado')
	private ItemSeleccionado: EventEmitter<any> = new EventEmitter<any>();

	/**
	   * Constructor de la clase
	   * @param snackBar Representa el componente snackBar para mostrar mensajes
	   * @param personasService Representa el servicio para el Padrón Nacional
	   * @param dialog Representa el dialogo que contiene la lista después del filtro de las personas
	   */
	constructor(
		public snackBar: MatSnackBar,
		private personasService: PersonasService,
		public dialog: MatDialog
	) {
		// Habilita el campo de texto de búsqueda
		this.mostrarListaSmall = true;
	}

	/**
	 * Método encargado de buscar todas aquellas personas que concuerdan con el filtro ingresado por el usuario.
	 */
	public Buscar(): void {
		if (this.txtFiltro.length >= 3) {
			if (!Number.isNaN(parseInt(this.txtFiltro, 10)) && this.txtFiltro.length < 9) {
				this.MostrarSnackBar('La cédula tiene que ser de al menos 9 dígitos', null);
			} else {
				// Se activa la barra de progreso
				this.esCargando = true;
				// Se consume el servicio para el filtro de personas
				this.personasService.showByFiltro(this.txtFiltro).then(
					res => {
						// Oculta la barra de progreso una vez obtenida la respuesta
						this.esCargando = false;
						// Recibe la respuesta
						if (res.exito) {
							// Asigna los datos de la respuesta
							this.filtroPersonas = res.data;
							if (this.filtroPersonas.length === 0) {
								this.MostrarSnackBar('No se encontraron coincidencias', null);
							} else {
								this.MostrarListado();
							}

						} else {
							// Oculta la barra de progreso una vez obtenida la respuesta
							this.esCargando = false;
							this.MostrarSnackBar('No se pudo realizar la búsqueda de las personas', null);
						}
					},
					err => {
						// Oculta la barra de progreso en caso de error
						this.esCargando = false;
						this.MostrarSnackBar('Error al realizar la búsqueda de las personas, contactese con el administrador', null);
					}
				);
			}
		} else {
			this.MostrarSnackBar('El texto ingresado tiene que ser de al menos 3 caracteres', null);
		}
	}

	/**
	 * Método encargado de establecer el valor seleccionado por el usuario; por tanto se encarga
	 * de enviar la respuesta a traves del servicio del componente
	   * @param personaSeleccionada Representa la persona que seleccionó el usuario
	 */
	public EstablecerSeleccion(personaSeleccionada: any): void {
		this.ItemSeleccionado.emit(personaSeleccionada);
	};


	/**
	 * Método encargado de limpiar la búsqueda
	 */
	public Clear(): void {
		// Muestra el filtro de texto de búsqueda
		this.mostrarListaSmall = true;
		// Limpia el texto
		this.txtFiltro = '';
	}

	/**
 * Método encargado de capturar los eventos CLICKS fuera del "scope" de esta etiqueta
 * @param e Representa el evento click en la ventana
 */
	public onClickedOutside(e: Event): void {
		// Cierra la ventana de filtros
		this.mostrarListaSmall = true;
	};

	/**
 * Método encargado de abrir el dialogo de la lista de las personas
 */
	public OpenDialogPersonasListar(): void {
		// Configuracion de la ventana del dialogo
		const configMatDialog =
		{
			disableClose: false,
			panelClass: '',
			hasBackdrop: true,
			backdropClass: '',
			width: '80%',
			height: '90%',
			maxWidth: 'none',
			maxHeight: 'none',
			position: {
				top: '',
				bottom: '',
				left: '',
				right: ''
			},
			data: this.filtroPersonas
		};

		const dialogJustificacion = this.dialog.open(DialogPersonasListarComponent,
			configMatDialog);

		dialogJustificacion.afterClosed().subscribe(persona => {
			// Verifica si viene respuesta del server
			if (persona) {
				this.EstablecerSeleccion(persona);
			}
		});
	}

	/**
	 * Método encargado de mostrar el listado dependiendo del tipo de búsqueda.
	 * @private
	 * @memberof PersonasSearchComponent
	 */
	private MostrarListado(): void {
		switch (this.tipoBusqueda) {
			case 1: {
				// this.filtroPersonasMostrar = this.filtroPersonas.slice(0,10);
				if (this.filtroPersonas.length === 1) {
					this.EstablecerSeleccion(this.filtroPersonas[0]);
					this.mostrarListaSmall = true;
				} else {
					this.mostrarListaSmall = false;
				}
				break;
			}
			case 2: {
				if (this.filtroPersonas.length === 1) {
					this.EstablecerSeleccion(this.filtroPersonas[0]);
				} else {
					this.mostrarListaSmall = true;
					this.OpenDialogPersonasListar();
				}

			}
		}
	}

	/**
	 * Método encargado de crear los mensajes snackBar para la comunicación con el usuario.
	 * @param message : parámetro que obtiene el mensaje del snackBar.
	 * @param action : parámetro que obtiene la acción del snackBar.
	 */
	private MostrarSnackBar(message: string, action: string): void {
		this.snackBar.open(message, action, {
			duration: 3000
		});
	}

	/**
	 * Método encargado de realizar la carga principal del componente.
	 */
	public ngOnInit(): void {
	}
}
