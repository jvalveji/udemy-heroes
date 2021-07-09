// Definición typescript para el componente ProcesoSIGESComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (22-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, ViewChild, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Se agregan los servicios a utilizar
import { ProcesoSIGESService } from './proceso-siges.service';
import { ServiciosService } from './../catalogos/servicios/servicios.service';
import { UtilidadesService } from './../../shared/services/utilidades.service';

// Se agregan los componentes a utilizar
import { JobsTaskComponent, MessageConsole } from './../../shared/controls/jobs-task/jobs-task.component';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from 'app/shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_proceso_siges'])
/**
 * Componente destinado al despligue y manejo del proceso de cargar del catálogo de artículos
 * del SIGES proveniente de un fichero Excel.
 */
@Component({
	selector: 'arca-proceso-siges',
	templateUrl: './proceso-siges.component.html',
	styleUrls: ['./proceso-siges.component.scss'],
	providers: [ProcesoSIGESService]
})
export class ProcesoSIGESComponent implements OnInit {

	/**
	 * Variable que representa el componente de jobs-task
	 */
	private jobsTaskComponent: JobsTaskComponent;
	/**
	* Se "instancia" el componente de jobs-task para accederlo por código
	*/
	@ViewChild('sigesArcaJobs') set content(content: JobsTaskComponent) {
		// Se valida si ya esta seteada la variable que representa al componente
		// (esto por que el SET del ViewChild se ejecuta 2 veces)
		if (!this.jobsTaskComponent) {
			// Asigna el componente a la variable
			this.jobsTaskComponent = content;
			// Carga los servicios que pueden ejecutar un proceso de SIGES
			this.ObtenerServiciosSIGES();
		}
	};
	/**
	 * Variable que representa el fichero SIGES
	 */
	private fileSIGES: any;
	/**
	 * Variable que representa el servicio SIGES por default
	 */
	public idSIGESDefault: any;
	/**
	 * Variable que representa el servicio selccionado
	 */
	public servicioSeleccionado: any;
	/**
	 * Variable que representa la lista de servicios disponibles
	 */
	public serviciosSIGES: Array<any>;

	/**
	 * Constructor de la clase
	 * @param dataDialog Representa los datos que son enviados al componente desde otro componente
	 * @param snackBar Representa los mensajes para el usuario
	 * @param procesoSIGESService Representa el servicio par el manejo del proceso del SIGES
	 * @param tiposServicioService Representa el servicio para el manejo del catálogo de servicios
	 */
	constructor(@Optional() @Inject(MAT_DIALOG_DATA) private dataDialog: any,
		private snackBar: MatSnackBar,
		private procesoSIGESService: ProcesoSIGESService,
		private tiposServicioService: ServiciosService,
		private utilidades: UtilidadesService) {
		// Inicializa variables
		this.serviciosSIGES = [];
		// Valida si existe datos default para el componente
		if (this.dataDialog) {
			// Si existe id del SIGES se la asigna al valor default
			this.idSIGESDefault = (this.dataDialog.idSIGES) ? this.dataDialog.idSIGES : null;
		}
	}

	// Métodos públicos

	/**
	   * Método encargado de obtener el servicio seleccionado
	   * @param {*} event Evento generado por el control tipo "select"
	   */
	public SeleccionarServicio(event) {
		// Se obtiene del evento el item seleccionado en el select
		// this.servicioSeleccionado = event;
		// Se envia el dato como parte de los parámetros del componente
		this.jobsTaskComponent.AgregarParametro({ idSIGES: this.servicioSeleccionado });
		this.jobsTaskComponent.AgregarParametro({ idUsuario: this.utilidades.ListUsuarioLocal().usuario_id });
		// Se envia al componente de tareas información para la consola
		this.jobsTaskComponent.ImprimirConsola('Servicio seleccionado [' + event.source._selectionModel._selected['0']._element.nativeElement.textContent + '].');
		// Se habilita/deshabilita la ejecución en el componente
		this.jobsTaskComponent.esEjecutar = (this.fileSIGES) ? true : false;
	};

	/**
	   * Método encargado de obtener la ubicación local del fichero SIGES a subir para el proceso
	   * @param {*} event Evento generado por el control tipo "file"
	   */
	public SeleccionarFicheroSIGES(event) {
		// Se obtiene del evento el fichero seleccionado en el input
		this.fileSIGES = event.target.files[0];
		// Se envia al componente de tareas información para la consola
		this.jobsTaskComponent.ImprimirConsola('Archivo seleccionado.');
		// Se establece los datos para subirlos al servidor
		const formulario = new FormData(); // Se crea la variable tipo formulario
		formulario.append('sigesExcel', this.fileSIGES); // Se agrega el archivo a subir
		// Se habilita la barra de progreso
		this.jobsTaskComponent.esBarraProcesoJob = true;
		// Se envia al componente de tareas información para la consola
		this.jobsTaskComponent.ImprimirConsola('Cargando datos al servidor. Por favor espere.');
		// Se llama a la función del servicio que envia los datos al server
		this.procesoSIGESService.Upload(formulario).then((res) => {
			// Se deshabilita la barra de progreso
			this.jobsTaskComponent.esBarraProcesoJob = false;
			// Recibe la respuesta
			if (res.exito) {
				// Se envia al componente de tareas información para la consola
				this.jobsTaskComponent.ImprimirConsola(res.mensaje, MessageConsole.Tipo.Info);
				// Se habilita/deshabilita la ejecución en el componente
				this.jobsTaskComponent.esEjecutar = (this.servicioSeleccionado) ? true : false;
			}
			else {
				// Se envia al componente de tareas información para la consola
				this.jobsTaskComponent.ImprimirConsola(res.mensaje, MessageConsole.Tipo.Error);
			}
		}, (err) => {
			// Se deshabilita la barra de progreso
			this.jobsTaskComponent.esBarraProcesoJob = false;
			// Se envia al componente de tareas información para la consola
			this.jobsTaskComponent.ImprimirConsola(err.error.message + ' ' + err.error.error, MessageConsole.Tipo.Error);
		});
	};

	/**
	 * Método que se encarga de capturar el estado final del Job ejecutado por el
	 * componente JobsTaskComponent.
	 * @param event Objeto generado por el componente (Ej: {estado:boolean, data:any})
	 */
	public EstadoFinalTarea(event: any): void {
		// // Habilita nuevamente el botón de ejecutar por si el usuario desea ejecutar nuevamente el Job
		// this.jobsTaskComponent.esEjecutar = true;
	};

	// Métodos privados

	/**
	   * Método encargado de obtener los servicios que pueden generar el proceso de actualización
	 * del catálogo SIGES en esta unidad
	   */
	private ObtenerServiciosSIGES() {
		// Se habilita la barra de progreso
		this.jobsTaskComponent.esBarraProcesoJob = true;
		// Se llama a la función del servicio que envia los datos al server
		this.tiposServicioService.List().then((res) => {
			// Se deshabilita la barra de progreso
			this.jobsTaskComponent.esBarraProcesoJob = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos obtenidos a la variable
				// Se filtra el resultado para obtener solo los servicios que tienen la propiedad SIGES
				this.serviciosSIGES = res.data.filter(servicio => servicio.hasOwnProperty('idSIGES'));
				// Establece en el combo de servicios el servicio default (en caso de que exista)
				if (this.idSIGESDefault) {
					// Asigna el servicio default
					this.servicioSeleccionado = this.idSIGESDefault;
				}
			}
			else {
				// Muestra el mensaje de error
				this.snackBar.open(res.mensaje, null, {
					duration: 3000
				});
			}
		}, (err) => {
			// Se deshabilita la barra de progreso
			this.jobsTaskComponent.esBarraProcesoJob = false;
			// Muestra el mensaje de error
			this.snackBar.open(err.error.message, null, {
				duration: 3000
			});
		});
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() { };
}
