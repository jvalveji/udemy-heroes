// Definición typescript para el módulo UsuariosSearchComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez
// Modificado: (20-06-2020)  Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

// Se importa libreria para el manejo de mensajes de error desde el servidor
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Se importa los servicios
import { UsuariosService } from './../../../admin/usuarios/usuarios.service';

// Se importa el componente del dialogo para la búsqueda de las usuarios
import { DialogUsuariosListarComponent } from './dialog-usuarios/dialog-usuarios-listar.component';

/**
 * Componente de búsqueda de las usuarios en el Padrón Nacional
 */
@Component({
	selector: 'arca-usuarios-search',
	templateUrl: './usuarios-search.component.html',
	styleUrls: ['./usuarios-search.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class UsuariosSearchComponent implements OnInit {

	/**
	 * Representa el texto que ingresó el usuario para realizar la búsqueda
	 */
	public txtFiltro = '';
	/**
	 * Representa la barra de carga cuando se realiza una comunicación al servidor
	 */
	public esCargando: Boolean = false;
	/**
	 * Representa la lista de las usuarios filtradas
	 */
	public listaUsuarios: any = [];
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
	   * @param usuariosService Representa el servicio para el Padrón Nacional
	   * @param dialog Representa el dialogo que contiene la lista después del filtro de las usuarios
	   */
	constructor(
		public snackBar: MatSnackBar,
		private usuariosService: UsuariosService,
		public dialog: MatDialog
	) {
		// Habilita el campo de texto de búsqueda
		this.mostrarListaSmall = true;
	}

	/**
	 * Método encargado de buscar todas aquellas usuarios que concuerdan con el filtro ingresado por el usuario.
	 */
	public Buscar(): void {
		if (this.txtFiltro.length >= 3) {
			if (!Number.isNaN(parseInt(this.txtFiltro, 10)) && this.txtFiltro.length < 9) {
				// Muestra mensaje de error
				this.snackBar.open('La cédula tiene que ser de al menos 9 dígitos', null, {
					duration: 3000
				});
			} else {
				// Se activa la barra de progreso
				this.esCargando = true;

				this.usuariosService.Show(this.txtFiltro).then(
					res => {
						// Oculta la barra de progreso una vez obtenida la respuesta
						this.esCargando = false;
						// Recibe la respuesta
						if (res.exito) {
							// Asigna los datos de la respuesta
							this.listaUsuarios = res.data;
							if (this.listaUsuarios.length === 0) {
								// Muestra mensaje de error
								this.snackBar.open('No se encontraron coincidencias', null, {
									duration: 3000
								});
							} else {
								this.MostrarListado();
							}
						} else {
							// Oculta la barra de progreso una vez obtenida la respuesta
							this.esCargando = false;
							// Muestra mensaje de error
							this.snackBar.open('No se pudo realizar la búsqueda de las usuarios', null, {
								duration: 3000
							});
						}
					},
					err => {
						// Oculta la barra de progreso en caso de error
						this.esCargando = false;
						// Muestra mensaje de error
						this.snackBar.open('Error al realizar la búsqueda de las usuarios, contactese con el administrador', null, {
							duration: 3000
						});
					}
				);
			}
		} else {
			// Muestra mensaje de error
			this.snackBar.open('El texto ingresado tiene que ser de al menos 3 caracteres', null, {
				duration: 3000
			});
		}
	};

	/**
	 * Método encargado de establecer el valor seleccionado por el usuario; por tanto se encarga
	 * de enviar la respuesta a traves del servicio del componente
	   * @param usuario Representa al usuario seleccionado
	 */
	public EstablecerSeleccion(usuario: any): void {
		this.ItemSeleccionado.emit(usuario);
	};

	/**
	 * Método encargado de limpiar la búsqueda
	 */
	public Clear(): void {
		// Muestra el filtro de texto de búsqueda
		this.mostrarListaSmall = true;
		// Limpia el texto
		this.txtFiltro = '';
	};

	/**
	 * Método encargado de capturar los eventos CLICKS fuera del "scope" de esta etiqueta
	 * @param e Representa el evento click en la ventana
	 */
	public onClickedOutside(e: Event): void {
		// Cierra la ventana de filtros
		this.mostrarListaSmall = true;
	};

	/**
	 * Método encargado de abrir el dialogo de la lista de las usuarios
	 */
	public OpenDialogUsuariosListar(): void {
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
			data: this.listaUsuarios
		};

		const dialogJustificacion = this.dialog.open(DialogUsuariosListarComponent,
			configMatDialog);

		dialogJustificacion.afterClosed().subscribe(usuario => {
			// Verifica si viene respuesta del server
			if (usuario) {
				this.EstablecerSeleccion(usuario);
			}
		});
	};

	// Métodos privados

	/**
	 * Método encargado de mostrar el listado dependiendo del tipo de búsqueda.
	 * @private
	 * @memberof UsuariosSearchComponent
	 */
	private MostrarListado(): void {
		switch (this.tipoBusqueda) {
			case 1: {
				if (this.listaUsuarios.length === 1) {
					this.EstablecerSeleccion(this.listaUsuarios[0]);
					this.mostrarListaSmall = true;
				} else {
					this.mostrarListaSmall = false;
				}
				break;
			}
			case 2: {
				if (this.listaUsuarios.length === 1) {
					this.EstablecerSeleccion(this.listaUsuarios[0]);
				} else {
					this.mostrarListaSmall = true;
					this.OpenDialogUsuariosListar();
				}

			}
		}
	};

	/**
	 * Método encargado de realizar la carga principal del componente.
	 */
	public ngOnInit(): void {
	}
}
