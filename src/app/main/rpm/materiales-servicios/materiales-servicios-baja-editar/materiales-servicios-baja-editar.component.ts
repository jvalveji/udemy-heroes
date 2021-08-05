// Definición typescript para el componente materiales-servicios-baja-editar.component v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
	Inject,
	Optional,
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
	FormsModule,
	ReactiveFormsModule,
} from "@angular/forms";
import { DialogService } from "app/shared/controls/dialog/dialog.service";
import { compact } from "lodash";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: "bitzu-materiales-servicios-baja-editar",
	templateUrl: "./materiales-servicios-baja-editar.component.html",
	styleUrls: ["./materiales-servicios-baja-editar.component.scss"],
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
export class MaterialesServiciosBajaEditarComponent implements OnInit {
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
	public frmBajaMaterial: FormGroup;

	/**
	 *Variable para indicar si el formulario se debe resetar a un estado inicial
	 */
	public esEstadoInicialForm = false;

	/**
	 * Variable para recibir los datos de forma temporal y cargarlos al formgroup
	 */
	private datos: IdataModelBajaMat;

	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;

	/**
	 * Datos obtenidos del formulario info general
	 */
	public dataInfoGeneral: IdataModelInfoGeneral;

	/**
	 * Variable que contiene el valor por defecto del servicio
	 */
	public valorDefaultServicioArea: string;

	/**
	 * Propiedad decorativa para acceder al componente desde el HTML
	 */
	@ViewChild("infoGeneralService")
	infoGeneralService: InfoGeneralComponent;

	/**
	 * Variable para poder acceder al evento submit del formulario reactivo
	 */
	@ViewChild("documentFormBaja")
	documentFormBaja: FormGroupDirective;

	/**
	 * Atributo de salida que retorna el conjunto de datos dados por el usuario
	 */
	@Output("validarItem")
	private validarItem: EventEmitter<IdataModelInfoGeneral> = new EventEmitter<IdataModelInfoGeneral>();

	constructor(
		private utilidadesService: UtilidadesService,
		private fb: FormBuilder,
		private msgBox: DialogService,
		public dialogRef: MatDialogRef<MaterialesServiciosBajaEditarComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.frmBajaMaterial = this.fb.group({
			descMatServ: [null, Validators.required],
			detBaja: [null, Validators.required],
			descPropuesta: [null, Validators.required],
			JustBaja: [null, Validators.required],
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
			this.frmBajaMaterial.reset(); // Limpia el formulario
			this.esEstadoInicialForm = false; // Resetea el estado inicial del formulario
		}
	}

	/**
	 * Evento que dispara submit para el formulario hijo (child)
	 */
	public validarInfoGeneral() {
		this.infoGeneralService.documentForm.onSubmit(undefined);
	}

	/**
	 * Evento que viene del componente hijo info general, con el conjunto de datos valido
	 * @param dataModel Modelo de datos
	 */
	public obtenerDatosInfoGeneral(dataModel: IdataModelInfoGeneral): void {
		if (dataModel != undefined) {
			this.dataInfoGeneral = dataModel;
			this.valorDefaultServicioArea = this.dataInfoGeneral.servicio._id;
			this.mostrarSig = false;
			this.mostrarAnt = true;
			this.guardarInfo = true;
		}
	}

	//Funcion validar campos texto y materiales
	public validar(): void {
		if (this.frmBajaMaterial.valid) {
			console.log("valido");
		} else {
			console.log("invalido");
		}
	}

	//Funcion validar campos texto y materiales
	public guardar(): void {
		this.documentFormBaja.onSubmit(undefined);
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
					this.frmBajaMaterial.reset();
					// Deshabilita el modo edición
					this.esEstadoInicialForm = false;
				} else {
					this.infoGeneralService.restablecerVistaFormulario();
				}
			});
	}

	/**
	 * Funcion para cerrar dialogo
	 */
	public CerrarDialogo(): void {
		this.msgBox
			.open(
				"QUESTION",
				"Precaución",
				"¿Esta seguro de cerrar la ventana ?"
			)
			.subscribe((res) => {
				if (res === "YES") {
					// Cierra el dialogo completo
					this.dialogRef.close();
				}
			});
	}

	ngOnInit(): void {
		//Se obtiene el tema
		this.temaApp = this.utilidadesService.GetTemaAplicacion();
	}
}

//Interfaz de Variables
export interface IdataModelBajaMat {
	descMatServ: string;
	detBaja: string;
	descPropuesta: string;
	JustBaja: string;
}
