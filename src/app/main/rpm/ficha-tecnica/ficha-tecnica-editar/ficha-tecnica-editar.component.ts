import {
	Component,
	EventEmitter,
	OnInit,
	Output,
	ViewChild,
} from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";
import { UtilidadesService } from "app/shared/services/utilidades.service";
import {
	IdataModelInfoGeneral,
	InfoGeneralComponent,
} from "app/shared/controls/info-general/info-general.component";
import {
	FormGroup,
	Validators,
	FormBuilder,
	FormGroupDirective,
} from "@angular/forms";
import { DialogService } from "app/shared/controls/dialog/dialog.service";

@Component({
	selector: "bitzu-ficha-tecnica-editar",
	templateUrl: "./ficha-tecnica-editar.component.html",
	styleUrls: ["./ficha-tecnica-editar.component.scss"],
	animations: [
		// Evento que se ejecuta la transición 'fade in o fade out' para los componentes que tienen como identificador 'apps'
		trigger("apps", [
			// Transición de cualquier identificador a 'fadeIn'
			transition("* => fadeIn", [
				style({ opacity: 0 }),
				animate(1000, style({ opacity: 1 })),
			]),
			// Transición de cualquier identificador a 'fadeOut'
			transition("* => fadeOut", [animate(1000, style({ opacity: 0 }))]),
		]),
	],
})
export class FichaTecnicaEditarComponent implements OnInit {
	/**
	 * Variable que maneja la clase para el tema
	 */
	public temaApp: string;

	/**
	 * Variable que maneja los eventos de siguiente y anterior entre pantallas
	 */
	public mostrarSig: boolean = true;
	public mostrarAnt: boolean = false;
	public guardarInfo: boolean = false;

	/**
 Datos de formulario de informacion general para manipular la información y se traslada a otros componentes
 */
	public frmfichaTecnica: FormGroup;

	/**
	 *Variable para indicar si el formulario se debe resetar a un estado inicial
	 */
	public esEstadoInicialForm = false;

	/**
	 * Variable para recibir los datos de forma temporal y cargarlos al formgroup
	 */
	private datos: IdataModelFichaTecnica;

	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;

	/**
	 * Variable que contiene el valor por defecto del servicio
	 */
	public valorDefaultServicioArea: string;

	/**
	 * Variable para poder acceder al evento submit del formulario reactivo
	 */
	@ViewChild("documentFormFicha")
	documentFormFicha: FormGroupDirective;

	/**
	 * Variable temporal que maneja la lista de areas o servicios en el formulario
	 */
	public tipoMoneda: any = [
		{ _id: "1", descripcion: "Colones", idServicio: 1 },
		{ _id: "2", descripcion: "Dólares", idServicio: 2 },
		{ _id: "3", descripcion: "Euros", idServicio: 3 },
	];

	constructor(
		private utilidadesService: UtilidadesService,
		private fb: FormBuilder,
		private msgBox: DialogService
	) {
		this.frmfichaTecnica = this.fb.group({
			descMatServ: [null, Validators.required],
			estMatServ: [null, Validators.required],
			medMatServ: [null, Validators.required],
			despMatServ: [null, Validators.required],
			otrundMatServ: [null, Validators.required],
			tipMatServ: [null, Validators.required],
			promdMatServ: [null, Validators.required],
			valMatServ: [null, Validators.required],
			monedaMatServ: [null, Validators.required],
			fichaMatServ: [null, Validators.required],
			JustAlta: [null, Validators.required],
		});
	}

	public validarInfo() {
		this.mostrarSig = false;
		this.mostrarAnt = true;
		this.guardarInfo = true;
		// Inicia la barra de progreso
		//this.esCargando = true;
	}

	public atras() {
		this.mostrarSig = true;
		this.mostrarAnt = false;
		this.guardarInfo = false;
		// Inicia la barra de progreso
		//this.esCargando = true;
	}

	/** Permite restablecer la vista del formulario a un estado inicial */
	public restablecerVistaFormulario(): void {
		if (this.esEstadoInicialForm) {
			this.frmfichaTecnica.reset(); // Limpia el formulario
			this.esEstadoInicialForm = false; // Resetea el estado inicial del formulario
		}
	}

	//Funcion validar campos texto y materiales
	public validar(): void {
		if (this.frmfichaTecnica.valid) {
			console.log("valido");
		} else {
			console.log("invalido");
		}
	}

	//Funcion validar campos texto y materiales
	public guardar(): void {
		this.documentFormFicha.onSubmit(undefined);
	}

	public limpiar(): void {
		this.msgBox
			.open(
				"QUESTION",
				"Precaución",
				"¿Esta seguro de limpiar los campos?"
			)
			.subscribe((res) => {
				if (res === "YES") {
					// Limpiar el formulario
					this.frmfichaTecnica.reset();
					// Deshabilita el modo edición
					this.esEstadoInicialForm = false;
				}
				//else {
				//	this.infoGeneralService.restablecerVistaFormulario();
				//}
			});
	}

	ngOnInit(): void {
		//Se obtiene el tema
		this.temaApp = this.utilidadesService.GetTemaAplicacion();
	}
}

//Interfaz de Variables
export interface IdataModelFichaTecnica {
	descMatServ: string;
	estMatServ: string;
	medMatServ: string;
	despMatServ: string;
	otrundMatServ: string;
	tipMatServ: string;
	promdMatServ: number;
	valMatServ: number;
	monedaMatServ: string;
	fichaMatServ: string;
	JustAlta: string;
}
