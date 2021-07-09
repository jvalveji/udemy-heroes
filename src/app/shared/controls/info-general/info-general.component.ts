//#region Librerias
import {
	Component,	
	EventEmitter,
	OnInit,
	Output,
	ViewChild,
} from "@angular/core";
import { UtilidadesService } from "../../services/utilidades.service";
import {
	FormGroup,
	Validators,
	FormBuilder	
} from "@angular/forms";
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
//#endregion

@Component({
	selector: "bitzu-info-general",
	templateUrl: "./info-general.component.html",
	styleUrls: ["./info-general.component.scss"],
})

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

	//Variable que maneja la lista de personas de personas para ser seleecionada como jefatura de area o serivicio
	public personasJefeAreasServicios: any;

	/**
	 *Variable que maneja la clase para el tema
	 */
	public temaApp: string;

	/**
	 *Variable que contiene los datos del usuario actual
	 */
	private datosUsuario: any;

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

	dataModel: any; //active model

	//#endregion

	//#region Variables de salida
	/**
	 * Atributo de salida que retorna el conjunto de datos dados por el usuario
	 */
	@Output("validarItem")
	private validarItem: EventEmitter<any> = new EventEmitter<any>();

	//#endregion

	//#region Constructor-Inicio
	constructor(
		private utilidadesService: UtilidadesService,
		private fb: FormBuilder
	) {}

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
		});
		//Se obtiene el tema
		this.temaApp = this.utilidadesService.GetTemaAplicacion();
		
		//Se obtiene los datos de sesion actual del usuario
		this.datosUsuario = this.utilidadesService.ListUsuarioLocal();

		//Cargar correo obtenido en el control del formulario
		this.frmInfoGeneral.controls["correo"].setValue(
			this.datosUsuario?.correo
		);

		//Subscripción al metodo valueChanges del formulario, que permite obtener los datos propiamente
		this.frmInfoGeneral.valueChanges.subscribe((data) => {
			this.dataModel = data;
		});
	}
	//#endregion

	//#region Metodos
	/** Permite restablecer la vista del formulario a un estado inicial */
	public restablecerVistaFormulario(): void {
		if (this.esEstadoInicialForm) {
			this.frmInfoGeneral.reset(); // Limpia el formulario
			this.serviciosAutoComplete.Reset(); // Limpia el control de autocompletar de servicios
			this.jefeAreasServiciosAutoComplete.Reset(); // Limpia el control de autocompletar de jefes servicios
			this.esEstadoInicialForm = false; // Resetea el estado inicial del formulario
			this.frmInfoGeneral.controls["correo"].setValue(
				this.datosUsuario?.correo
			); //Cargar correo del usuario logueado.		
		}
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
	 * Método que captura  valida y envia los datos del formulario de
	 */
	public validar(): void {
		//Se valida el status del componente serviciosAutoComplete
		this.serviciosAutoCompleteStatus =
			this.serviciosAutoComplete.filtro.invalid;

		if (this.frmInfoGeneral.valid) {
			this.validarItem.emit(this.dataModel);
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
