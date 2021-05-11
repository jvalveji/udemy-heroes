// Definición typescript para el componente archivosComponent v1.2.3
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (20-06-2019) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

// se importa libreria para el manejo de mensajes de error desde el servidor
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArchivosService } from './archivos.service';

/**
 * Componente para el manejo del control ArchivosComponent, manejo de peticiones CRUD de documentos o archivos a la BD de mongoDB
 */
@Component({
	selector: 'arca-archivos',
	templateUrl: './archivos.component.html',
	styleUrls: ['./archivos.component.scss']
})
export class ArchivosComponent implements OnInit {
	/**
	 * Representa contenedor con archivos agregadas temporalmente por el usuario
	 */
	public listadoTemporal: any = [];
	/**
	 * Representa contenedor con archivos almacenados por el usuario a la base de datos ( carátulas de los archivos )
	 */
	public listadoPermanente: any = [];
	/**
	 * Representa tipo de archivos permitidos para adjuntar en el caso de que se necesite restricción de alguno en específico, por defecto todos permitidos
	 */
	public archivosPermitidos = '*';
	/**
	 * Representa los encabezados de los ficheros asociados a los formularios y almacenados en BD
	 */
	public ficheros: Array<object> = [];
	/**
	 * Representa retricción de tiempo en minutos para eliminar registros por defecto 5 minutos
	 */
	public tiempoEliminacion = 5;
	/**
	 * Representa el encabezado de la vista en donde se agregan los ficheros
	 */
	public encabezado = '';
	/**
	 * Variable que limita el número de archivos o documentos permitidos por defecto en 1
	 */
	public limiteInsercion = 1;
	/**
	 * Variable que representa nombre del sistema actual
	 */
	public sistema: string = null;
	/**
	 * Representa listado de archivos en string base 64
	 */
	public galeria: any = [];
	/**
	 * Bandera para la visualización del área de visualización
	 */
	public mostrarGaleria = false;
	/**
	 * Representa la posición en la estructura galeria de imágenes
	 */
	public posicion = 0;
	/**
	 * Bandera para incluir o no el visor de imágenes en el DOM
	 */
	public visor = false;
	/**
	 * Bandera para el manejo del área para el visor de imágenes
	 */
	public areaVisor = false;
	/**
	 * Bandera para comprobar si ya se ha ejecutado la carga inicial de imágenes
	 */
	public cargaInicial = false;
	/**
	 * Variable se encarga de establecer retardo de carga
	 */
	private timeoutId: any;
	/**
	 * Representa texto en base64
	 */
	public base64textString: String = '';
	/**
	 * Representa el archivo o documento actual
	 */
	public file: File;
	/**
	 * Estructura para almacenar los datos a enviar al servidor
	 */
	public formData = new FormData();
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Representa la ruta del archivo a desplegar se pasa string base 64
	 */
	public src: { src: string, filename: string, contentType: string, encabezado?: string };
	/**
	 * Variable ara desactivar el botón input
	 */
	public disabled = false;
	/**
	 * Se establece atributo para poder cambiar el mensaje informativo de confirmación de archivos
	 */
	public mensaje = 'Los archivos serán guardados hasta confirmar el formulario.';
	/**
	 * Se establece atributo para desactivar el mensaje de confirmación de archivos
	 */
	public sinMensaje = false;
	/**
	 * Atributo de entrada para cambiar el mensaje de confirmación de imagenes
	 */
	@Input()
	set SinMensaje(_sinMensaje: boolean) {
		this.sinMensaje = _sinMensaje;
	}
	get SinMensaje() {
		return this.sinMensaje;
	}
	/**
	* Atributo de entrada para cambiar el mensaje de confirmación de imagenes
	*/
	@Input()
	set Mensaje(_mensaje: string) {
		this.mensaje = _mensaje;
	}
	get Mensaje() {
		return this.mensaje;
	}
	/**
	* Atributo de entrada para incluir o no el visor de imágenes
	*/
	@Input()
	set Visor(_visor: boolean) {
		this.visor = _visor;
	}
	get Visor() {
		return this.visor;
	}
	/**
	 * Atributo de entrada para establecer el límite de archivos permitidos para adjuntar
	 */
	@Input()
	set LimiteInsercion(_limiteInsercion: number) {
		this.limiteInsercion = _limiteInsercion;
	}
	get LimiteInsercion() {
		return this.limiteInsercion;
	}
	/**
	 * Atributo de entrada para establecer los tipos de archivos a adjuntar por defecto en todos(*)
	 */
	@Input()
	set ArchivosPermitidos(_archivosPermitidos: string) {
		this.archivosPermitidos = _archivosPermitidos;
	}
	get ArchivosPermitidos() {
		return this.archivosPermitidos;
	}
	/**
	* Atributo de entrada para establecer el valor del listado de encabezados de ficheros almacenados en BD
	*/
	@Input()
	set Ficheros(_ficheros: Array<object>) {
		this.ficheros = _ficheros;
	}
	get Ficheros() {
		return this.ficheros;
	}
	/**
	* Atributo de entrada para establecer un valor de tiempo en minutos para la eliminación de un fichero, por defecto 5 minutos
	*/
	@Input()
	set TiempoEliminacion(_tiempoEliminacion: number) {
		this.tiempoEliminacion = _tiempoEliminacion;
	}
	get TiempoEliminacion() {
		return this.tiempoEliminacion;
	}
	/**
	 * Atributo de entrada para establecer un valor de encabezado para el visor de imágenes
	 */
	@Input()
	set Encabezado(_encabezado: string) {
		this.encabezado = _encabezado;
	}
	get Encabezado() {
		return this.encabezado;
	}
	/**
	* Atributo de entrada para establecer el valor del sistema en donde se adjuntan los ficheros
	*/
	@Input()
	set Sistema(_sistema: string) {
		this.sistema = _sistema;
	}
	get Sistema() {
		return this.sistema;
	}
	/**
	* Atributo de entrada para activar o desactivar botón input de busqueda de archivos
	*/
	@Input()
	set Disabled(_disabled: boolean) {
		this.disabled = _disabled;
	}
	get Disabled() {
		return this.disabled;
	}
	/**
	 * Atributo de salida que retorna el item agregado por el usuario en string base64 así como, el listado de encabezados de fichero agregados a base de datos
	 */
	@Output('ItemSeleccionado')
	private ItemSeleccionado: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Constructor de la clase
	 * @param ArchivosService representa servicio de archivos
	 * @param snackBar para procesar los mensajes al usuario
	 */
	constructor(
		private archivosService: ArchivosService,
		public snackBar: MatSnackBar
	) {
		this.timeoutId = null;
	}

	// Métodos públicos

	/**
	 * Método encargado de recopilar la información del archivo elegido por el usuario
	 * @param evt representa el evento que contiene la información del archivo
	 */
	public handleFileSelect(evt): void {
		// representa array de archivos
		const files = evt.target.files;
		// representa el archivo en cuestión
		this.file = files[0];
		// si el evento contiene algún archivo se crea un nuevo objeto tipo FileReader para el manejo del archivo
		if (files && this.file) {
			// se declara objeto para lectura de archivos
			const reader = new FileReader();
			// carga el archivo elegido por el usuario
			reader.onload = this._handleReaderLoaded.bind(this);
			// lectura del archivo
			reader.readAsDataURL(this.file);
			this.listadoTemporal = [];
			this.GuardarListadoTemporal(this.file);
		}
	};

	/**
	 * Método para eliminar archivos temporales
	 * @param item representa valor del registro a eliminar
	 */
	public EliminarListadoTemporal(item: any): void {
		const index = this.listadoTemporal.indexOf(item);
		if (index > -1) {
			this.listadoTemporal.splice(index, 1);
		}
	};

	/**
	 * Método encargado de procesar la inserción de nuevos registros
	 * @param item representa el archivo o documento actual
	 */
	public Insertar(item): void {
		if (item !== undefined && item !== null && !this.ValidarTam(item) && this.ValidarLimite()) {
			// se agregan datos al formData
			this.formData.append('file', this.file);
			this.formData.append('sistema', this.sistema);
			this.formData.append('tiempoEliminacion', String(this.tiempoEliminacion));
			// se activa barra de progreso
			this.esCargando = true;
			this.archivosService.Create(this.formData).then(
				res => {
					if (res.exito) {
						// se desactiva barra de progreso
						this.esCargando = false;
						// se agrega y se quita del listado respectivamente
						this.GuardarArchivoPermanante(res.data);
						// En el caso de que sea una imagen lo que se esta agregando se actualiza el contenedor de imágenes
						const index = res.data.contentType.indexOf('image');
						if (index > -1) {
							if (this.galeria.length < 1) {
								// se establece en true la carga inicial de la galería de imágenes
								this.cargaInicial = true;
								// se establece el valor del source de la imagen actual
								this.src = { src: this.base64textString.toString(), filename: res.data.filename, contentType: res.data.contentType };
							}
							// se agrega el item de imagen a la galería de imagen
							this.galeria.push({ id: res.data._id, descripcion: this.base64textString.toString(), filename: res.data.filename, contentType: res.data.contentType });
						}
						// se envía el evento al padre con un string base64 y el listado de las carátulas de los archivos agregados
						this.ItemSeleccionado.emit({
							files: this.listadoPermanente,
							src: this.base64textString
						});
						// se elimina de la lista temporal
						this.listadoTemporal = [];
						// se inicializa la variable file
						this.file = null;
						// se borra valor file del formData
						this.formData.delete('file');
						this.snackBar.open(res.data.mensaje, null, {
							duration: 3000
						});
					}
					this.snackBar.open(res.mensaje, null, {
						duration: 3000
					});
				},
				error => {
					this.esCargando = false;
					// Muestra el mensaje de error
					this.snackBar.open(
						error.error.mensaje,
						'Error al intentar guardar el archivo. Contactar al administrador del servicio.',
						{
							duration: 5000
						}
					);
				}
			);
		}
	};

	/**
	 * Método encargado de obtener registro desde la base de datos
	 * @param item representa la carátula del archivo o documento actual
	 */
	public CargarLocal(item): void {
		this.esCargando = true;
		this.archivosService.ShowByIdentificacion(item._id).then(
			res => {
				if (res.exito) {
					// se desactiva barra de progreso
					this.esCargando = false;
					// se procede a realizar la descarga local del fichero en pc de usuario
					const rutaAdjunto = res.data.file;
					const arreglo = this.Base64toUint8(rutaAdjunto);
					const blob = new Blob([arreglo], { type: res.data.contentType });
					const anchor = document.createElement('a');
					const src = window.URL.createObjectURL(blob);
					anchor.href = src;
					anchor.download = res.data.filename;
					document.body.appendChild(anchor);
					anchor.click();
				}
			},
			error => {
				this.esCargando = false;
				// en caso de encontrar registros le avisa al usuario
				this.snackBar.open(
					error.error.mensaje,
					'Error en la descarga de los datos. Contactar al administrador del servicio.',
					{
						duration: 3000
					}
				);
			}
		);
	};

	/**
	 * Método encargado de tramitar la eliminación de un registro de la BD
	 * @param item representa el item o documento actual
	 */
	public Eliminar(item): void {
		// se valida que el item exista y que el usuario tenga permisos para eliminar
		if (item !== undefined && item !== null) {
			this.esCargando = true;
			this.archivosService.Remove(item._id).then(
				res => {
					if (res.exito) {
						this.esCargando = false;
						// en el caso de que el item eliminado sea una imagen se elimina de la galería
						const index = item.contentType.indexOf('image');
						if (index > -1) {
							this.EliminarImgGaleria(item._id);
						}
						// se elimina el item de la lista de archivos permanentes (archivos o documentos en BD)
						this.EliminarListadoPermanente(item);
						// se envía el evento al padre con un string base64 y el listado de las carátulas de los archivos agregados
						this.ItemSeleccionado.emit({
							files: this.listadoPermanente,
							src: null
						});
						// en caso de que sea exitosa la eliminación del registro se le avisa al usuario
						this.snackBar.open(res.mensaje, null, {
							duration: 3000
						});
					}
					else {
						// en caso de que no tenga permisos de eliminación del registro se le avisa al usuario
						this.snackBar.open(res.mensaje, null, {
							duration: 3000
						});
					}
				},
				error => {
					this.esCargando = false;
					// en caso de encontrar registros le avisa al usuario
					this.snackBar.open(
						error.error.mensaje,
						'Error en la eliminación de los datos. Contactar al administrador del servicio.',
						{
							duration: 3000
						}
					);
				}
			);
		}
	};

	/**
	 * Método encargado de navegar hacia adelante en la galería de imágenes
	 */
	public Siguiente(): void {
		if (this.posicion === this.galeria.length - 1) {
			this.posicion = 0;
		} else {
			this.posicion++;
		}
		// se evalúa si existe un parámetro opcional para encabezado específico de ser así se cambia el valor del encabezado del visor
		if (this.galeria[this.posicion].encabezadoEspecifico !== null && this.galeria[this.posicion].encabezadoEspecifico !== undefined && this.Disabled) {
			this.encabezado = this.galeria[this.posicion].encabezadoEspecifico;
		}
		// se establece el valor del source de la imagen actual
		this.src = { src: this.galeria[this.posicion].descripcion, filename: this.galeria[this.posicion].filename, contentType: this.galeria[this.posicion].contentType };
	};

	/**
	 * Método encargado de navegar hacia atrás en la galería de imágenes
	 */
	public Anterior(): void {
		if (this.posicion === 0) {
			this.posicion = this.galeria.length - 1;
		} else {
			this.posicion--;
		}
		// se evalúa si existe un parámetro opcional para encabezado específico de ser así se cambia el valor del encabezado del visor
		if (this.galeria[this.posicion].encabezadoEspecifico !== null && this.galeria[this.posicion].encabezadoEspecifico !== undefined && this.Disabled) {
			this.encabezado = this.galeria[this.posicion].encabezadoEspecifico;
		}
		// se establece valor del source de la imagen actual
		this.src = { src: this.galeria[this.posicion].descripcion, filename: this.galeria[this.posicion].filename, contentType: this.galeria[this.posicion].contentType };
	};

	/**
	 * Método encargado de cargar el listado para la galería y habilita la zona de visualización
	 */
	public CargarGaleria(): void {
		// se carga la librería la primera vez
		if (!this.cargaInicial) {
			this.cargaInicial = true;
			this.listadoPermanente.forEach(element => {
				const index = element.contentType.indexOf('image');
				if (index > -1) {
					// se obtiene la imagen de la base de datos y se agrega al listado
					this.archivosService.ShowByIdentificacion(element._id).then(
						res => {
							if (res.exito) {
								this.esCargando = false;
								// se agrega inclusión de nuevo parámetro virtual para el caso específico de patología que necesitan que por cada imagen se despliegue asociación
								if (element.encabezadoEspecifico !== null && element.encabezadoEspecifico !== undefined && this.disabled) {
									this.galeria.push({ id: element._id, descripcion: res.data.file, filename: res.data.filename, encabezadoEspecifico: element.encabezadoEspecifico, contentType: res.data.contentType });
									this.encabezado = element.encabezadoEspecifico;
								}
								else {
									this.galeria.push({ id: element._id, descripcion: res.data.file, filename: res.data.filename, contentType: res.data.contentType });
								}
							} else {
								// en caso de no encontrar registros le avisa al usuario
								this.snackBar.open(
									res.mensaje,
									'No tiene imágenes agregadas',
									{
										duration: 3000
									}
								);
							}
						},
						error => {
							this.esCargando = false;
							// en caso de encontrar registros le avisa al usuario
							this.snackBar.open(
								error.mensaje,
								'Error en la descarga de los datos.',
								{
									duration: 3000
								}
							);
						}
					);
				}
			});
		}

		// se establece retardo para esperar a que se termine de cargar estructura para la galería
		this.timeoutId = setTimeout(() => {
			if (this.galeria.length) {
				// se evalúa si existe un parámetro opcional para encabezado específico de ser así se cambia el valor del encabezado del visor
				if (this.galeria[this.posicion].encabezadoEspecifico !== null && this.galeria[this.posicion].encabezadoEspecifico !== undefined && this.Disabled) {
					this.encabezado = this.galeria[this.posicion].encabezadoEspecifico;
				}
				this.src = { src: this.galeria[this.posicion].descripcion, filename: this.galeria[this.posicion].filename, contentType: this.galeria[this.posicion].contentType };
				this.mostrarGaleria = true;
			}
			this.timeoutId = null;
		}, 550);
		// se habilita area de galería de imágenes
		if (this.galeria.length > 0) {
			this.areaVisor = true;
		}
	};

	/**
	 * Método encargado de generar descarga local de la imagen actual
	 */
	public DownloadImg(): void {
		// se procede a realizar la descarga local de imágenes en pc de usuario
		const rutaAdjunto = this.src.src;
		const arreglo = this.Base64toUint8(rutaAdjunto);
		const blob = new Blob([arreglo], { type: this.src.contentType });
		const anchor = document.createElement('a');
		const src = window.URL.createObjectURL(blob);
		anchor.href = src;
		anchor.download = this.src.filename;
		document.body.appendChild(anchor);
		anchor.click();
	};

	/**
	 * Método utilizado para eliminar todos los archivos agregados en base de datos asociados a está consulta
	 */
	public EliminarTodo(): void {
		this.esCargando = true;
		this.listadoPermanente.forEach(element => {
			// se obtiene la imagen de la base de datos y se agrega al listado
			this.archivosService.Remove(element._id).then(
				res => {
					if (!res.exito) {
						this.snackBar.open(res.mensaje, null, { duration: 3000 });
					}
				},
				error => {
					this.esCargando = false;
					// en caso de error le avisa al usuario
					this.snackBar.open(error.mensaje, null, {
						duration: 3000
					});
				}
			);
		});
		// en caso de encontrar registros le avisa al usuario
		this.snackBar.open('Se eliminaron registros', null, {
			duration: 3000
		});
	};

	/**
	 * Método utilizado para confirmar todos los archivos agregados en base de datos asociados a está consulta
	 */
	public ConfirmarFicheros(): void {
		this.esCargando = true;
		// se envía listado para ser confirmado en base de datos
		this.archivosService.Update(null, this.listadoPermanente).then(
			res => {
				if (!res.exito) {
					this.esCargando = false;
					this.snackBar.open(res.mensaje, null, { duration: 3000 });
				}
			},
			error => {
				this.esCargando = false;
				// en caso de error le avisa al usuario
				this.snackBar.open(error.mensaje, 'Error al confirmar los ficheros.', {
					duration: 3000
				});
			}
		);
		this.esCargando = false;
		// se notifica al usuario
		this.snackBar.open('Se confirmaron los registros', null, {
			duration: 3000
		});
	};

	// Métodos privados

	/**
	 * Método encargado de transformar el archivo a un string base 64 tipo src para poder ser renderizada en el browser
	 * @param readerEvt Representa el evento que contiene la información del archivo
	 */
	private _handleReaderLoaded(readerEvt): void {
		// convierte el archivo a un string binario
		const binaryString = readerEvt.target.result;
		// se codifica a string base64
		this.base64textString = atob(btoa(binaryString));
	};

	/**
	 * Método encargado de establecer el valor de archivo seleccionado por el usuario
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	private GuardarListadoTemporal(item): void {
		if (item !== undefined && item !== null) {
			this.listadoTemporal.push(item);
		}
	};

	/**
	 * Método encargado de establecer el valor de archivo agregado por el usuario a BD
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	private GuardarArchivoPermanante(item): void {
		if (item !== undefined && item !== null) {
			this.listadoPermanente.push(item);
		}
	};

	/**
	 * Método para eliminar item de la lista de archivos permanentes adjuntos
	 * @param item representa valor del registro a eliminar
	 */
	private EliminarListadoPermanente(item: any): void {
		const index = this.listadoPermanente.indexOf(item);
		if (index > -1) {
			this.listadoPermanente.splice(index, 1);
		}
	};

	/**
	 * Método para eliminar item de la galería de imágenes
	 * @param item representa valor del registro a eliminar
	 */
	private EliminarImgGaleria(item: any): void {
		for (let index = 0; index < this.galeria.length; index++) {
			if (item === this.galeria[index].id) {
				this.galeria.splice(index, 1);
				break;
			}
		}
		// si la lista de galería se queda sin elementos se oculta área de visor para evitar errores en el src
		if (this.galeria.length === 0) {
			this.mostrarGaleria = false;
		}
		// en el caso de que la galería aun contenga elementos se selecciona el primero de la lista para evitar inconsistencias
		if (this.galeria.length > 0) {
			// se evalúa si existe un parámetro opcional para encabezado específico de ser así se cambia el valor del encabezado del visor
			if (this.galeria.encabezadoEspecifico !== null && this.galeria.encabezadoEspecifico !== undefined && this.disabled) {
				this.encabezado = this.galeria.encabezadoEspecifico;
			}
			// se establece el valor del source de la imagen actual
			this.src = { src: this.galeria[0].descripcion, filename: item.filename, contentType: item.contentType };
		}
	};

	/**
	 * Método se encarga de transformar un string base 64 a UInt8Array
	 * @param archivoBase64 representa string en formato base64
	 * @return Retorna un arreglo de tipo Uint8Array
	 */
	private Base64toUint8(archivoBase64): any {
		const BASE64_MARKER = ';base64,';
		const dataURI = archivoBase64;
		const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
		const base64 = dataURI.substring(base64Index);
		const raw = window.atob(base64);
		const rawLength = raw.length;
		const array = new Uint8Array(new ArrayBuffer(rawLength));
		for (let i = 0; i < rawLength; i++) {
			array[i] = raw.charCodeAt(i);
		}
		return array;
	};

	/**
	 * Método encargado de validar límite de inserción
	 * @param item representa archivo o documento actual
	 * @returns Retorna verdadero/falso según validación
	 */
	private ValidarTam(item): boolean {
		if (item.size / 1024 > 20000) {
			// en caso de que la inserción del registro supere el límite permitido se le avisa al usuario
			this.snackBar.open(
				'',
				'El archivo sobrepasa el límite permitido (20 MB)',
				{
					duration: 4000
				}
			);
			return true;
		}
		return false;
	};

	/**
	* Método encargado de validar límite de inserción
	* @returns Retorna verdadero/falso según validación
	*/
	private ValidarLimite(): boolean {
		if (this.listadoPermanente.length >= this.limiteInsercion && this.limiteInsercion !== null && this.limiteInsercion !== undefined) {
			// en caso de que la inserción del registro supere el límite permitido se le avisa al usuario
			this.snackBar.open(
				'',
				'No se puede agregar más items (límite de inserciones alcanzado!)',
				{
					duration: 4000
				}
			);
			return false;
		}
		return true;
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// se obtienen todos los archivos y documentos asociados al asegurado y la vista
		this.listadoPermanente = this.ficheros;
		// se comprueba si existen datos y comprueba si el valor del visor esta habilitado de ser así se carga la galería de imágenes
		if (this.listadoPermanente.length > 0 && this.visor && this.disabled) {
			this.CargarGaleria();
			this.areaVisor = true;
		}
	};
}
