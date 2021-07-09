// Definición typescript para el servicio AseguradosSearchComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (20-06-2020)  Ing. Dagoberto Gómez Jiménez

// Se importan las librerías a utilizar
import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

// Se importan los servicios a utilizar
import { TiposIdentificacionService } from './../../../admin/catalogos/tipos-identificacion/tipos-identificacion.service';
import { AseguradosSearchService } from './asegurados-search.service';
import { DialogService } from '../dialog/dialog.service';

/** Control para la búsqueda de asegurados mediante el Web Services de SIAC */
@Component({
	selector: 'arca-asegurados-search',
	templateUrl: './asegurados-search.component.html',
	styleUrls: ['./asegurados-search.component.scss'],
	providers: [AseguradosSearchService]
})
export class AseguradosSearchComponent implements OnInit {
	/**  Variable para el manejo de la barra de progreso */
	public esCargando = false;
	/**  Variable que representa el control del tipo de identificación 0 Cédula identidad registro civil, 7 Extranjero con identificación de la CCSS, 6 identificación temporal/interno */
	public tipoIdentificacion = 0;
	/**  Variable que contiene las opciones para tipo de identificacion */
	public optionTipoIdentificacion: any = [];
	/** Variable para almacenar los datos del paciente consultado, se incluyen estos campos para poder referenciarlos*/
	public asegurados: Array<{ identificacion: string, nombrePaciente: string, apellidoUnoPaciente: string, apellidoDosPaciente: string }> = [];
	/** Variable para el manejo del sexo para la consulta por filtros */
	public sexo = 'M';
	/**   representa el array con las opciones ingresadas por el usuario para la búsqueda */
	public filtros: any = [];
	/** Referencia a elemento input del chipset del DOM */
	@ViewChild('filtrosInput') filtrosInput: ElementRef<HTMLInputElement>;
	/** Variable que representa el input de entrada del chipset */
	public filtro = '';
	/** Variable que representa el placeholder del input de búsqueda */
	public dscFiltro = 'Buscar por cédula o nombre';
	/** Variable para habilitar area de información de la busqueda */
	public areaInfoBusqueda = false;

	/**
	 * Atributo de salida que retorna el item seleccionado por el usuario
	 */
	@Output('ItemSeleccionado')
	private ItemSeleccionado: EventEmitter<any> = new EventEmitter<any>();

	/**
   * constructor del componente
   * @param _location Parametro que representa el servicio de localización de rutas
   * @param msgBox para el despliegue de mensajes tipo modal
   * @param snackBar para mensajes al usuario en el pie de página
   * @param tiposIdentificacionService acceso a métodos del servicio de catálogo de tipos de identificación del core
   * @param aseguradosSearchService acceso a los métodos del servicio par consultas SIAC
   */
	constructor(
		private _location: Location,
		private msgBox: DialogService,
		public snackBar: MatSnackBar,
		private tiposIdentificacionService: TiposIdentificacionService,
		private aseguradosSearchService: AseguradosSearchService,
	) { }

	// Métodos públicos

	/**
	  * Método para capturar el tipo de identificación elegido por el usuario
	  * @param item representa el objeto con la información del tipo de asegurado
	  */
	public SeleccionarTipoId(item: any): void {
		this.tipoIdentificacion = item.idSIAH;
	};

	/**
	* Método se encarga de reestabler los campos del formulario para búsqueda de pacientes
	*/
	public LimpiarBusqueda(): void {
		this.filtros = [];
		this.filtro = '';
		this.asegurados = [];
		this.areaInfoBusqueda = false;
		this.dscFiltro = 'Buscar por cédula o nombre';
	}

	/**
	* Método se encarga de reestabler los campos del filtro para búsqueda de pacientes
	*/
	public LimpiarFiltros(): void {
		this.filtros = [];
		this.filtro = '';
		this.dscFiltro = 'Buscar por cédula o nombre';
	}
	/**
	 * Método utilizado para agregar elementos tipo filtros de búsqueda
	 * @param event representa el evento del elemento input para agregar filtros mediante chipset
	 */
	public addFiltro(event: MatChipInputEvent): void {
		const value = event.value;

		// agregar el filtro de búsqueda
		if ((value || '').trim() && this.filtros.length < 3) {
			this.filtros.push(value.trim());
			// verifica si es un numero de identificación
			if (this.filtros[0].match(/^[0-9]+$/) != null && this.filtros.length === 1) {
				// se consulta el paciente por identificación
				this.Buscar();
			}
			else {
				this.dscFiltro = 'Agregue Apellido'
			}
			if (this.filtros.length === 3) {
				// se consulta el paciente por identificación
				this.Buscar();
			}
		}
		// limpia el input de ingreso de filtros
		this.filtro = '';
	}

	/**
	 * Método encargado de gestionar las peticiones de búsqueda
	 */
	public Buscar(): void {
		if (this.filtros.length > 0) {
			switch (this.filtros.length) {
				case 1: {
					// valida que el numero de identificación solo contenga numeros
					if (this.filtros[0].match(/^[0-9]+$/) != null) {
						// se consulta el paciente por identificación
						this.ConsultarPacienteID(this.filtros[0]);
					}
					break;
				}
				default: {
					this.ConsultarPacienteFiltro();
					break;
				}
			}
		}
	};

	/**
	* Método que se encarga de carga de los datos del paciente desde el SIAC
	* @param identificacion representa el numero de identificacion ingresado por el usuario
	*/
	public ConsultarPacienteID(identificacion: string): void {
		if (this.tipoIdentificacion === null) {
			return;
		}
		else {
			// Se almacenan los datos en una variable
			const credenciales: any = {
				tipoIdentificacion: this.tipoIdentificacion,
				identificacion: identificacion
			};
			// Inicia la barra de progreso en caso de latencia
			this.esCargando = true;
			// se borran elementos de búsquedas anteriores
			this.asegurados = [];
			/**
			 * Se llama a la función del servicio que envia los datos de consulta al server
			 * @param credenciales representa tipoIdentificacion(valores 0, 1 ó 6) e identificación paciente a consultar
			 */
			this.aseguradosSearchService.showByID(credenciales).then(
				res => {
					// Oculta la barra de progreso una vez obtenida la respuesta
					this.esCargando = false;
					// Recibe la respuesta
					if (res.exito) {
						// Inicializa el arreglo de datos del paciente consultado
						this.asegurados.push(res.data);
						// se habilita el área de resultados de búsqueda
						this.areaInfoBusqueda = true;
						// se borran los filtros de búsqueda
						this.LimpiarFiltros();

					} else {
						// en caso de no encontrar registros le avisa al usuario
						this.snackBar.open(res.mensaje, null, { duration: 5000 });
					}
				},
				err => {
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
					// Muestra el mensaje de error
					this.snackBar.open(err.mensaje, null, { duration: 5000 }
					);
				}
			);
		}
	};

	/**
	* Método que se encarga de carga de los datos del paciente desde el SIAC
	*/
	public ConsultarPacienteFiltro(): void {

		if (
			this.tipoIdentificacion === null
		) {
			return;
		}
		// se borran elementos de búsquedas anteriores
		this.asegurados = [];

		// Se almacenan los datos en una variable
		const credenciales: any = {
			tipoIdentificacion: this.tipoIdentificacion,
			nombre: this.filtros[0],
			primerApellido: this.filtros[1],
			segundoApellido: (this.filtros[2] ? this.filtros[2] : 'null'),
			sexo: this.sexo
		};
		// Inicia la barra de progreso en caso de latencia
		this.esCargando = true;

		/**
		 * Se llama a la función del servicio que envia los datos de consulta al server
		 * @param credenciales representa tipoIdentificacion(valores 0, 1 ó 6) e identificación paciente a consultar
		 */
		this.aseguradosSearchService.showByFilter(credenciales).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					this.asegurados = res.data;
					// se habilita el área de resultados de búsqueda
					this.areaInfoBusqueda = true;
					// se borran los filtros de búsqueda
					this.LimpiarFiltros();

				} else {
					// en caso de no encontrar registros le avisa al usuario
					this.snackBar.open(res.mensaje, null, { duration: 5000 });
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje de error
				this.snackBar.open(err.mensaje, null, { duration: 5000 }
				);
			}
		);
	};

	/**
	* Método se encarga de cargar los tipos de identificación desde los catálogos generales
	*/
	public ObtenerTiposID(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.tiposIdentificacionService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.optionTipoIdentificacion = res.data;
			}
			else {
				// Muestra el mensaje de que no se encontrarón registros en base de datos
				this.snackBar.open(res.mensaje, 'No se encontrarón registros para los tipos de identificación.', {
					duration: 5000
				});
			}

		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
		});
	};

	/**
	 *  Método se encarga de emitir el asegurado seleccionado al componente padre
	 * @param asegurado representa el asegurado en formato json seleccionado por el usuario
	 */
	public SeleccionarAsegurado(asegurado: any) {
		// se emite la respuesta al componente padre
		this.ItemSeleccionado.emit(
			asegurado
		);
	}

	/**
	*  Método se encarga de cambiar el valor de sexo el cual representa el genero de paciente a buscar
	*/
	public CambiarGenero(): void {
		switch (this.sexo) {
			case 'M':
				this.sexo = 'F'
				break;

			case 'F':
				this.sexo = 'I'
				break;

			case 'I':
				this.sexo = 'M'
				break;

			default:
				this.sexo = 'M'
				break;
		}
	}

	/**
  * Método encargado de redirigir al usuario a la vista anterior y comprueba si el usuario modifico atributos
  */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();

	}
	/**
	 * inicialización del componente
	 */
	public ngOnInit(): void {
		// obtener tipos de identificación del catálogo general
		this.ObtenerTiposID();
		// se inicializan los atributos del formulario para búsqueda de pacientes
		this.tipoIdentificacion = 0;
	};
}
