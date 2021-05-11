// Definición typescript para el componente DocumentoPrinterComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Componente con las operaciones CRUD de DOCUMENTO PRINTER para consumir en el core MEAN.
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// se importan librerías de angular a utilizar
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

// Se importan los servicios a utilizar
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { UtilidadesService } from './../../../shared/services/utilidades.service';
import { DocumentoPrinterService } from './documento-printer.service';

/** Componente con las operaciones CRUD de DOCUMENTO PRINTER para consumir en el core MEAN. */
@Component({
	selector: 'arca-documento-printer',
	templateUrl: './documento-printer.component.html',
	styleUrls: ['./documento-printer.component.scss']
})
export class DocumentoPrinterComponent implements OnInit {
	/** Variable para la barra de progreso */
	public esCargando = false;
	/** Variable que almacena los datos obtenidos de los catálogos */
	public catalogo: any;
	/** Variable que contiene el filtro del texto a buscar en la lista */
	public txtFiltro: string;
	/** Variable que almacenta en nombre del catálogo. */
	public nombreCatalogo: string;
	/** Variable contiene el estado para editar ítem */
	public estado = false;
	/** representa el objeto en estado inicial antes de que el usuario manipule sus atributos */
	public estadoInicial: any = null;
	/** representa el listado de tamaños de papel disponibles */
	public optionPaper: any = ['', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'Default', 'EXECUTIVE', 'LEDGER', 'LEGAL', 'LETTER', 'TABLOID'];
	/** representa el listado de alineaciones del texto */
	public optionTextAlignment: any = ['', 'LEFT', 'CENTER', 'JUSTIFIED', 'RIGHT'];
	/** representa las opciones de barcodes disponibles */
	public optionBarcodes: any = ['', 'BARCODEQR', 'BARCODEEAN', 'BARCODE128', 'BARCODEGENERIC', 'BARCODEDATAMATRIX'];
	/** representa el item catálogo */
	public item: {
		_id: String,
		// nombre del documento
		descripcion: String,
		/** representa el nombre de la impresora */
		printerName: String,
		/**
		 * (float width, float height) en PPI
		 * A0 = new PageSize(2384, 3370),
		   A1 = new PageSize(1684, 2384),
		   A2 = new PageSize(1190, 1684),
		   A3 = new PageSize(842, 1190),
		   A4 = new PageSize(595, 842),
		   A5 = new PageSize(420, 595),
		   A6 = new PageSize(298, 420),
		   A7 = new PageSize(210, 298),
		   A8 = new PageSize(148, 210),
		   A9 = new PageSize(105, 547),
		   A10 = new PageSize(74, 105),

		   B0 = new PageSize(2834, 4008),
		   B1 = new PageSize(2004, 2834),
		   B2 = new PageSize(1417, 2004),
		   B3 = new PageSize(1000, 1417),
		   B4 = new PageSize(708, 1000),
		   B5 = new PageSize(498, 708),
		   B6 = new PageSize(354, 498),
		   B7 = new PageSize(249, 354),
		   B8 = new PageSize(175, 249),
		   B9 = new PageSize(124, 175),
		   B10 = new PageSize(88, 124),

		   LETTER = new PageSize(612, 792),
		   LEGAL = new PageSize(612, 1008),
		   TABLOID = new PageSize(792, 1224),
		   LEDGER = new PageSize(1224, 792),
		   EXECUTIVE = new PageSize(522, 756),

		   Default = A4,
		 * representa el tamaño del papel puede ser cualquiera de la siguiente lista:
		 * A0,A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,B0,B1,B2,B3,B4,B5,B6,B7,B8,B9.B10,Default,EXECUTIVE,LEDGER,LEGAL,LETTER,TABLOID
		 *
		 * ******Incluir este parámetro en "" si y solo si se desea incluir una página personalizada
		 */
		paperSize: String,
		/** representa el ancho en centímetros de la página personalizado  */
		paperSizeCustomWidth: Number,
		/** representa el alto en centímetros de la página personalizado */
		paperSizeCustomHeight: Number,
		/**
		 * representa el margen superior del documento
		 */
		topMargin: Number,
		/**
		 * representa el margen derecho del documento
		 */
		rightMargin: Number,
		/**
		 * representa el margen inferior del documento
		 */
		bottomMargin: Number,
		/**
		 * representa el margen inferior del documento
		 */
		leftMargin: Number,
		// alineación del texto LEFT, CENTER, JUSTIFIED, RIGHT
		textAlignment: String,
		/**
		 * representa las líneas de texto del documento
		 */
		lineas: Array<{
			/**
			 * representa el texto de la línea
			 */
			text: String,
			/**
			 * representa el tamaño del texto de la línea
			 */
			fontSize: Number,
			/**
			 * representa bandera para indicar si se debe subrayar el texto
			 */
			underline: Boolean,
			/**
			 * representa bandera para indicar si se debe ser negrita el texto
			 */
			bold: Boolean,
			/**
			 * representa bandera para indicar si se debe ser italic el texto
			 */
			italic: Boolean,
			/**
			 * representa margen izquierdo
			 */
			marginLetf: Number


		}>,

		/**
		 * representa los datos del barcode, se cuenta con las siguientes opciones para tipos
		 * BARCODEQR, BARCODEEAN, BARCODE128, BARCODEGENERIC, BARCODEDATAMATRIX
		 */
		barcode: {
			/** texto a imprimir */
			text: String,
			/** tipo de barcode */
			type: String,
			/** ancho del barcode */
			width: Number,
			/** alto del barcode */
			height: Number
		},
		estado: Boolean
	} = {
			_id: '',
			descripcion: '',
			printerName: '',
			paperSize: '',
			paperSizeCustomWidth: 10,
			paperSizeCustomHeight: 15,
			topMargin: 1,
			rightMargin: 1,
			bottomMargin: 1,
			leftMargin: 1,
			textAlignment: '',
			lineas: [],
			barcode: {
				text: '',
				type: '',
				width: 0,
				height: 0
			},
			estado: true,
		};
	/** representa bandera para indicar si el formulario se encuetra en edición */
	public esEdicion = false;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param catalogoService Variable que representa al servicio del catálogo de nutrición correspondiente a este componente
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param utilidadesService Representa servicio de utilidades del proyecto base
	 */
	constructor(private _location: Location,
		private catalogoService: DocumentoPrinterService,
		private msgBox: DialogService,
		private snackBar: MatSnackBar,
		public utilidadesService: UtilidadesService
	) { }

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior y comprueba si el usuario modifico atributos
	 */
	public IrPaginaAnterior(): void {
		// Condición que verificar si hay cambios en el objeto original
		if (this.utilidadesService.DiffEstadoObjeto(this.estadoInicial, this.catalogo)) {
			// Inicia la barra de progreso
			this.esCargando = true;
			this.msgBox
				.open('QUESTION', 'Hay cambios sin guardar', '¿Seguro que desea salir?')
				.subscribe(res => {
					if (res === 'YES') {
						// Retorna a la página anterior
						this._location.back();
					}
					else {
						// Oculta la barra de progreso en caso de error
						this.esCargando = false;
					}
				});
		}
		else {
			// Retorna a la página anterior
			this._location.back();
		}
	}

	/**
	  * Método encargado de agregar un nuevo item al arreglo items del catálogo
	  */
	public AgregarItem(): void {
		this.esEdicion = true;
		if (this.item.descripcion === null || this.item.descripcion === undefined || this.item.descripcion === '') {
			// Muestra el mensaje de error
			this.snackBar.open('Debe completar los datos, del nuevo registro', null, {
				duration: 5000
			});
		}
		else {
			// Inicia la barra de progreso
			this.esCargando = true;
			// Se llama a la función del servicio que envia los datos al server
			this.catalogoService.Create(this.item).then((res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de éxito
					this.msgBox.open('INFO', 'Cátalogo', res.mensaje);
					this.ObtenerCatalogo();
					this.esEdicion = false;
					this.LimpiarItem();
				}
				else {
					// Muestra el mensaje de 404
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});

				}

			}, (err) => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) { this.snackBar.open(err.error.message, null, { duration: 5000 }); }
			});
		}
	};

	/**
	 * método encargado de enviar los datos del catalogo al servidor para ser actualizados
	 */
	public ActualizarCatalogo(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.Update(this.item).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
				this.estadoInicial = JSON.parse(JSON.stringify(this.catalogo));
			}
			else {
				// Muestra el mensaje de 404
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
			}

		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.snackBar.open(err.error.message, null, { duration: 5000 }); }
		});
	}
	// Métodos privados

	/**
	 * Método en cargado de obtener las clasificaciones de las recetas.
	 */
	private ObtenerCatalogo(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.List().then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Se asigna los datos a la variable para mostrar la lista de ítems.
					this.catalogo = res.data;
					// se almacena el estado inicial de la estructura
					this.estadoInicial = JSON.parse(JSON.stringify(this.catalogo));

				} else {
					// Muestra el mensaje en el caso de que no se encontraran registros asociados al catálogo
					this.snackBar.open(res.mensaje, 'Sin datos.', {
						duration: 5000
					});
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) { this.snackBar.open(err.error.message, null, { duration: 5000 }); }

			}
		);
	}

	/** método encargado de limpiar el item */
	public LimpiarItem() {
		this.item = null;
		this.item = {
			_id: '',
			descripcion: '',
			printerName: '',
			paperSize: '',
			paperSizeCustomWidth: 10,
			paperSizeCustomHeight: 15,
			topMargin: 1,
			rightMargin: 1,
			bottomMargin: 1,
			leftMargin: 1,
			textAlignment: '',
			lineas: [],
			barcode: {
				text: '',
				type: '',
				width: 0,
				height: 0
			},
			estado: true,
		};
	}
	/** método encargado de capturar el item actual
	 * @param item representa el item seleccionado por el usuario
	 */
	public CapturarItem(item: any) {
		if (this.utilidadesService.DiffEstadoObjeto(this.estadoInicial, this.catalogo)) {
			this.ActualizarCatalogo();
		} else {
			this.item = item;
		}
	}

	/** método encargado de capturar el item actual
	   * @param item representa el item seleccionado por el usuario
	   */
	public AgregarLinea(item: any) {
		item.lineas.push({

			text: '',

			fontSize: 6,

			underline: false,

			bold: false,

			italic: false,

			marginLetf: 0


		});
	};

	/**
	 * Método para eliminar líneas de impresión
	 * @param item representa valor del registro a eliminar
	 */
	private EliminarLineaImpresion(item: any): void {
		const index = this.item.lineas.indexOf(item);
		if (index > -1) {
			this.item.lineas.splice(index, 1);
		}
	}

	/** carga inicial */
	ngOnInit() {
		// Carga el catálogo
		this.ObtenerCatalogo();
		// se le asigna el nombre del catálogo
		this.nombreCatalogo = 'Plantillas para impresión servicio arcaPrinters';
	}
}
