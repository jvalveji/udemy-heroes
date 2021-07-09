// Definición typescript para el componente EtlsTaskComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval as observableInterval, Subscription } from 'rxjs';
import { share, map } from 'rxjs/operators';

// Se importan los servicios a utilizar
import { EtlsTaskService, TiposRespuestaETLPentaho } from './etls-task.service';
import { EtlsService } from './../../../admin/catalogos/etls/etls.service';
import { UtilidadesService } from '../../services/utilidades.service';

/**
 * Espacio de nombres para los estados de las tareas en el servidor de Pentaho
 */
export namespace StateETLTaskPentaho {
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
 * Componente destinado al despligue y manejo de los etls que se ejecutan en el servidor de Pentaho
 */
@Component({
	selector: 'arca-etls-task',
	templateUrl: './etls-task.component.html',
	styleUrls: ['./etls-task.component.scss'],
	providers: [EtlsTaskService, EtlsService]
})
export class EtlsTaskComponent implements OnInit, OnDestroy {

	/**
	 * Variable que representa el nombre del etl a ejecutar pasado al componente
	 */
	private nombreEtlIn: string;
	/**
	 * Variable que representa la ruta del etl a ejecutar pasado al componente (la ruta en el servidor)
	 */
	private pathDirEtlIn: string;
	/**
	 * Variable que representa los parámetros a enviar al etl
	 */
	private parametros: Array<any>;
	/**
	 * Variable que representa el estado actual del proceso
	 */
	public consola: Array<string>;
	/**
	 * Variable que indica si se puede ejecutar o no el Etl
	 */
	public esEjecutar: boolean;
	/**
	 * Variable que indica si se puede cancelar la ventana de etl o no
	 */
	public esCancel: boolean;
	/**
	 * Variable para el manejo de la barra de progreso del proceso que ejecuta el Etl
	 */
	public esBarraProcesoEtl: boolean;
	/**
	 * Variable que almacenara los datos del Etl (datos del catálogo de Etls)
	 */
	public datosETL: any;
	/**
	 * Variable encargada de realizar le monitoreo de los Etls
	 */
	private monitor: Subscription;
	/**
	 * Variable que representa el tiempo en segundos que tendra el ciclo que
	 * obtiene el estado del Etl
	 */
	private cicloMonitor = 3;
	/**
	 * Variable que se utiliza para indicar si se imprime solo una vez la información
	 * de que el proceso se esta ejecutando
	 */
	private esEjecutandose: boolean;

	/**
	 * Atributo de entrada para establecer el nombre del Etl a ejecutar
	 */
	@Input()
	set EtlName(nombre: string) {
		this.nombreEtlIn = nombre;
	}

	/**
	 * Atributo de entrada para establecer el path del Etl a ejecutar (esto en el servidor)
	 */
	@Input()
	set EtlDirPath(path: string) {
		this.pathDirEtlIn = path;
	}

	/**
	 * Atributo de salida que retorna el estado final del proceso (exitoso o con errores)
	 */
	@Output('EstadoFinalEtl')
	private estadoFinalTask: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Constructor por defecto de la clase
	 * @param snackBar Representa los mensajes para el usuario
	 * @param etlsTaskService Representa el servicio para ejecutar etls en el servidor
	 * @param etlsService Representa el servicio del catálogo de etls,
	 * @param utils Representa al servicio de utilidades
	 */
	constructor(private snackBar: MatSnackBar,
		private etlsTaskService: EtlsTaskService,
		private etlsService: EtlsService,
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
	 * Método encargado de ejecutar el Etl en el servidor de Pentaho
	 */
	public Ejecutar(): void {
		// Se habilita la barra de estado del proceso
		this.esBarraProcesoEtl = true;
		// Se deshabilitan los botones
		this.esEjecutar = false;
		this.esCancel = false;
		// Se establece la ruta del etl y su nombre (el nombre corresponde al fichero físico en el servidor de Pentaho)
		const rootEtl = this.pathDirEtlIn + '/' + this.datosETL.idEtlPentaho;

		// Envia mensaje a la consola
		this.ImprimirConsola('Se inicia ejecución del proceso [' + this.datosETL.nombre + '].', MessageConsole.Tipo.Info);

		// Se llama a la función del servicio que envia los datos al server
		this.etlsTaskService.Create(rootEtl, TiposRespuestaETLPentaho.Tipos.Normal, this.parametros).then((res) => {
			// Recibe la respuesta
			if (res.exito) {
				// Se valida el tipo de respuesta; ya que si el ETL devuelve datos se deben retorna de una vez al solicitante
				if (!res.data.result) {
					// Si existiese en la respuesta la propiedad "result" indica que retorno el mensaje en formato XML
					// Se envia al componente de tareas información para la consola
					this.ImprimirConsola('El proceso fue finalizado de forma satisfactoria.', MessageConsole.Tipo.Info);
					// Restablece los controles
					this.RestablecerAdministradorTareas();
					// Dispara el evento que retorna el estado final del Etl
					this.estadoFinalTask.emit({
						exito: true
					});
				}
				else {
					// En caso contrario, se debe ir a revisar el estado de ejecución del ETL
					// Dispara el evento que monitorea el estado del Etl cada cierto tiempo hasta que finalice
					this.IniciarMonitoreoStatusEtl();
				}
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
	 * Método que se encarga de obtener los datos del Etl desde el catálogo
	 */
	private ObtenerInformacionCatalogoEtls(): void {
		// Valida si existe el dato del nombre del Etl para buscarlo en el catálogo
		if (this.nombreEtlIn) {
			// Inicia la barra de progreso
			this.esBarraProcesoEtl = true;
			// Se llama a la función del servicio que envia los datos al server
			this.etlsService.ShowByNombre(this.nombreEtlIn).then((res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esBarraProcesoEtl = false;
				// Recibe la respuesta
				if (res.exito) {
					// Asigna los datos obtenidos
					this.datosETL = res.data[0];
				}
				else {
					// Muestra el mensaje de error
					this.snackBar.open(res.mensaje, null, {
						duration: 3000
					});
				}
			}, (err) => {
				// Oculta la barra de progreso en caso de error
				this.esBarraProcesoEtl = false;
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
		this.esBarraProcesoEtl = false;
		this.esEjecutandose = false;
		// Valida si existe alguna suscripción la servicio de monitoreo
		if (this.monitor) {
			// Elimina la suscripción
			this.monitor.unsubscribe();
		}
	};

	/**
	 * Método encargado de obtener el estado actual de ejecución
	 * del Etl desde el servidor de Pentaho
	 */
	private ObtenerStatusEjecucionEtl(): void {
		// Se llama a la función del servicio que envia los datos al server
		this.etlsTaskService.Show(this.nombreEtlIn).then((resp) => {
			// Recibe la respuesta
			if (resp.exito) {
				// Obtiene la respuesta
				const resp2 = this.ValidarMensajeEstadoEjecucionEtl(resp.data);

				// Válida un estado erroneo (Finished (with errors),Stopped,Stopped (with errors), ERROR)
				if (resp2.estado === StateETLTaskPentaho.State.Error || resp2.estado === StateETLTaskPentaho.State.Unavailable) {
					// Se envia al componente de tareas información para la consola
					this.ImprimirConsola(resp2.mensaje, MessageConsole.Tipo.Error);
					// Restablece los controles
					this.RestablecerAdministradorTareas();
					// Dispara el evento que retorna el estado final del Etl
					this.estadoFinalTask.emit({
						exito: false,
						data: resp2
					});
				}
				else {
					// Válida un estado terminado (Finished)
					if (resp2.estado === StateETLTaskPentaho.State.End) {
						// Se envia al componente de tareas información para la consola
						this.ImprimirConsola(resp2.mensaje, MessageConsole.Tipo.Info);
						// Restablece los controles
						this.RestablecerAdministradorTareas();
						// Dispara el evento que retorna el estado final del Etl
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
				// Dispara el evento que retorna el estado final del Etl
				this.estadoFinalTask.emit({
					exito: false,
					data: resp
				});
			}
		}, (err) => {
			// Se envia al componente de tareas información para la consola
			if (err.error) { this.ImprimirConsola(err.error.message, MessageConsole.Tipo.Error); }
			// Dispara el evento que retorna el estado final del Etl
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
	 * @param data Representa el objeto con las propiedades del estado del Etl
	 * @return Retorna un estado y un mensaje
	 */
	private ValidarMensajeEstadoEjecucionEtl(data): any {
		// Se declara una variable que contendra el estado
		const resultado = {
			estado: null,
			mensaje: null
		};

		// Se valida la propiedad que posee el mensaje del Etl
		// data -> Si contiene información es un error / Si es nulo todo fue satisfactorio
		const mensajeError = (data) ? 'Finished' : data.result;

		switch (mensajeError) {
			// Etl ejecutandose
			case 'Running':
				resultado.estado = StateETLTaskPentaho.State.Running;
				resultado.mensaje = 'El proceso se encuentra ejecutando.';
				break;
			// Etl finalizado
			case 'Finished':
				resultado.estado = StateETLTaskPentaho.State.End;
				resultado.mensaje = 'El proceso fue finalizado de forma satisfactoria.';
				break;
			// Etl finalizado con errores
			case 'Finished (with errors)':
				resultado.estado = StateETLTaskPentaho.State.Error;
				resultado.mensaje = 'El proceso fue finalizado pero presenta errores. Contacte con el administrador.';
				break;
			// Etl detenido por el usuario
			case 'Stopped':
				resultado.estado = StateETLTaskPentaho.State.Error;
				resultado.mensaje = 'El proceso fue detenido por el usuario.';
				break;
			// Etl detenido por el usuario pero con errores
			case 'Stopped (with errors)':
				resultado.estado = StateETLTaskPentaho.State.Error;
				resultado.mensaje = 'El proceso fue detenido por el usuario pero presenta errores.';
				break;
			// Etl con errores
			case 'ERROR':
				resultado.estado = StateETLTaskPentaho.State.Error;
				resultado.mensaje = 'El proceso presenta errores y no pudo ejecutarse.';
				break;

			default:
				resultado.estado = StateETLTaskPentaho.State.Unavailable;
				resultado.mensaje = 'El proceso no esta disponible en la lista de trabajos realizados en el servidor.';
				break;
		}
		// Retorna la respuesta
		return resultado;
	};

	/**
	 * Método encargado de iniciar el proceso que consulta el estado del Etl
	 */
	private IniciarMonitoreoStatusEtl(): void {
		// Se asigna a la variable observable un intervalo para ejecutar la consulta del estado del Etl
		this.monitor = observableInterval(this.cicloMonitor * 1000).pipe(map(ciclo => this.ObtenerStatusEjecucionEtl()), share()).subscribe();
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Mensaje inicial para la consola
		const mensaje = 'Bienvenido al administrador de tareas de la plataforma Arca - MEAN.\nEn espera de instrucciones para iniciar el proceso.';
		// Envia mensaje a la consola
		this.ImprimirConsola(mensaje);
		// Obtiene los datos del Etl a ejecutar desde el catálogo
		this.ObtenerInformacionCatalogoEtls();
		// Obtiene el estado del Etl en caso de que se este ejecutando aún
		// this.ObtenerStatusEjecucionEtl();
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
