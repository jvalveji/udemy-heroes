// Definición typescript para el componente tipo-cambio-editar.Component v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

// Se importan los servicios a utilizar
import { BancosService } from '../catalogos/bancos/bancos.service';
import { TipoCambioService } from '../tipo-cambio/tipo-cambio.service';
import { DialogService } from './../../shared/controls/dialog/dialog.service';
import { UtilidadesService } from './../../shared/services/utilidades.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Componente destinado al despligue y manejo del catálogo de tipo de cambio
 */
@Component({
	selector: 'arca-tipo-cambio-editar',
	templateUrl: './tipo-cambio-editar.component.html',
	styleUrls: ['./tipo-cambio-editar.component.scss'],
})
export class TipoCambioEditarComponent implements OnInit {
	public form: FormGroup;
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que almacena los datos obtenidos de los catálogos
	 */
	public catalogo: any = [];
	/**Variable que establece la fecha mayor para poder seleccionar la fecha de busqueda */
	public fechaMax: Date;
	/**
	 * Variable que contiene el filtro del texto a buscar en la lista
	 */
	public txtFiltro: string;
	/**Variable que establece con la fecha seleccionada para la busqueda */
	public fecha: Date;
	/**Variable que establece con la fecha seleccionada para actualziar y crear el item */
	public fechaActualizar: Date;
	/**Variable que establece con el indicador de compra */
	public indicadorCompra;
	/**Variable que establece con el indicador de venta */
	public indicadorVenta;
	/**Variable que establece con el lisstado de bancos habilitados */
	public itemBancos: any;
	/**Variable que establece la fecha que se seleccionada */
	public fechaMostrar: String;
	/**Variable que indica que no existen tipo de cambio */
	public esTipoCambio: Boolean;
	public fechaIndicador: String;
	/**
	 * Representa el item catálogo
	 */
	public item: {
		_id: String;
		indicadorCompra: String;
		indicadorVenta: String;
		fechaCompra: string;
		fechaVenta: string;
		valorCompra: String;
		valorVenta: String;
		nombreBanco: String;
	} = {
			_id: '',
			indicadorCompra: '',
			indicadorVenta: '',
			fechaCompra: '',
			fechaVenta: '',
			valorCompra: '',
			valorVenta: '',
			nombreBanco: '',
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
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param catalogoService Variable que representa a los servicios de provincias del core core base
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param utilidadesService Representa servicio de utilidades del proyecto base
	 * @param snackBar Representa el servicio para mostrar mensajes
	 */
	constructor(
		private _location: Location,
		private catalogoService: TipoCambioService,
		private bancosService: BancosService,
		private msgBox: DialogService,
		private fb: FormBuilder,
		public utilidadesService: UtilidadesService,
		private snackBar: MatSnackBar
	) {
		this.form = fb.group({
			fechaIndicador: [new Date(), Validators.required]
		});
	}

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior
	 */
	public IrPaginaAnterior(): void {
		// Condición que verificar si hay cambios en el objeto original
		if (
			this.utilidadesService.DiffEstadoObjeto(
				this.estadoInicial,
				this.catalogo
			)
		) {
			// Inicia la barra de progreso
			this.esCargando = true;
			this.msgBox
				.open(
					'QUESTION',
					'Hay cambios sin guardar',
					'¿Seguro que desea salir?'
				)
				.subscribe((res) => {
					if (res === 'YES') {
						// Retorna a la página anterior
						this._location.back();
					} else {
						// Oculta la barra de progreso en caso de error
						this.esCargando = false;
					}
				});
		} else {
			// Retorna a la página anterior
			this._location.back();
		}
	}

	/**
	 * Método encargado de agregar un nuevo item al arreglo items del catálogo
	 */
	public AgregarItem(): void {
		/**Se establecen las fecha en el item*/
		this.EstablecerFechas();
		this.esEdicion = true;
		/**Se valida que todos los campos esten completos */
		if (
			this.item.indicadorCompra === null ||
			this.item.indicadorCompra === undefined ||
			this.item.indicadorCompra === '' ||
			this.item.indicadorVenta === null ||
			this.item.indicadorVenta === undefined ||
			this.item.indicadorVenta === '' ||
			this.item.valorVenta === null ||
			this.item.valorVenta === undefined ||
			this.item.valorVenta === '' ||
			this.item.valorCompra === null ||
			this.item.valorCompra === undefined ||
			this.item.valorCompra === '' ||
			this.item.fechaCompra === null ||
			this.item.fechaCompra === undefined ||
			this.item.fechaCompra === '' ||
			this.item.fechaVenta === null ||
			this.item.fechaVenta === undefined ||
			this.item.fechaVenta === '' ||
			this.item.nombreBanco === null ||
			this.item.nombreBanco === undefined ||
			this.item.nombreBanco === ''
		) {
			// Muestra el mensaje de error
			this.snackBar.open(
				'Debe completar los datos, del nuevo registro',
				null,
				{
					duration: 5000,
				}
			);
		} else {
			// Inicia la barra de progreso
			this.esCargando = true;
			// Se llama a la función del servicio que envia los datos al server
			this.catalogoService.Create(this.item).then(
				(res) => {
					// Oculta la barra de progreso una vez obtenida la respuesta
					this.esCargando = false;
					// Recibe la respuesta
					if (res.exito) {
						// Muestra el mensaje de éxito
						this.snackBar.open(res.mensaje, null, {
							duration: 5000,
						});
						// Se llama el metodo para listar de nuevo los tipo de cambio
						this.ObtenerCatalogo();
						this.esEdicion = false;
						// Se inicializa el item
						this.LimpiarItem();
					} else {
						// Muestra el mensaje de 404
						this.snackBar.open(res.mensaje, null, {
							duration: 5000,
						});
					}
				},
				(err) => {
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
					// Muestra el mensaje con el error
					if (err.error) {
						this.snackBar.open(err.error.message, null, {
							duration: 5000,
						});
					}
				}
			);
		}
	}

	/**
	 * Método encargado de enviar los datos del catalogo al servidor para ser actualizados
	 */
	public ActualizarCatalogo(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.EstablecerFechas();
		this.catalogoService.Update(this.item).then(
			(res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de éxito
					this.snackBar.open(res.mensaje, null, {
						duration: 5000,
					});
					this.estadoInicial = JSON.parse(
						JSON.stringify(this.catalogo)
					);
				} else {
					// Muestra el mensaje de 404
					this.snackBar.open(res.mensaje, null, {
						duration: 5000,
					});
				}
			},
			(err) => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.snackBar.open(err.error.message, null, {
						duration: 5000,
					});
				}
			}
		);
	}
	public ObtenerIndicadoresPorBanco(esVenta: Boolean): any {
		const banco = {
			fechaInicio: '',
			fechaFinal: '',
			indicador: '',
		};
		const data = { 'nombreBanco': this.item.nombreBanco };
		this.bancosService.showByName(data).then(
			(res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de éxito
					this.snackBar.open(res.mensaje, null, {
						duration: 5000,
					});
					esVenta
						? (banco.indicador = res.data.indicadorVenta)
						: (banco.indicador = res.data.indicadorCompra);
					const fecha = this.item.fechaCompra;
					if (fecha === undefined || fecha === null) {
						// Oculta la barra de progreso en caso de error
						this.esCargando = false;
						// Muestra el mensaje de error
						this.snackBar.open(
							'Debe completar los datos de la fecha',
							null,
							{
								duration: 5000,
							}
						);
					} else {
						banco.fechaInicio = fecha;
						banco.fechaFinal = fecha;
						this.ObtenerIndicadoresEconomicosWS(banco, esVenta);
					};
				} else {
					// Muestra el mensaje de 404
					this.snackBar.open(res.mensaje, null, {
						duration: 5000,
					});
				}
			},
			(err) => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.snackBar.open(err.error.message, null, {
						duration: 5000,
					});
				}
			}
		);
	}
	/**
	 * Método encargado de enviar los datos del catalogo al servidor para ser actualizados
	 */
	public ObtenerIndicadoresEconomicosWS(data: any, esVenta: Boolean): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// const data = {'fechaInicio': '04/13/2020', 'fechaFinal': '04/13/2020', 'indicador': '318'}
		this.catalogoService.ObtenerIndicadoresEconomicosWS(data).then(
			(res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de éxito
					this.snackBar.open(res.mensaje, null, {
						duration: 5000,
					});
					(esVenta) ? this.item.valorVenta = res.data.Valor : this.item.valorCompra = res.data.Valor;
				} else {
					// Muestra el mensaje de 404
					this.snackBar.open(res.mensaje, null, {
						duration: 5000,
					});
				}
			},
			(err) => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.snackBar.open(err.error.message, null, {
						duration: 5000,
					});
				}
			}
		);
	}
	/**
	 * Método en cargado de obtener el tipo de cambio.
	 */
	public ObtenerCatalogo(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		const fecha = this.form.value.fechaIndicador;
		this.catalogoService.ObtenerIndicadoresPorDia(fecha).then(
			(res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Se asigna los datos a la variable para mostrar la lista de ítems.
					this.catalogo = res.data;
					// se almacena el estado inicial de la estructura
					this.estadoInicial = JSON.parse(
						JSON.stringify(this.catalogo)
					);
				} else {
					// Muestra el mensaje en el caso de que no se encontraran registros asociados al catálogo
					this.snackBar.open(res.mensaje, 'Sin datos.', {
						duration: 5000,
					});
				}
			},
			(err) => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.snackBar.open(err.error.message, null, {
						duration: 5000,
					});
				}
			}
		);
	}
	/**
	 * Método en cargado de seleccionar el banco entre el listado de bancosy establecer los valores en el item
	 */
	public SeleccionarBanco(_id: String): void {
		for (const item of this.itemBancos) {
			if (item._id === _id) {
				this.indicadorCompra = item.indicadorCompra;
				this.indicadorVenta = item.indicadorVenta;
				this.item.nombreBanco = item.nombreBanco;
				this.item.indicadorCompra = item.indicadorCompra;
				this.item.indicadorVenta = item.indicadorVenta;
			}
		}
	}
	/**
	 * Método en cargado de ejecutar el filtro de fechas
	 */
	public CambioFecha(): void {
		const date = this.form.value.fechaIndicador;
		this.fechaMostrar =
			date.getDate() +
			'.' +
			(date.getMonth() + 1) +
			'.' +
			date.getFullYear();
		this.ObtenerIndicadoresPorDia();
	}
	/**
	 * Método encargado de inicalizar los campos del item
	 */
	public LimpiarItem() {
		this.item = null;
		this.item = {
			_id: '',
			indicadorCompra: '',
			indicadorVenta: '',
			fechaCompra: '',
			fechaVenta: '',
			valorCompra: '',
			valorVenta: '',
			nombreBanco: '',
		};
	}
	/**
	 * Método encargado de capturar el item actual
	 * @param item representa el item seleccionado por el usuario
	 */
	public CapturarItem(item: any) {
		if (
			this.utilidadesService.DiffEstadoObjeto(
				this.estadoInicial,
				this.catalogo
			)
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
		// Carga el catálogo de tipos de cambio
		this.ObtenerCatalogo();
		// Carga el catalogo de los bancos disponibles
		this.ObtenerBancosHabilitados();
		// Establece la fecha maxima para seleccionar en los datetimepicker
		this.fechaMax = new Date();
		this.EstablecerFechaFormato();

		// this.ObtenerIndicadoresEconomicosWS();
	}

	// Métodos privados
	/**
	 * Método en cargado de obtener de establecer el formato correcto a las fechas
	 */
	private EstablecerFechas(): void {
		const fechaActualizar = new Date(this.item.fechaCompra.toString());
		/** Se verifica que si el mes es menor a 10 se agregre un 0 antes del mes*/
		if (fechaActualizar.getMonth() > 10 && fechaActualizar.getDate() > 10) {
			this.item.fechaVenta =
				fechaActualizar.getFullYear() +
				'-' +
				(fechaActualizar.getMonth() + 1) +
				'-' +
				fechaActualizar.getDate() +
				'T00:00:00-06:00';
			this.item.fechaCompra =
				fechaActualizar.getFullYear() +
				'-' +
				(fechaActualizar.getMonth() + 1) +
				'-' +
				fechaActualizar.getDate() +
				'T00:00:00-06:00';
		} else if (fechaActualizar.getMonth() < 10 && fechaActualizar.getDate() > 10) {
			this.item.fechaVenta =
				fechaActualizar.getFullYear() +
				'-0' +
				(fechaActualizar.getMonth() + 1) +
				'-' +
				fechaActualizar.getDate() +
				'T00:00:00-06:00';
			this.item.fechaCompra =
				fechaActualizar.getFullYear() +
				'-0' +
				(fechaActualizar.getMonth() + 1) +
				'-' +
				fechaActualizar.getDate() +
				'T00:00:00-06:00';
		} else if (fechaActualizar.getMonth() > 10 && fechaActualizar.getDate() < 10) {
			this.item.fechaVenta =
				fechaActualizar.getFullYear() +
				'-' +
				(fechaActualizar.getMonth() + 1) +
				'-0' +
				fechaActualizar.getDate() +
				'T00:00:00-06:00';
			this.item.fechaCompra =
				fechaActualizar.getFullYear() +
				'-' +
				(fechaActualizar.getMonth() + 1) +
				'-0' +
				fechaActualizar.getDate() +
				'T00:00:00-06:00';
		} else if (fechaActualizar.getMonth() < 10 && fechaActualizar.getDate() < 10) {
			this.item.fechaVenta =
				fechaActualizar.getFullYear() +
				'-0' +
				(fechaActualizar.getMonth() + 1) +
				'-0' +
				fechaActualizar.getDate() +
				'T00:00:00-06:00';
			this.item.fechaCompra =
				fechaActualizar.getFullYear() +
				'-0' +
				(fechaActualizar.getMonth() + 1) +
				'-0' +
				fechaActualizar.getDate() +
				'T00:00:00-06:00';

		}
	}

	/**
	 * Método encargado de filtrar los tipos de cambio por dia
	 */
	private ObtenerIndicadoresPorDia(): any {
		// Inicia la barra de progreso
		this.esCargando = true;
		const fecha = this.form.value.fechaIndicador;
		this.catalogoService.ObtenerIndicadoresPorDia(fecha).then(
			(res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// setea los datos de los bancos disponibles
					this.catalogo = res.data;
					res.data.length === 0
						? (this.esTipoCambio = true)
						: (this.esTipoCambio = false);
					// se almacena el estado inicial de la estructura
					this.estadoInicial = JSON.parse(
						JSON.stringify(this.catalogo)
					);
				} else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error', res.mensaje);
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
				}
			},
			(err) => {
				console.log(err);
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.msgBox.open(
						'ERROR',
						'Error de carga',
						err.error.message
					);
				}
				// .subscribe(res => alert(res));
			}
		);
	}
	/**
	 * Método encargado de obtener los tipos de cambio por el dia de creacion
	 */
	private ObtenerIndicadoresPorDiaCreacion(): any {
		// Inicia la barra de progreso
		this.esCargando = true;
		// const fecha = this.form.value.fecha;
		this.catalogoService.ObtenerIndicadoresPorDiaCreacion(this.fecha).then(
			(res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// setea los datos de los bancos disponibles
					this.catalogo = res.data;
					// se almacena el estado inicial de la estructura
					this.estadoInicial = JSON.parse(
						JSON.stringify(this.catalogo)
					);
				} else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error', res.mensaje);
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
				}
			},
			(err) => {
				console.log(err);
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.msgBox.open(
						'ERROR',
						'Error de carga',
						err.error.message
					);
				}
				// .subscribe(res => alert(res));
			}
		);
	}
	/**
	 * Método encargado de obtener los bancos disponibles para agregar
	 */
	private ObtenerBancosHabilitados(): any {
		// Inicia la barra de progreso
		this.esCargando = true;
		/**Se realiza el llamado al metodo del servicio */
		this.bancosService.ListBancosHabilitados().then(
			(res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// setea los datos de los bancos disponibles
					this.itemBancos = res.data;
				} else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error', res.mensaje);
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
				}
			},
			(err) => {
				console.log(err);
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.msgBox.open(
						'ERROR',
						'Error de carga',
						err.error.message
					);
				}
				// .subscribe(res => alert(res));
			}
		);
	}
	private EstablecerFechaFormato() {
		const date = new Date();
		this.fechaMostrar =
			date.getDate() +
			'.' +
			(date.getMonth() + 1) +
			'.' +
			date.getFullYear();
	}
}
