// Definición para el fichero PrinterConfigComponent.ts v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

import { PrinterService } from './../../../shared/controls/printer/printer.service';
import { PrinterUrlParams } from './../../../shared/controls/printer/printer-url-params';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_printer_config'])
/** Componente encargado de establecer los parámetros de impresión local */
@Component({
	selector: 'arca-printer-config',
	templateUrl: './printer-config.component.html',
	styleUrls: ['./printer-config.component.scss']
})
export class PrinterConfigComponent implements OnInit {

	/**  Variable para el manejo de la barra de progreso */
	public esCargando = false;
	/**  Bandera para habilitar área de ingreso de datos */
	public areaIngresoDatos = false;
	/** representa el listado de propiedades de las impresoras locales */
	public propiedades: any = [];
	/** bandera para el manejo de edición de propiedades */
	public esEditar = false;
	/** manejo del listado de impresoras locales */
	public optionImpresoras: any = [];
	/** representa la estructura de los parámetros de impresión vía url */
	public printerUrlParams: PrinterUrlParams = new PrinterUrlParams();
	/** lista de nombres de impresora por tipo de impresión */
	public parametrosImpresion: any = [];
	/** lista de parámetros con formato json */
	public listaParametrosJson: Array<{ descripcion: String, valor: String }> = [];
	/** representa el item actual seleccionado */
	public item: { descripcion: String, valor: String };

	/**
	 * * Constructor de la clase
	 * @param snackBar para mensajes al usuario en el pie de página
	 * @param printerService Representa el servicio de impresoras
	 * @param _location Parametro que representa el servicio de localización de rutas
	 */
	constructor(
		public snackBar: MatSnackBar,
		private printerService: PrinterService,
		private _location: Location
	) { }

	/**
	*  Método se encarga de obtener los datos con los nombres de las impresoras del usuario local
	*/
	public ObtenerParametrosImpresion(): void {
		this.listaParametrosJson = [];
		this.printerService.ParamPrintList().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.parametrosImpresion = res.data;
				// se obtienen los nombres de los parámetros
				const keys = Object.keys(this.parametrosImpresion);
				// se recorren los parámetros con el fin de crear la estructura json para el listado de la vista
				keys.map(element => {
					this.listaParametrosJson.push({ descripcion: element, valor: this.parametrosImpresion[element] });
				});
			} else {
				// Muestra el mensaje de respuesta
				this.snackBar.open(res.mensaje, '', {
					duration: 5000
				});
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) {
				// this.msgBox.open('ERROR', 'Usuario sin permisos de impresión', err.error.message)
			};
		});
	};

	/**
  	*  Método se encarga de obtener lista de las impresoras del usuario local
  	*/
	public ObtenerListaImpresorasLocales(): void {

		this.printerService.PrintList().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.optionImpresoras = res.data;
			} else {
				// Muestra el mensaje de respuesta
				this.snackBar.open(res.mensaje, '', {
					duration: 5000
				});
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) {
				// this.msgBox.open('ERROR', 'Usuario sin permisos de impresión', err.error.message)
			};
		});
	};

	/**
  	* Método encargado de redirigir al usuario a la vista anterior y comprueba si el usuario modifico atributos
  	*/
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	/**
	 * método se encarga de establecer la vista en edición o nuevo elemento
	 * @param item representa el parámetro elegido por el usuario
	 */
	public Editar(item: any): void {
		if (item !== null && item !== undefined) {
			this.areaIngresoDatos = !this.areaIngresoDatos;
			this.esEditar = true;
			this.item = item;

			// se cambia el estado de mostrar información del área específica
			item.mostrarInformacion = true;
		}
		else {
			this.areaIngresoDatos = true;
			this.LimpiarDatos();
			this.esEditar = false;
		}
	};

	/**
	* Método se encarga de limpiar los datos del formulario
	*/
	public LimpiarDatos(): void {
		this.item = { descripcion: '', valor: '' };
	};

	/** Método encargado de reestablecer los valores del listado de parámetros */
	public Cancelar(): void {
		this.areaIngresoDatos = false;
		this.LimpiarDatos();
		this.esEditar = false;
	};

	/**
	* Método encargado de gestionar guardar cambios de solicitud de dietas
	*/
	public Guardar(): void {
		// se valida si existen datos incompletos, si es así no se permite la edición
		if (!this.ComprobarFormulario()) {
			// Muestra el mensaje de error
			this.snackBar.open(
				'Complete los datos del formulario.',
				'',
				{
					duration: 5000
				}
			);
		} else {
			this.Create();
		}
	};

	/**
	 * Método encargado de crear/actualizar parámetros de impresión
	 */
	public Create(): void {
		// inicia barra de progreso
		this.esCargando = true;
		// se asignan los datos editados o agregados
		this.parametrosImpresion[this.item.descripcion.toString()] = this.item.valor;

		// se procede a guardar o actualizar los parámetros locales
		this.printerService.ParamPrintCreate(this.parametrosImpresion).then(
			res => {
				if (res.exito) {
					this.esCargando = false;
					// en caso de éxito
					this.snackBar.open('Registro agregado con éxito', '', {
						duration: 3000
					});
				}
				else {
					// en caso de que no se haya agregado el registro
					this.snackBar.open('Registro no agregado', '', {
						duration: 3000
					});
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
				}
				// cierra el formulario
				this.ObtenerParametrosImpresion();
				this.Cancelar();
			},
			error => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje de error
				this.snackBar.open(
					error.error.mensaje,
					'',
					{
						duration: 5000
					}
				);
			}
		);
	};

	/** Método se encarga de evaluar si el formulario es valido */
	public ComprobarFormulario(): Boolean {
		let esValido = null;
		// comprueba descripcion
		esValido = (this.item.descripcion === null || this.item.descripcion === undefined || this.item.descripcion === '') ? false : true;
		// comprueba valor
		esValido = (this.item.valor === null || this.item.valor === undefined || this.item.valor === '') ? false : true;

		// devuelve la respuesta
		return esValido;
	};

	/** Inicialización de variables y métodos */
	public ngOnInit(): void {
		// se obtiene la lista de parámetros de impresión
		this.ObtenerParametrosImpresion();
		// se obtiene el listado de impresoras locales
		this.ObtenerListaImpresorasLocales();
	}
}
