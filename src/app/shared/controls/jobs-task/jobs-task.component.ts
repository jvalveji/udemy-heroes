// Definición typescript para el componente JobsTaskComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval as observableInterval, Subscription } from 'rxjs';
import { share, map } from 'rxjs/operators';

// Se importan los servicios a utilizar
import { JobsTaskService } from './jobs-task.service';
import { JobsService } from './../../../admin/catalogos/jobs/jobs.service';
import { UtilidadesService } from '../../services/utilidades.service';

/**
 * Espacio de nombres para los estados de las tareas en el servidor de Pentaho
 */
export namespace StateJOBTaskPentaho {
	/**
	 * Listado de estados
	 */
	export enum State {
		/**
		 * En ejecución
		 */
		Running,
		/**
		 * Terminado
		 */
		End,
		/**
		 * Error
		 */
		Error,
		/**
		 * No disponible
		 */
		Unavailable
	};
};

/**
 * Espacio de nombres para los estados de las tareas en el servidor de Pentaho
 */
export namespace MessageConsole {
	/**
	 * Listado de los tipos de mensaje para la consola
	 */
	export enum Tipo {
		/**
		 * Color blanco
		 */
		Normal,
		/**
		 * Color Azul
		 */
		Info,
		/**
		 * Color Rojo
		 */
		Error,
		/**
		 * Color Naranja
		 */
		Warning
	};
};

/**
 * Componente destinado al despligue y manejo de los jobs que se ejecutan en el servidor de Pentaho
 */
@Component({
	selector: 'arca-jobs-task',
	templateUrl: './jobs-task.component.html',
	styleUrls: ['./jobs-task.component.scss'],
	providers: [JobsTaskService, JobsService]
})
export class JobsTaskComponent implements OnInit, OnDestroy {

	/**
	 * Variable que representa el nombre del job a ejecutar pasado al componente
	 */
	private nombreJobIn: string;
	/**
	 * Variable que representa la ruta del job a ejecutar pasado al componente (la ruta en el servidor)
	 */
	private pathDirJobIn: string;
	/**
	 * Variable que representa los parámetros a enviar al job
	 */
	private parametros: Array<any>;
	/**
	 * Variable que representa el estado actual del proceso
	 */
	public consola: Array<string>;
	/**
	 * Variable que indica si se puede ejecutar o no el Job
	 */
	public esEjecutar: boolean;
	/**
	 * Variable que indica si se puede cancelar la ventana de job o no
	 */
	public esCancel: boolean;
	/**
	 * Variable para el manejo de la barra de progreso del proceso que ejecuta el JOB
	 */
	public esBarraProcesoJob: boolean;
	/**
	 * Variable que almacenara los datos del JOB (datos del catálogo de JOBS)
	 */
	public datosJOB: any;
	/**
	 * Variable que almacenara los datos del JOB procesado en el servidor Pentaho
	 */
	private procesoJOB: any;
	/**
	 * Variable encargada de realizar le monitoreo de los Jobs
	 */
	private monitor: Subscription;
	/**
	 * Variable que representa el tiempo en segundos que tendra el ciclo que
	 * obtiene el estado del Job
	 */
	private cicloMonitor = 3;
	/**
	 * Variable que se utiliza para indicar si se imprime solo una vez la información
	 * de que el proceso se esta ejecutando
	 */
	private esEjecutandose: boolean;

	/**
	 * Atributo de entrada para establecer el nombre del Job a ejecutar
	 */
	@Input()
	set JobName(nombre: string) {
		this.nombreJobIn = nombre;
	}

	/**
	 * Atributo de entrada para establecer el path del Job a ejecutar (esto en el servidor)
	 */
	@Input()
	set JobDirPath(path: string) {
		this.pathDirJobIn = path;
	}

	/**
	 * Atributo de salida que retorna el estado final del proceso (exitoso o con errores)
	 */
	@Output('EstadoFinalJob')
	private estadoFinalTask: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Constructor por defecto de la clase
	 * @param snackBar Representa los mensajes para el usuario
	 * @param jobsTaskService Representa el servicio para ejecutar jobs en el servidor
	 * @param jobsService Representa el servicio del catálogo de jobs,
	 * @param utils Representa al servicio de utilidades
	 */
	constructor(private snackBar: MatSnackBar,
		private jobsTaskService: JobsTaskService,
		private jobsService: JobsService,
		private utils: UtilidadesService) {
		// Se inicializa la consola
		this.consola = [];
		// Inicializa las variables
		this.RestablecerAdministradorTareas();
	}

	// Métodos públicos

	/**
	 * Método encargado de imprimir en el área de la consola
	 * @param texto Texto a imprimir
	 * @param estilo Representa el estilo para aplicar al control
	 */
	public ImprimirConsola(texto: string, estilo?: MessageConsole.Tipo): void {
		// Valida si existe un estilo para aplicar a la consola
		const style = (estilo === MessageConsole.Tipo.Info) ? 'color:green;' :
			(estilo === MessageConsole.Tipo.Error) ? 'color:red;' :
				(estilo === MessageConsole.Tipo.Warning) ? 'color:orange;' :
					(estilo === MessageConsole.Tipo.Normal) ? null : null;
		// Variable para indicar el prompt de la consola
		const prompt = '[ ' + this.utils.ListUsuarioLocal().usuario + '@arca] # ';
		// Se agrega contenido a la consola con los datos enviados a la función
		const divPadre = '<div style="display:-webkit-box;white-space:pre-wrap;">';
		const divPrompt = '<div style="color:#96b38a;">' + prompt + '</div>';
		const divCmd = '<div style="width: 75%;' + ((style) ? style : '') + '" autofocus>' + texto + '</div>';

		this.consola.push(divPadre + divPrompt + divCmd + '</div>');
		// Se invoca a la función que simula un tiempo "muerto"; esto para
		// que la propiedad "scrollTop" le de tiempo de acomodar el foco en la última linea de la lista
		this.utils.Sleep(1).then(function () {
			// Situa visualmente al usuario en la posición de la nueva linea
			const objDiv = document.getElementById('divConsole');
			objDiv.scrollTop = objDiv.scrollHeight;
		});
	};

	/**
	 * Método encargado de ejecutar el JOB en el servidor de Pentaho
	 */
	public Ejecutar(): void {
		// Se habilita la barra de estado del proceso
		this.esBarraProcesoJob = true;
		// Se deshabilitan los botones
		this.esEjecutar = false;
		this.esCancel = false;
		// Se establece la ruta del job y su nombre (el nombre corresponde al fichero físico en el servidor de Pentaho)
		const rootJob = this.pathDirJobIn + '/' + this.datosJOB.idJobPentaho;
		// Se llama a la función del servicio que envia los datos al server
		this.jobsTaskService.Create(rootJob, this.parametros).then((res) => {
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos obtenidos
				this.procesoJOB = res.data;
				// Envia mensaje a la consola
				this.ImprimirConsola('Se inicia ejecución del proceso [' + this.datosJOB.nombre + '].', MessageConsole.Tipo.Info);
				// Dispara el evento que monitorea el estado del Job
				this.IniciarMonitoreoStatusJob();
			}
			else {
				// Se envia al componente de tareas información para la consola
				this.ImprimirConsola(res.mensaje, MessageConsole.Tipo.Error);
			}
		}, (err) => {
			// Se restablece el formulario a estado inicial
			this.RestablecerAdministradorTareas();
			// Se envia al componente de tareas información para la consola
			if (err.error) { this.ImprimirConsola(err.error.message, MessageConsole.Tipo.Error); }
		});
	};

	/**
	 * Método encargado de agregar un parámetro para ser enviado en la petición del proceso
	 * El formato de cada parámetro debe ser: {key:value}
	 * @example {id: 12345}
	 * @param param Parámetro para el proceso
	 */
	public AgregarParametro(param: any): void {
		this.parametros.push(param);
	};

	// Métodos privados

	/**
	 * Método que se encarga de obtener los datos del JOB desde el catálogo
	 */
	private ObtenerInformacionCatalogoJobs(): void {
		// Valida si existe el dato del nombre del JOB para buscarlo en el catálogo
		if (this.nombreJobIn) {
			// Inicia la barra de progreso
			this.esBarraProcesoJob = true;
			// Se llama a la función del servicio que envia los datos al server
			this.jobsService.ShowByNombre(this.nombreJobIn).then((res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esBarraProcesoJob = false;
				// Recibe la respuesta
				if (res.exito) {
					// Asigna los datos obtenidos
					this.datosJOB = res.data[0];
				}
				else {
					// Muestra el mensaje de error
					this.snackBar.open(res.mensaje, null, {
						duration: 3000
					});
				}
			}, (err) => {
				// Oculta la barra de progreso en caso de error
				this.esBarraProcesoJob = false;
				// Muestra el mensaje de error
				if (err.error) {
					this.snackBar.open(err.error.message, null, {
						duration: 3000
					});
				}
			});
		}
		else {
			// Muestra el mensaje de error
			this.snackBar.open('Debe indicar el nombre del trabajo para poder ejecutar la tarea.', null, {
				duration: 3000
			});
		}
	};

	/**
	 * Método encargado de restablecer todas las variables
	 * del formulario a su estado inicial
	 */
	private RestablecerAdministradorTareas(): void {
		// Inicializa las variables
		this.parametros = [];
		this.esEjecutar = false;
		this.esCancel = true;
		this.esBarraProcesoJob = false;
		this.esEjecutandose = false;
		// Valida si existe alguna suscripción la servicio de monitoreo
		if (this.monitor) {
			// Elimina la suscripción
			this.monitor.unsubscribe();
		}
	};

	/**
	 * Método encargado de obtener el estado actual de ejecución
	 * del JOB desde el servidor de Pentaho
	 */
	private ObtenerStatusEjecucionJob(): void {
		// Variable para obtener el ID del proceso en el servidor Pentaho (si existiese)
		const idJob = (this.procesoJOB.id) ? this.procesoJOB.id[0] : null;
		// Se llama a la función del servicio que envia los datos al server
		this.jobsTaskService.Show(this.nombreJobIn, idJob).then((resp) => {
			// Recibe la respuesta
			if (resp.exito) {
				// Obtiene la respuesta
				const resp2 = this.ValidarMensajeEstadoEjecucionJob(resp.data);

				// Válida un estado erroneo (Finished (with errors),Stopped,Stopped (with errors), ERROR)
				if (resp2.estado === StateJOBTaskPentaho.State.Error || resp2.estado === StateJOBTaskPentaho.State.Unavailable) {
					// Se envia al componente de tareas información para la consola
					this.ImprimirConsola(resp2.mensaje, MessageConsole.Tipo.Error);
					// Restablece los controles
					this.RestablecerAdministradorTareas();
					// Dispara el evento que retorna el estado final del Job
					this.estadoFinalTask.emit({
						exito: false,
						data: resp2
					});
				}
				else {
					// Válida un estado terminado (Finished)
					if (resp2.estado === StateJOBTaskPentaho.State.End) {
						// Se envia al componente de tareas información para la consola
						this.ImprimirConsola(resp2.mensaje, MessageConsole.Tipo.Info);
						// Restablece los controles
						this.RestablecerAdministradorTareas();
						// Dispara el evento que retorna el estado final del Job
						this.estadoFinalTask.emit({
							exito: true
						});
					}
					else {
						// Indica un estado de estar ejecutandose (Running)
						// Se valida si puede imprimir más de una vez o no
						if (!this.esEjecutandose) {
							// Se establece en verdadero para que no imprima más
							this.esEjecutandose = true;
							// Se envia al componente de tareas información para la consola
							this.ImprimirConsola(resp2.mensaje, MessageConsole.Tipo.Info);
						}
					}
				}
			}
			else {
				// Se envia al componente de tareas información para la consola
				this.ImprimirConsola(resp.mensaje, MessageConsole.Tipo.Error);
				// Dispara el evento que retorna el estado final del Job
				this.estadoFinalTask.emit({
					exito: false,
					data: resp
				});
			}
		}, (err) => {
			// Se envia al componente de tareas información para la consola
			if (err.error) { this.ImprimirConsola(err.error.message, MessageConsole.Tipo.Error); }
			// Dispara el evento que retorna el estado final del Job
			if (err.error) {
				this.estadoFinalTask.emit({
					exito: false,
					data: err.error
				});
			}
		});
	};

	/**
	 * Método encargado de validar el mensaje de respuesta desde el servidor de Pentaho
	 * @param data Representa el objeto con las propiedades del estado del Job
	 * @return Retorna un estado y un mensaje
	 */
	private ValidarMensajeEstadoEjecucionJob(data): any {
		// Se declara una variable que contendra el estado
		const resultado = {
			estado: null,
			mensaje: null
		};

		// Se valida la proiedad que posee el mensaje del Job
		// status_desc -> Si encontro el Job / result -> NO encontro el Job por lo que es un error
		const mensajeError = (data.status_desc) ? data.status_desc[0] : data.result;

		switch (mensajeError) {
			// Job ejecutandose
			case 'Running':
				resultado.estado = StateJOBTaskPentaho.State.Running;
				resultado.mensaje = 'El proceso se encuentra ejecutando.';
				break;
			// Job finalizado
			case 'Finished':
				resultado.estado = StateJOBTaskPentaho.State.End;
				resultado.mensaje = 'El proceso fue finalizado de forma satisfactoria.';
				break;
			// Job finalizado con errores
			case 'Finished (with errors)':
				resultado.estado = StateJOBTaskPentaho.State.Error;
				resultado.mensaje = 'El proceso fue finalizado pero presenta errores. Contacte con el administrador.';
				break;
			// Job detenido por el usuario
			case 'Stopped':
				resultado.estado = StateJOBTaskPentaho.State.Error;
				resultado.mensaje = 'El proceso fue detenido por el usuario.';
				break;
			// Job detenido por el usuario pero con errores
			case 'Stopped (with errors)':
				resultado.estado = StateJOBTaskPentaho.State.Error;
				resultado.mensaje = 'El proceso fue detenido por el usuario pero presenta errores.';
				break;

			default:
				resultado.estado = StateJOBTaskPentaho.State.Unavailable;
				resultado.mensaje = 'El proceso no esta disponible en la lista de trabajos realizados en el servidor.';
				break;
		}
		// Retorna la respuesta
		return resultado;
	};

	/**
	 * Método encargado de iniciar el proceso que consulta el estado del Job
	 */
	private IniciarMonitoreoStatusJob(): void {
		// Se asigna a la variable observable un intervalo para ejecutar la consulta del estado del Job
		this.monitor = observableInterval(this.cicloMonitor * 1000).pipe(map(ciclo => this.ObtenerStatusEjecucionJob()), share()).subscribe();
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Mensaje inicial para la consola
		const mensaje = 'Bienvenido al administrador de tareas de la plataforma Arca - MEAN.\nEn espera de instrucciones para iniciar el proceso.';
		// Envia mensaje a la consola
		this.ImprimirConsola(mensaje);
		// Obtiene los datos del JOB a ejecutar desde el catálogo
		this.ObtenerInformacionCatalogoJobs();
		// Obtiene el estado del JOB en caso de que se este ejecutando aún
		// this.ObtenerStatusEjecucionJob();
	};

	/**
	 * Método de finalización del componente
	 */
	public ngOnDestroy() {
		// Valida si existe alguna suscripción la servicio de monitoreo
		if (this.monitor) {
			// Elimina la suscripción
			this.monitor.unsubscribe();
		}
	};
}
