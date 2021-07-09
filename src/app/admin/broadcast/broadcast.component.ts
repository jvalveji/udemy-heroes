// Definición typescript para el componente BroadcastComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

// Se importan los servicios a utilizar
import { UtilidadesService } from './../../shared/services/utilidades.service';
import { DialogService } from './../../shared/controls/dialog/dialog.service';
import { BroadcastService } from './broadcast.service';
import { UnidadesProgramaticasService } from '../catalogos/unidades-programaticas/unidades-programaticas.service';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../shared/decorators/activate.decorator';

// Se importan los componentes a utilizar
import { DateTimePickerComponent } from './../../shared/controls/date-time-picker/date-time-picker.component';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_broadcast'])

/**
 * Componente destinado al despligue y manejo de los mensajes de sistema tipo broadcast
 */
@Component({
	selector: 'arca-broadcast',
	templateUrl: './broadcast.component.html',
	styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {
	/**
	 * Se "instancia" el componente datetime de la fecha y hora inicial (en el html) para accederlo
	 */
	@ViewChild('dtpFechaHoraInicio') dtpFechaHoraInicio: DateTimePickerComponent;
	/**
   * Se "instancia" el componente datetime de la fecha y hora final (en el html) para accederlo
   */
	@ViewChild('dtpFechaHoraFinal') dtpFechaHoraFinal: DateTimePickerComponent;
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que almacena los datos del usuario en sesión
	 */
	public datosUsuarioSesion: any;
	/**
	 * Variable que representa el formulario
	 */
	public frmBroadcast: FormGroup;
	/**
	 * Variable con el estado del color seleccionado
	 */
	public colores = [{ clase: 'ar-chat-avatar-02', estado: false },
	{ clase: 'ar-chat-avatar-03', estado: false },
	{ clase: 'ar-chat-avatar-04', estado: false },
	{ clase: 'ar-chat-avatar-01', estado: false }];
	/**
	 * Variable para asignar las validaciones al campo de fecha inicial
	 */
	private fechaInicio = new FormControl(null, Validators.compose([Validators.required, this.ValidarFechaInicio()]));
	/**
	 * Variable para asignar las validaciones al campo de fecha final
	 */
	private fechaFinal = new FormControl(null, Validators.compose([Validators.required, this.ValidarFechaFinal()]));
	/**
	 * Variable que almacena el nombre de la unidad programática
	 */
	public nombreUnidadProgramatica: string
	/**
	 * Variable con la lista de mensajes
	 */
	public listaMensajes: any;

	/**
	 * Constructor de la clase
	 * @param utils Representa el servicio de utilidades
	 * @param fb Representa un objeto de tipo FormBuilder
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param unidadesProgramaticasService Representa al servicio de catalogos generales
	 * @param broadcastService Representa el servicio de broadcast
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param _location Parametro que representa el servicio de localización de rutas
	 */
	constructor(private utils: UtilidadesService,
		private fb: FormBuilder,
		private msgBox: DialogService,
		private unidadesProgramaticasService: UnidadesProgramaticasService,
		private broadcastService: BroadcastService,
		private snackBar: MatSnackBar,
		private _location: Location) {
		// Asigna los controles al objeto formulario
		this.frmBroadcast = this.fb.group({
			'mensaje': [null, Validators.compose([Validators.required, Validators.minLength(15)])],
			'color': [null, Validators.required],
			'fechaInicio': this.fechaInicio,
			'fechaFinal': this.fechaFinal
		});
	}

	// Métodos públicos

	/**
   * Método encargado de redirigir al usuario a la vista anterior
   */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	/**
	 * Método encargado de establecer el item seleccionado del arrglo de colores
	 * para los tipos de mensajes
	 * @param index Indica el indice seleccionado en el arreglo
	 */
	public SeleccionarColorMensaje(index: number): void {
		// Recorre el arreglo de colores
		this.colores.forEach((color, idx) => {
			// Valida el indice seleccionado
			if (index === idx) {
				// Establece el color seleccionado
				color.estado = true;
				// Establece el valor en el formulario
				this.frmBroadcast.controls.color.setValue(color.clase);
			} else {
				// Para cualquier otra posición limpia el campo
				color.estado = false;
			}
		});
	};

	/**
	 * Método que se encarga de obtener el dato de la fecha y hora inicial seleccionada
	 * @param item Indica la fecha y hora seleccionada
	 */
	public ObtenerFechaHoraInicio(item: Date): void {
		// Establece el valor en el formulario
		this.frmBroadcast.controls.fechaInicio.setValue((item) ? new Date(item) : null);
	};

	/**
	 * Método que se encarga de obtener el dato de la fecha y hora final seleccionada
	 * @param item Indica la fecha y hora seleccionada
	 */
	public ObtenerFechaHoraFin(item: Date): void {
		// Establece el valor en el formulario
		this.frmBroadcast.controls.fechaFinal.setValue((item) ? new Date(item) : null);
	};

	/**
	 * Método encargado de enviar los datos a la base de datos
	 */
	public Enviar(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se encapsulan los datos a enviar
		const data = {
			idAplicacion: this.datosUsuarioSesion.aplicacion_id,
			datosBroadcast: this.frmBroadcast.value
		};
		// Se llama a la función del servicio que envia los datos al server
		this.broadcastService.Create(data).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Obtiene la lista de mensajes
				this.ObtenerMensajes();
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
				// Limpiar el formulario
				this.LimpiarFormulario();
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error', res.mensaje);
				// .subscribe(res => alert(res));
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método que se encarga de obtener el dato de la fecha transformado
	 * de UTC a Local
	 * @param fechaUTC Indica la fecha UTC
	 * @return Retorna la fecha en formato local de la máquina
	 */
	public MostrarFechaLocal(fechaUTC): Date {
		// Retorna la conversión a la fecha local
		return this.utils.UTCToLocalDate(new Date(fechaUTC));
	};

	// Métodos privados

	/**
	 * Método encargado de obtener los datos del usuario en sesión actual
	 */
	private ObtenerDatosUsuarioActual(): void {
		// Obtiene los datos del usuario local
		this.datosUsuarioSesion = this.utils.ListUsuarioLocal();
		// Llama al servicio que obtiene el dato de la unidad programatica actual
		this.unidadesProgramaticasService.Show(this.datosUsuarioSesion.unidadProgramatica_id).then((res) => {
			// Recibe la respuesta
			if (res.exito) {
				// Asigna el nombre de la unidad prorámatica a la variable
				this.nombreUnidadProgramatica = res.data.descripcion;
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error de carga', res.mensaje);
				// .subscribe(res => alert(res));
				// Limpia el formulario
			}
		});
	};

	/**
	* Método encargado de validar el dato de la fecha de inicio
	* @returns Retorna el valor de la fecha inicial
	*/
	private ValidarFechaInicio(): any {
		// Se valida que la fecha inicial:
		// * Que NO sea menor a la fecha actual
		return (control: FormControl) => {
			// Valida el dato de la fecha final si existe
			if (this.fechaFinal === undefined) { return null; }
			// Obtiene las diferencias de tiempo entre fechas
			const diffFechaActual = this.utils.DiffDates(new Date(), control.value, 'm');
			const diffFechaFinal = this.utils.DiffDates(control.value, this.fechaFinal.value, 'm');
			// Retorna la validación de las diferencias de tiempos
			return ((diffFechaActual > 0 && diffFechaFinal < 0) ? { value: control.value } : null);
		}
	};

	/**
	* Método encargado de validar el dato de la fecha final
	* @returns Retorna el valor de la fecha final
	*/
	private ValidarFechaFinal(): any {
		// Se valida que la fecha final:
		// * Que NO sea menor a la fecha inicial
		return (control: FormControl) => {
			// Valida el dato de la fecha inicial si existe
			if (this.fechaInicio === undefined) { return null; }
			// Obtiene las diferencias de tiempo entre fechas
			const diffFechaActual = this.utils.DiffDates(new Date(), control.value, 'm');
			const diffFechaInicial = this.utils.DiffDates(this.fechaInicio.value, control.value, 'm');
			// Retorna la validación de las diferencias de tiempos
			return ((diffFechaActual > 0 && diffFechaInicial <= 0) ? { value: control.value } : null);
		}
	};

	/**
	 * Método encargado de obtener los mensajes creados
	 */
	private ObtenerMensajes(): void {
		// Se llama a la función del servicio que envia los datos al server
		this.broadcastService.ListByAplicacion(this.datosUsuarioSesion.aplicacion_id).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos de la respuesta
				this.listaMensajes = res.data;
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error', res.mensaje);
				// .subscribe(res => alert(res));
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método encargado de limpiar el formulario
	 */
	private LimpiarFormulario(): void {
		// Limpiar el formulario
		this.frmBroadcast.reset();
		// Limpia los controles de fecha
		this.dtpFechaHoraInicio.Reset(); // Limpia el control fechas
		this.dtpFechaHoraFinal.Reset(); // Limpia el control fechas
		// Recorre el arreglo de colores
		this.colores.forEach((color, idx) => {
			color.estado = false;
		});
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Muestra los datos del usuario en sesión actual
		this.ObtenerDatosUsuarioActual();
		// Obtiene la lista de mensajes
		this.ObtenerMensajes();
	};
}
