//#region Librerias
import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from "@angular/core";
import { UtilidadesService } from "../../services/utilidades.service";
import {
	FormGroup,
	Validators,
	FormBuilder,
	FormGroupDirective
} from "@angular/forms";
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { UnidadesProgramaticasService } from "app/admin/catalogos/unidades-programaticas/unidades-programaticas.service";
//#endregion

//#region Decorador
@Component({
	selector: "bitzu-info-general",
	templateUrl: "./info-general.component.html",
	styleUrls: ["./info-general.component.scss"],
})
//#endregion

//#region Clase del componente
export class InfoGeneralComponent implements OnInit {

	//#region Variables locales

	/**
	 * Se "instancia" el componente de autocompletar (en el html) para accederlo
	 * */
	@ViewChild("serviciosAutoComplete")
	serviciosAutoComplete: AutocompleteComponent;

	/**
	 * Se "instancia" el componente de autocompletar (en el html) para accederlo
	 * */
	@ViewChild("jefeAreasServiciosAutoComplete")
	jefeAreasServiciosAutoComplete: AutocompleteComponent;

	/**
	 * Variable para poder acceder al evento submit del formulario reactivo
	 */
	@ViewChild('documentForm') documentForm: FormGroupDirective;

	/**
	 * Variable temporal que maneja la lista de areas o servicios en el formulario
	 */
	public serviciosAreas: any = [
		{ _id: "1", descripcion: "Administración", idServicio: 1 },
		{ _id: "2", descripcion: "Informática", idServicio: 2 },
		{ _id: "3", descripcion: "Proveeduria", idServicio: 3 },
	];

	/**
	 * Variable que maneja el estado del estatus de la selección para el servicio o área
	 */
	public serviciosAutoCompleteStatus: boolean = false;

	/**
	 * Variable para almacenar el centro logistico
	 */
	public centroLogistico: any= {		
		idCentroLogistico: '',
		descripcion: ''
	};

	//Variable que maneja la lista de personas de personas para ser seleecionada como jefatura de area o serivicio
	public personasJefeAreasServicios: any;

	/**
	 *Variable que maneja la clase para el tema
	 */
	public temaApp: string;

	/**
	 *Variable que contiene los datos del usuario actual
	 */
	public datosUsuario: any;

	/**
	 * Variable de formulario que almacena el valor por defecto de los servicios
	 */
	private valorDefaultServicioArea: string;

	/**
   Datos de formulario de informacion general para manipular la información y se traslada a otros componentes
   */
	public frmInfoGeneral: FormGroup;

	/**
	 *Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;

	/**
	 *Variable para indicar si el formulario se debe resetar a un estado inicial
	 */
	public esEstadoInicialForm = false;

	/**
	 * Variable para recibir los datos de forma temporal y cargarlos al formgroup
	 */
	private datos: IdataModelInfoGeneral;


	//#endregion

	//#region Variables de salida
	/**
	 * Atributo de salida que retorna el conjunto de datos dados por el usuario
	 */
	@Output("validarItem")
	private validarItem: EventEmitter<IdataModelInfoGeneral> = new EventEmitter<IdataModelInfoGeneral>();

	//#endregion

	//#region Varibles de entrada 

	/**
	 * Propiedad de entrada para establecer los valores del formulario por default
	 */
	@Input()
	set Idatos(_data: IdataModelInfoGeneral) {
		if (
			typeof _data !== "undefined" &&
			_data !== null
		) {
			this.datos = _data;
		}
	}
	get Idatos() {
		return this.datos;
	}

	/**
		* Variable para poder establecer el valor defaulta del combo del autocomplete servicios 
	   **/

	@Input()
	set IvalorDefaultServicioArea(_data: string) {
		if (
			typeof _data !== "undefined" &&
			_data !== null
		) {
			this.valorDefaultServicioArea = _data;
		}
	}
	get IvalorDefaultServicioArea() {
		return this.valorDefaultServicioArea;
	}

	//#endregion

	//#region Constructor-Inicio
	constructor(
		private utilidadesService: UtilidadesService,
		private unidadesProgramaticasService: UnidadesProgramaticasService,
		private fb: FormBuilder
	) { }

	ngOnInit(): void {
		// Asigna los controles al objeto formulario
		this.frmInfoGeneral = this.fb.group({
			servicio: [""],
			jefeServicio: ["", Validators.compose([Validators.required])],
			correo: [
				{ value: "", disabled: true },
				Validators.compose([Validators.required, Validators.email]),
			],
			numtel: [
				"",
				Validators.compose([
					Validators.required,
					Validators.minLength(5),
				]),
			],
			ext: ["", Validators.compose([])],
			centroLogistico: [""]
		});
		//Se obtiene el tema
		this.temaApp = this.utilidadesService.GetTemaAplicacion();

		//Se obtiene los datos de sesion actual del usuario
		this.datosUsuario = this.utilidadesService.ListUsuarioLocal();

		//Cargar correo obtenido en el control del formulario
		this.frmInfoGeneral.controls["correo"].setValue(
			this.datosUsuario?.correo
		);

		//Cargar datos si existen previamente
		if (this.datos != undefined) {
			this.frmInfoGeneral.setValue(this.datos);
		}

		//Cargar centro de gestión
		this.cargarCentroLogistico(this.datosUsuario.unidadProgramatica_id);

		//Asignar valor al formulario del centro logistico
		this.frmInfoGeneral.controls["centroLogistico"].setValue(this.centroLogistico);

	}
	//#endregion

	//#region Metodos

/**
 * Metodo encargado de obtener el centro logistico al que pertenece la unidad programatica
 * @param id 
 */
	public cargarCentroLogistico(id: string): void {

		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.unidadesProgramaticasService.Show(id).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna las unidades programáticas a la variable general
				this.centroLogistico.descripcion = res.data.descripcionCentroLogistico;
			    this.centroLogistico.idCentroLogistico= res.data.idCentroLogistico;
			}
			else {
				// Muestra el mensaje de error
				//this.msgBox.open('ERROR', 'Error', res.mensaje);
				// .subscribe(res => alert(res));
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			//if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			// .subscribe(res => alert(res));
		});

	}


	/** Permite restablecer la vista del formulario a un estado inicial */
	public restablecerVistaFormulario(): void {
		
			this.frmInfoGeneral.reset(); // Limpia el formulario
			this.serviciosAutoComplete.Reset(); // Limpia el control de autocompletar de servicios
			this.jefeAreasServiciosAutoComplete.Reset(); // Limpia el control de autocompletar de jefes servicios
			this.esEstadoInicialForm = false; // Resetea el estado inicial del formulario
			this.frmInfoGeneral.controls["correo"].setValue(
				this.datosUsuario?.correo
			); //Cargar correo del usuario logueado.		
		
	}

	/**
	 * Método que se encarga de carga los servicios o areas del catalogo
	 * desde la BD
	 */

	public obtenerServiciosAreas(): void {
		// Inicia la barra de progreso
		this.esCargando = true;

		//Se convierte el objeto a notación JSON
		//this.serviciosAreas = JSON.stringify(datos);

		/* Se comenta codigo para posterior actualizacion del metodo a obtener los servicios por catalogo de mongo
// Se llama a la función del servicio que envia los datos al server
	this.loginService.Show(this.frmInicioSesion.value.usuario).then(
		(res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos de la respuesta
				this.unidadesProgramaticas = res.data.map(function (
					unidad
				) {
					// Se obtiene solo la lista de unidades programáticas
					return unidad.unidadProgramatica_id;
				});
				this.esUsuario = false;
				this.esUnidadProgramatica = true;
				this.esRegresar = true;
				this.esSiguienteUsuario = false;
				this.esSiguienteUP = true;
				// Muestra el control de autocompletar
				this.disableAuto = false;
			} else {
				// Muestra el mensaje de error
				this.msgBox.open(
					"ERROR",
					"Error de credenciales",
					res.mensaje
				);
				// .subscribe(res => alert(res));
				// Limpia el formulario
				this.frmInicioSesion.reset();
			}
		},
		(err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error de validación del logueo
			this.msgBox
				.open("ERROR", "Error de credenciales", err.message)
				.subscribe((res) => {
					// Lo envia a la ventana de logueo
					this.rutas.navigate(["/login"]);
				});
		}
	);
*/
	}

	//#endregion

	//#region Eventos

	/**
	 * Método que captura  valida y envia los datos del formulario hacia el padre
	 */
	public validar(): void {

		//Se valida el status del componente serviciosAutoComplete
		this.serviciosAutoCompleteStatus =
			this.serviciosAutoComplete.filtro.invalid;

		if (this.frmInfoGeneral.valid && this.serviciosAutoComplete.filtro.valid) {			 
			this.validarItem.emit(this.frmInfoGeneral.getRawValue());
		} else this.validarItem.emit(null);


	}

	/**
	 * Evento para obtener el valor que el usuario esta digitando
	 * @param item parametro que contiene el valor digitado por el usuario
	 */
	public validarItemDigitado(item: any): void {
		//Metdodo para filtrar si el item seleccionado es valido
		let pickedOrNot = this.serviciosAreas.filter(
			(alias: { descripcion: any }) => alias.descripcion === item
		);

		if (pickedOrNot.length <= 0) {
			//Item Invalido
			this.serviciosAutoComplete.filtro.setErrors({ notUnique: true });
		}

		//Actualizar variable de status
		this.serviciosAutoCompleteStatus =
			this.serviciosAutoComplete.filtro.invalid;
	}
	/**
	 * Método encargado de establecer el valor del servicio o area seleccionada por el usuario
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public seleccionarServicioArea(item: any): void {
		//Validar si la seleccion ha sido valida
		if (
			item.descripcion != null ||
			item.descripcion != undefined ||
			item.descripcion != ""
		) {
			//proporciona el valor al control servicio el indicador de valido
			this.frmInfoGeneral.controls["servicio"].setValue(item);
		}
	}
	//#endregion
}
//#endregion

//#region Interfaces
export interface IdataModelInfoGeneral {
	correo: string;
	numtel: number;
	jefeServicio: string;
	ext: string;
	servicio: {
		descripcion: string;
		idServicio: string;
		_id: string;
	}
	centroLogistico: {		
		idCentroLogistico: string;
		descripcion: string;
	}
}
//#endregion