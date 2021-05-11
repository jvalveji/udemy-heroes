// Definición typescript para el componente tipo-cambio v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Felipe Jimenez Calderon <fjimenca@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

// Se agregan los servicios a utilizar
import { TipoCambioService } from './tipo-cambio.service';
import { TiposMonedaService } from '../catalogos/tipos-moneda/tipos-moneda.service';
import { DialogService } from './../../shared/controls/dialog/dialog.service';
import { UtilidadesService } from './../../shared/services/utilidades.service';
import { DialogGraficosComponent } from '../tipo-cambio/dialog-graficos/dialog-graficos.component';

/**
 * Componente destinado al despligue y calculo de divisas según el BCCR
 */
@Component({
  selector: 'arca-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styleUrls: ['./tipo-cambio.component.scss']
})
export class TipoCambioComponent implements OnInit {
	public temaApp: string;
	/** Variable que contiene el formulario
	 */
	public form: FormGroup;
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**Variable para almacenar el valor de la compra del dolar  */
	public compraDolar = '';
	/**Variable para almacenar el valor de la venta del dolar  */
	public ventaDolar = '';
	/**Variable que establece la fecha mayor para poder seleccionar la fecha de busqueda */
	public fechaMax: Date;
	/**Variable que establece la fecha que se seleccionada */
	public fecha: String ;
	/**Variable que almacena las monedas disponibles */
	public monedas: any;
	/**Variable que almacena el resultado de la conversión de divisas */
	public resultado;
	/**Variable que almacena el resultado de los bancos disponibles para la fecha seleccionada */
	public bancos: any;
	/**Variable que almacena si existen indicadores economicos de bancos en la fecha indicada */
	public esBancosVacio = false;
	/**Módelo que almacena las variables que se le envian a la funcion de conversión de divisas */
	public cambioMoneda = {
		moneda1: 0,
		moneda2: 0,
		cantidadConvertir : 0,
		resultado: 0
	}
	/** Constructor de la clase
	 * @param tipoCambioServices Representa el servicio para el manejo de procesos del tipo de cambio
	 * @param msgBox Representa los mensaje que aparecen para el usuario
	 * @param fb Representa
	 */
  constructor(
	  private utils: UtilidadesService,
	  private tipoCambioServices: TipoCambioService,
	  private TiposMonedaServices: TiposMonedaService,
	  private msgBox: DialogService,
	  private fb: FormBuilder,
	  public dialog: MatDialog,
	  private _location: Location,
	  private route: ActivatedRoute
	  )
	  /**Se establece los valores iniciales en las monedas que corresponde a dolares y colones */
	  {
		this.form = fb.group({
			fecha: [new Date(), []],
			moneda1 : ['318', Validators.required],
			moneda2 : ['0', Validators.required],
			cantidadConvertir: [1, Validators.required],
			resultado: [0, Validators.required]
		});
		this.fechaMax = new Date();
	   }

	ngOnInit() {
		this.ObtenerIndicadoresPorDia();
		this.ObtenerMonedas();
		this.EstablecerFechaFormato();
		this.fechaMax = new Date();
		this.temaApp = this.utils.GetTemaAplicacion();
	}


	private EstablecerFechaFormato(){
		const date = new Date();
		this.fecha = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
		}
	/**
	 * Método en cargado de regresarnos a la pagina anterior
	 */
	IrPaginaAnterior(): void {
		if (this.route.snapshot.paramMap.get('token')) {
			// si tiene token debe refrescar la pagina
			location.reload();
		} else {
			this._location.back();
		}
	};

	// Metodos publicos

	 /**
	 * Método encargado de obtener la conversion de las divisas
	 */
	public ConvertirDivisa(): any {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se establecen los valores en el formulario en el item de cambioMoneda
		this.FormAModel();
		// Se llama a la función del servicio que envia los datos al server
		this.TiposMonedaServices.ConvertirDivisa(this.cambioMoneda).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// setea los datos de unidad de medida
					this.form.controls['resultado'].setValue(res.data);
				} else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error', res.mensaje);
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
				}
			},
			err => {
				console.log(err);
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.msgBox.open('ERROR', 'Error de carga', err.error.message);
				}
			}
		);
	};
	 /**
	 * Método encargado de establecer el estilo a cada una de las tarjetas de los bancos
	 */
	public ColorBancosStyle(nombreBanco: String): string {
		// Se declara la variable style para el retorno del nombre de la clase
		let stylem = '';
		// Condición que verifica si el almacenamiento actual es la que está seleccionado o no
		switch (nombreBanco){
			case 'Banco Central de Costa Rica (BCCR)':
				stylem = 'ar-tipo-cambio-card-headband--ubicacion-01';
				break;
			case 'Banco BAC':
				stylem = 'ar-tipo-cambio-card-headband--ubicacion-02';
				break;
			case 'Banco de Costa Rica(BCR)':
				stylem = 'ar-tipo-cambio-card-headband--ubicacion-12';
				break;
			case 'Banco Nacional(BN)':
				stylem = 'ar-tipo-cambio-card-headband--ubicacion-04';
				break;
			case 'Banco Popular(BP)':
				stylem = 'ar-tipo-cambio-card-headband--ubicacion-05';
				break;
			case 'Banco Cathay':
				stylem = 'ar-tipo-cambio-card-headband--ubicacion-06';
				break;
			case 'Banco Davivienda':
				stylem = 'ar-tipo-cambio-card-headband--ubicacion-07';
				break;
			case 'Banco Promerica':
				stylem = 'ar-tipo-cambio-card-headband--ubicacion-11';
				break;
			case 'Banco Scotianbank':
				stylem = 'ar-tipo-cambio-card-headband--ubicacion-09';
				break;
			default:
				stylem = 'ar-tipo-cambio-card-headband--ubicacion-10';
				break;
		}
		return stylem;
	}
	 /**
	 * Método encargado de llamar el metodo ObtenerIndicadoresPorDia con la nueva fecha seleccionada
	 */
	public CambioFecha(): void{
		const date = this.form.value.fecha;
		this.fecha = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
		this.ObtenerIndicadoresPorDia();
	}
	 /**
	 * Método encargado de establecer los valores en el modelo de cambioMoneda desde el form
	 */
	public FormAModel(): void{
		this.cambioMoneda.cantidadConvertir = this.form.value.cantidadConvertir;
		this.cambioMoneda.moneda1 = this.form.value.moneda1;
		this.cambioMoneda.moneda2 = this.form.value.moneda2;
	}
	 /**
	 * Método encargado de invertir las divisas seleccionadas
	 */
	public InvertirDivisas(): void{
		const moneda1 = this.form.value.moneda1;
		const moneda2 = this.form.value.moneda2;
		this.form.controls['moneda1'].setValue(moneda2);
		this.form.controls['moneda2'].setValue(moneda1);
	}

	/**
	 * Método en cargado de desplegar el dialogo cuando se edita un dialog
	 */
	openDialogGraficos(): void {
		const configMatDialog = {
			disableClose: false,
			panelClass: 'full-width-dialog',
			hasBackdrop: true,
			backdropClass: '',
			width: '85%',
			height: '85%',
			minWidth: '',
			minHeight: '',
			maxWidth: '100vw',
			maxHeight: '100vh',
			position: {
				top: '',
				bottom: '',
				left: '',
				right: ''
			},
			// datos enviados a la ventana
			data: {}
		};
		// Se le i

		const dialogRef = this.dialog.open(
			DialogGraficosComponent,
			configMatDialog
		);

		dialogRef.afterClosed().subscribe(result => {
			// this.ListarEstantes();
		});
	}
	// Metodos privados

	 /**
	 * Método encargado de obtener las monedas disponibles
	 */
	private ObtenerMonedas(): any {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.TiposMonedaServices.List().then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// setea los datos de unidad de medida
					this.monedas = res.data;
				} else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error', res.mensaje);
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
				}
			},
			err => {
				console.log(err);
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.msgBox.open('ERROR', 'Error de carga', err.error.message);
				}
				// .subscribe(res => alert(res));
			}
		);
	};
	/**
	 * Método encargado de obtener el valor de compray venta por dia del dolar
	 */
	private ObtenerIndicadoresPorDia(): any {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se establece en variable fecha para filtrar la bsuqueda
		const fecha = this.form.value.fecha;
		// Se llama a la función del servicio que envia los datos al server
		this.tipoCambioServices.ObtenerIndicadoresPorDia(fecha).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// setea los datos de los bancos disponibles
					this.bancos = res.data;
					(res.data.length === 0) ? this.esBancosVacio = true : this.esBancosVacio = false;
				} else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error', res.mensaje);
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
				}
			},
			err => {
				console.log(err);
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.msgBox.open('ERROR', 'Error de carga', err.error.message);
				}
			}
		);
	}
}
