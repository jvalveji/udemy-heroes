// Definición typescript para el componente formulariosListarComponent v1.1
// Proyecto: Bitzu
// Definiciones por: Ing. Guideon Bojorges <gbojorge@ccss.sa.cr>
// Modificado: (03-08-2021) Ing. Guideon Bojorges <gbojorge@ccss.sa.cr>

//#region Importaciones

import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewEncapsulation,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { animate, style, transition, trigger } from "@angular/animations";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "environments/environment";
/**
 * Importa los servicios a utilizar
 */

import { DialogService } from "../../../../shared/controls/dialog/dialog.service";
import { UtilidadesService } from "../../../../shared/services/utilidades.service";

/**
 * Importa los componentes a utilizar de las rutas
 */
import { StorageService } from "../../../../shared/services/storage.service";
/**
 * Se importan librerias para el manejo de fechas en el calculo de días de espera
 */
import "moment/locale/es";

import moment from "moment";
import { cloneDeep } from "lodash";
import { Console } from "console";
//#endregion

//#region Decorador
@Component({
	selector: "gestion-formularios-centro-logistico-listar",
	templateUrl: "./gestion-formularios-centro-logistico-listar.component.html",
	styleUrls: ["./gestion-formularios-centro-logistico-listar.component.scss"],
	animations: [
		// Evento que se ejecuta la transición "fade in o fade out" para los componentes que tienen como identificador "apps"
		trigger("fadeCard", [
			// Transición de cualquier identificador a "fadeIn"
			transition("* => fadeIn", [
				style({ opacity: 0 }),
				animate(500, style({ opacity: 1 })),
			]),
			// Transición de cualquier identificador a "fadeOut"
			transition("* => fadeOut", [
				style({ opacity: 1 }),
				animate(500, style({ opacity: 0 })),
			]),
		]),
	],
	encapsulation: ViewEncapsulation.Emulated,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
//#endregion

//#region Clase del Componente
export class GestionFormulariosCentroLogisticoListarComponent
	implements OnInit
{
	//#region Variables locales

	/**
	 * Variable para manejar los criterios de gestión a las solicitudes o formularios
	 */
	criterios: cCriterio[] = [
		new cCriterio({
			id: 1,
			descripcion: "Devolver a Solicitante",
			icon: "assignment_return",
		}),
		new cCriterio({ id: 2, descripcion: "Rechazar", icon: "cancel" }),
		new cCriterio({
			id: 3,
			descripcion: "Remitir a Administración MM",
			icon: "check_circle",
		}),
	];

	/**
	 * Datasource de los componentes a listar para pruebas
	 */
	public formularios: Array<any> = [
		{
			id: 1,
			fechaSolicitud: "2021/07/21",
			tipoSolicitud: "alta",
			justificacion: "Se necesita para compras",
			up: "Hospital México",
			nombreSolicitante: "Michael Jimenez Muñoz",
		},
		{
			id: 2,
			fechaSolicitud: "2021/06/27",
			tipoSolicitud: "modificacion",
			justificacion: "Es necesario modificar el material ",
			up: "Hospital San Juan de Dios",
			nombreSolicitante: "Jorge Luis Castro Godinez",
		},
		{
			id: 3,
			fechaSolicitud: "2021/06/10",
			tipoSolicitud: "acceso",
			justificacion: "Es necesario modificar el material ",
			up: "CENDEISSS",
			nombreSolicitante: "Claudio Cordero Soto",
		},
		{
			id: 4,
			fechaSolicitud: "2021/07/15",
			tipoSolicitud: "modificacion",
			justificacion: "Es necesario modificar el material ",
			up: "Area de Salud la Unión",
			nombreSolicitante: "Jorge Valderde Jimenez",
		},
		{
			id: 5,
			fechaSolicitud: "2021/07/10",
			tipoSolicitud: "modificacion",
			justificacion: "Es necesario modificar el material ",
			up: "Area Salud Tibas",
			nombreSolicitante: "Jorge Valderde Jimenez",
		},
		{
			id: 4,
			fechaSolicitud: "2021/07/14",
			tipoSolicitud: "modificacion",
			justificacion: "Es necesario modificar el material ",
			up: "Hospital de Heredia",
			nombreSolicitante: "George Aguilar Prieto",
		},
	];

	/**
	 * Variable para la barra de progreso.
	 */
	public esCargando = false;

	/**
	 * Variable que representa el criterio seleccionado por el usuario de tipo clase criterio para poder levantar
	 * el evento trigger del select
	 */
	public criterioSeleccionado: cCriterio;

	/**formulariosFiltro
	 * Variable que contiene la lista de los formularios
	 */
	public formulariosFiltro: Array<any> = [];
	/**
	 * Variable que contine el contrato seleccionado.
	 */
	public formularioSeleccionado: any;
	/**
	 * Variable que contiene el filtro del texto a buscar en la lista.
	 */
	public txtFiltroOrden: string;

	/**
	 * Url que maneja la ubicación del servidor de recursos Web
	 */
	public UrlWebkit: string;

	/**
	 * Variable que contiene el objeto del usuario logueado en la sesión
	 */
	private usuarioLogueado: any;

	/**
	 * Estado de la búsqueda
	 */
	public banderasBusquedas = [
		{ id: "todos", estado: true },
		{ id: "alta", estado: false },
		{ id: "modificacion", estado: false },
		{ id: "acceso", estado: false },
	];

	/**
	 * Objeto que contiene las banderas que gestionan las tarjetas.
	 */
	public banderas = [
		// Estado de la barra de búsqueda por número de orden de compra o por el nombre del proveedor.
		{ id: "barraBusqueda", estado: false },
		// Estado del mensaje no encontrado de los formularios.
		{ id: "noEncontrado", estado: false },
		// Estado del área del listado de formularios.
		{ id: "listadoformularios", estado: false },
		// Estado del área del contrato cuando es abierta por el usuario.
		{ id: "formularioAbierto", estado: false },
	];

	/**
	 * Variable para controlar la visibilidad del campo observaciones
	 */
	mostrarObservaciones: boolean = false;

	//#endregion

	//#region Constructor-Inicio
	/**
	 * Constructor de la clase
	 * @param utilidadesService Representa los servicios de utilidades
	 * @param articulosContratadosService Representa los servicios de los articulos contratados
	 * @param formulariosService Representa los servicios de formularios
	 * @param inventariosService Representa a los servicios del inventario
	 * @param tipoCambioService Representa a los servicios de tipo de cambio
	 * @param productosService Representa a los servicios de productos
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param _router Representa el módulo de ruteo
	 * @param _location Representa el módulo de localizaciones
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param storage Representa el servicio de almacenamiento temporal entre componentes
	 * @param dialog Representa el servicio de los diálogos
	 * @param route Representa la ruta actualmente activa
	 */
	constructor(
		private utilidadesService: UtilidadesService,

		private msgBox: DialogService,
		private _router: Router,
		private snackBar: MatSnackBar,
		private storage: StorageService,
		public dialog: MatDialog,
		private route: ActivatedRoute
	) {
		this.formularioSeleccionado = null;
		this.txtFiltroOrden = "";
		// Establece el ambiente actual del webkit
		this.UrlWebkit = environment.urlWebkit;
	}

	public ngOnInit() {
		// Se invoca el método encargado de obtener el usuario local de la sesión.
		this.ObtenerUsuarioLocal();
		// Se obtienen todos los formularios
		//this.Obtenerformularios();
		// Se llama al método encargado de la carga inicial de la página.
		this.CargaInicial();
		// Se cargan los tipos de cambios
		//this.ObtenerTipoCambio();
	}

	//#endregion

	//#region Metodos
	/**
	 * Método en cargado de obtener los formularios
	 */
	private Obtenerformularios(): void {
		// Inicia la barra de progreso
		//this.esCargando = true;
		//this.formulariosFiltro = cloneDeep(this.formularios);
		// Se llama a la función del servicio que envia los datos al server
		/*
		this.formulariosService.List().then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Se asigna los datos a la variable para mostrar la lista de ítems.
					this.formularios = cloneDeep(res.data);
					// Se asigna los datos a la variable para mostrar la lista de ítems.
					this.formulariosFiltro = cloneDeep(res.data);
				} else {
					// Muestra el mensaje de error
					this.msgBox.open('ERROR', 'Error', res.mensaje);
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.msgBox.open(
						'ERROR',
						'Error de carga',
						err.error.message
					);
				}
			}
		);
		*/
	}

	/**
	 * Método encargado de obtener las fechas programadas del inventarios para cada uno de los formularios.
	 * @param _id : Variable que contiene el _id del contrato seleccionado para obtener las fechas programas.
	 */
	private ObtenerInventarioByIdformularios(_id: any): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		/*
		// Se llama a la función del servicio que envia los datos al server
		this.entregaProveedoresService.ShowByIdformularios(_id).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Se asigna los datos a la variable para mostrar la lista de ítems.
					this.registrosInventario = res.data;
				} else {
					// Muestra el mensaje de error
					this.msgBox.open(
						'ERROR',
						'Error al guardar los registros',
						res.mensaje
					);
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.msgBox.open(
						'ERROR',
						'Error de cargar los registros',
						err.error.message
					);
				}
			}
		);
		*/
	}

	/**
	 * Métodos encargado de insertar los artículos contratados cuando se realiza la contratación.
	 */
	private InsertarArticulosContratados(articulos: any): void {
		/*
		// Se llama al servicio del modelo de artículos contratados
		this.articulosContratadosService.Update(articulos, 'add').then(res => { },
			err => {
				if (err.error) {
					this.MostrarSnackBar('No se puedo guardar los artículos contratados. Contacte al administrador.', null);
				}
			}
		);
		*/
	}

	/**
	 * Método encargado de registrar inventarios
	 */
	private RegistrarInventario(articulos: Array<any>): void {
		// Inicia la barra de progreso
		this.esCargando = true;

		/*
		// Ciclo que recorre todos los artículos seleccionados
		articulos.forEach(articulo => {
			const articuloRegistrada: any = {
				unidadProgramatica_id: this.usuarioLogueado.unidadProgramatica_id,
				articulo_id: articulo.articulo_id._id
			}
			// Se llama al servicio de formularios para inicializar con el proceso de guardado
			this.formulariosService.CreateByArticulo(articuloRegistrada).then(
				res =>
					// Oculta la barra de progreso una vez obtenida la respuesta
					this.esCargando = false,
				err => {
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
					// Muestra el mensaje con el error
					if (err.error) {
						this.MostrarSnackBar('Error al cargar los artículos al inventario', null);
					}
				}
			);
		});
		*/
	}

	/**
	 * Método encargado de verficar los articulos contratados en la colección de productos y en caso de no encontrarlo ingresarlo
	 * @param articulos contiene los articulos contratados
	 */
	private RegistroProducto(articulos: Array<any>): void {
		// Barra de progreso
		this.esCargando = true;
		/*
		// Se recorre los articulos para verficar que existan en productos
		articulos.forEach(articulo => {
			// Se crea el objeto producto que sera enviado si se necesita ingresar como un producto nuevo
			const producto: any = {
				articulo_id: articulo.articulo_id._id,
				upcs: [{
					codigo: articulo.articulo_id.codigo.replaceAll('-',''),
					descripcion: articulo.articulo_id.descripcion,
					esBase: true,
					estado: true
				}],
				esCongelado: false,
				esHielo: false,
				esEmpaqueBiodegradable: false,
				esPerecedero: false,
				esVentilacion: false
			};
			
			// Se llama al servicio de prodcutos que verifica la existencia del este
			this.productosService.ShowByArticulo(producto.articulo_id).then(
				res => {
					// Si la respuesta es positiva pero la data es igual a null quiere decir que no existe en la coleccion productos
					if(res.data === null){
						// Se procede a llamar al servicio para mandar a guardar el producto
						this.productosService.Create(producto).then(
							res=>{
								// Se mostra el mensaje de guardado
								this.MostrarSnackBar(res.mensaje, null);
							},
							err =>{
								// Se muestra un mensaje de error al guardar el producto
								this.MostrarSnackBar('Error al ingresar el producto', null);
							}
						);
					}
				},
				err =>{
					// Se muestra el mensaje de error al consultar la existencia del producto
					this.MostrarSnackBar('Error consultar los productos ingresados', null);
				}
			);
		});
		*/
	}

	/**
	 * Método encargado de obtener el tipo de cambio actual (Compra)
	 */
	private ObtenerTipoCambio(): void {
		// Se muestra la carga de progreso
		this.esCargando = true;
		// Se prepara los datos de los parámetros para la consulta del tipo de cambios
		const params = new Date().toISOString();
	}

	/**
	 * @name MostrarSnackBar(message,action)
	 * @description Método encargado de crear los mensajes snackBar para la comunicación con el usuario.
	 * @param message : parámetro que obtiene el mensaje del snackBar.
	 * @param action : parámetro que obtiene la acción del snackBar.
	 */
	private MostrarSnackBar(message: string, action: string): void {
		this.snackBar.open(message, action, {
			duration: 3000,
		});
	}

	private CargaInicial(): void {
		// Se activa la bandera de la barra de búsqueda.
		this.ActivarBandera("barraBusqueda");
		// Se activa la bandera de los listados de los formularios u ordenes de compra.
		this.ActivarBandera("listadoformularios");
		// Se activa la bandera informativa 'No encontrado'.
		// this.ActivarBandera('noEncontrado');
		// Se llama al método Obtenerformularios para la consulta de la base de datos.
		//this.Obtenerformularios();
		this.CambioBusqueda("todos");
		this.MostrarTodosformularios();
		this.txtFiltroOrden = "";
	}

	public obtenerCriterioSeleccionado(criterio: any): void {
		if (criterio.id == 3) this.mostrarObservaciones = false;
		else this.mostrarObservaciones = true;
	}

	/**
	 * Método encargado de abrir el dialogo para detallar el motivo de la rescinsión
	 * @param item Representa el componente del tiempo de comida seleccionado por el usuario.
	 */
	public OpenDialogMotivoRescision(contrato: any): void {
		/*
		// Configuracion de la ventana del dialogo
		const configMatDialog = {
			disableClose: false,
			panelClass: '',
			hasBackdrop: true,
			backdropClass: '',
			width: '50%',
			height: '50%',
			maxWidth: 'none',
			maxHeight: 'none',
			position: {
				top: '',
				bottom: '',
				left: '',
				right: ''
			},
			data: {
				contrato: contrato
			}
		};
		// Se crea una instancia del diálogo
		const dialogComponente = this.dialog.open(
			DialogMotivoRescisionComponent,
			configMatDialog
		);
		dialogComponente.afterClosed().subscribe(dato => {
			// Verifica si viene respuesta del server
			if (dato) {
				this.RescindirContrato(contrato, dato.motivo);
			}
		});
		*/
	}

	/**
	 * Método encargado de abrir el dialogo para realizar una amplicación para los formularios por vencer o un adicionar un contrato vencido
	 * @param tipo Representa el tipo de Amplicación, si es un adición para los formularios vencidos y  una ampliación para los formularios por vencer
	 * @tipo1 ampliacion
	 * @tipo2 adicional
	 */
	public OpenDialogAmpliacion(tipo: any): void {
		/*
		// Configuracion de la ventana del dialogo
		const configMatDialog = {
			disableClose: false,
			panelClass: '',
			hasBackdrop: true,
			backdropClass: '',
			width: '50%',
			height: '30%',
			maxWidth: 'none',
			maxHeight: 'none',
			position: {
				top: '',
				bottom: '',
				left: '',
				right: ''
			},
			data: {
				tipo: tipo
			}
		};
		// Se crea una instancia del diálogo
		const dialogComponente = this.dialog.open(
			DialogAmpliacionComponent,
			configMatDialog
		);
		dialogComponente.afterClosed().subscribe(dato => {
			// Verifica si viene respuesta del server
			if (dato) {
				this.AmpliarAdicionarContrato(dato.porcentaje, tipo);
			}
		});
		*/
	}

	/**
	 * Método encargado de mostrar el detalle del formulario
	 * @param formularioSeleccionado : parámetro que contiene el contrato seleccionado por el usuario.
	 * @memberof formulariosListarComponent
	 */
	public MostrarFormulario(formularioSeleccionado: any): void {
		// Se desactiva la bandera de la barra de búsqueda
		this.DesactivarBanderaId("barraBusqueda");
		// Se desactiva la bandera del listado de formularios
		this.DesactivarBanderaId("listadoformularios");
		// Se activa la bandera del formulario abierto
		this.ActivarBandera("formularioAbierto");
		// Se le asigna a la variable global el parámetro formularioSeleccionado.
		this.formularioSeleccionado = formularioSeleccionado;
	}

	/**
	 * Método encargado de ocultar la orden de compra abierto para que se muestre nuevamente la lista de compras.
	 * @memberof formulariosListarComponent
	 */
	public OcultarContrato(): void {
		// Se activa la bandera de la barra de búsqueda.
		this.ActivarBandera("barraBusqueda");
		// Se activa la bandera del listado de formularios o ordenes de compra.
		this.ActivarBandera("listadoformularios");
		// Se desactiva la bandera del contrato que está actualmente abierto.
		this.DesactivarBanderaId("formularioAbierto");
		//Ocultar detalle de observaciones
		this.mostrarObservaciones = false;
		//inicializar el select del detalle
		this.criterioSeleccionado = null;
	}

	/**
	 * Método encargado de filtrar todos los formularios de alta
	 */
	public FiltrarFormulariosAlta(): void {
		// Se limpia la lista de filtrados
		this.formulariosFiltro = [];
		// Se realiza el ciclo para obtener todos los formularios vigentes
		for (let index = 0; index < this.formularios.length; index++) {
			// Verifica que el estado sea true
			if (this.formularios[index].tipoSolicitud == "alta") {
				this.formulariosFiltro.push(this.formularios[index]);
			}
		}
	}

	/**
	 * Método encargado de filtrar todos los formularios de modificación
	 */
	public FiltrarFormulariosModificar(): void {
		// Se limpia la lista de filtrados
		this.formulariosFiltro = [];
		// Se realiza el ciclo para obtener todos los formularios vigentes
		for (let index = 0; index < this.formularios.length; index++) {
			// Verifica que el estado sea false
			if (this.formularios[index].tipoSolicitud == "modificacion") {
				this.formulariosFiltro.push(this.formularios[index]);
			}
		}
	}

	/**
	 * Método encargado de mostrar todos los formularios
	 */
	public MostrarTodosformularios(): void {
		// Se limpia la lista de filtros
		this.formulariosFiltro = [];
		// Se le asigna todos los formularios al filtro
		this.formulariosFiltro = cloneDeep(this.formularios);
	}

	/**
	 * Método encargado de obtener la bandera que está activa para el cambio del buscador.
	 * @returns Retorna el objeto de la bandera de búsqueda seleccionado.
	 */
	public ObtenerBusquedaSeleccionado(): any {
		// Variable que establece el objeto de la bandera que va a estar activa.
		let banderaActiva = null;
		// Ciclo que recore la lista de banderas de búsqueda para identifica al que está activa.
		for (const flag of this.banderasBusquedas) {
			if (flag.estado) {
				banderaActiva = flag;
			}
		}
		// Condición que verifica si la bandera esta nulo, si es así, entonces se activara el predeterminado que es "todos"
		if (!banderaActiva) {
			banderaActiva = this.banderasBusquedas.find((element) => {
				return element.id === "todos";
			});
		}
		return banderaActiva;
	}

	/**
	 * Método encargado de obtener el usuario local de la sesión
	 */
	private ObtenerUsuarioLocal(): void {
		const dato = this.utilidadesService.ListUsuarioLocal();
		if (dato) {
			this.usuarioLogueado = dato;
		}
	}

	/**
	 * Método encargado de confirmar el guardado de los datos
	 */
	public ConfirmarGuardar(): void {
		// Se muestra la barra de progresos
		this.esCargando = true;
		// Se guarda el componente princiapl
		const me = this;
		// Variable que contiene el mensaje
		const mensaje =
			"¿Seguro que desea confirmar y guardar la gestión del formulario? Esta acción no puede deshacerse.";
		// Muestra el mensaje de confirmación.
		this.msgBox
			.open("QUESTION", "CONFIRMAR GUARDADO", mensaje)
			.subscribe((res) => {
				// Valida la respuesta
				if (res === "YES") {
					// Oculta la barra de progreso una vez obtenida la respuesta
					this.esCargando = false;
				} else {
					// Oculta la barra de progreso una vez obtenida la respuesta
					this.esCargando = false;
				}
			});
	}

	/**
	 * Método encargado de desactivar todas las banderas.
	 */
	public DesactivarBanderas(): void {
		// Ciclo que recorre el arreglo de banderas.
		this.banderas.forEach((element) => {
			// Establece el estado en falso para la desactivación.
			element.estado = false;
		});
	}

	/**
	 * Método encargado de desactivar bandera por ID.
	 * @param id : variable que contiene el id que se desea desactivar.
	 */
	public DesactivarBanderaId(id: string): void {
		// Ciclo que recorre el arreglo de banderas.
		this.banderas.forEach((element) => {
			// Condición que realiza la comparación del id del elemento y el id del parámetro.
			if (element.id === id) {
				// Establece el estado en falso para la desactivación.
				element.estado = false;
			}
		});
	}

	/**
	 * Método encargado de activar bandera por ID
	 */
	public ActivarBandera(id: string): void {
		// Ciclo que recorre el arreglo de banderas.
		this.banderas.forEach((element) => {
			// Condición que realiza la comparación del id del elemento y el id del parámetro.
			if (element.id === id) {
				// Establece el estado en verdadero para la activación.
				element.estado = true;
			}
		});
	}

	//#endregion

	//#region Eventos

	/**
	 * Método encargado de obtener el estado de la bandera solicitado.
	 * @param id : variable que contiene el id de la bandera que desean solicitar.
	 * @returns Retorna el estado obtenido de la bandera.
	 */
	public ObtenerEstadoBandera(id: string): Boolean {
		// Variable que establecerá el estado de la bandera seleccionado.
		let estado = false;
		// Ciclo que recorre el arreglo de banderas.
		this.banderas.forEach((element) => {
			// Condición que realiza la comparación del id del elemento y el id del parámetro.
			if (element.id === id) {
				// Establece el estado en verdadero para la activación.
				estado = element.estado;
			}
		});
		return estado;
	}

	/**
	 * Método encargado de cambiar la búsqueda para todos, vigentes o vencidos
	 * @param seleccionado : Parámetro que contiene el tipo de búsqueda que desea realizar
	 */
	public CambioBusqueda(seleccionado: String): void {
		// Ciclo que recorre todas la banderas de búsqueda para activar la que seleccionó el usuario.
		for (const flag of this.banderasBusquedas) {
			// Condición que verifica si la bandera fue el que seleccionó el usuario.
			if (flag.id === seleccionado) {
				flag.estado = true;
			} else {
				flag.estado = false;
			}
		}
	}

	/**
	 * Método encargado de filtrar todos los formularios de acceso
	 */
	public FiltrarFormulariosAcceso(): void {
		// Se limpia la lista de filtrados
		this.formulariosFiltro = [];
		// Se realiza el ciclo para obtener todos los formularios vigentes
		for (let index = 0; index < this.formularios.length; index++) {
			// Verifica que el estado sea false
			if (this.formularios[index].tipoSolicitud == "acceso") {
				this.formulariosFiltro.push(this.formularios[index]);
			}
		}
	}

	/**
	 * Método encargado de cambiar el placeholder de la barra de búsqueda de formularios.
	 * @returns : Retorna de tipo string el texto que tiene que imprimir dentro de la caja de búsqueda.
	 */
	public CambioPlaceHolderBusqueda(): string {
		let descripcion = "";
		switch (this.ObtenerBusquedaSeleccionado().id) {
			case "todos": {
				descripcion = "Buscar formularios";
				break;
			}
			case "alta": {
				descripcion =
					"Buscar formularios  alta de materiales/servicios";
				break;
			}
			case "modificacion": {
				descripcion =
					"Buscar formularios modificación de materiales/servicios";
				break;
			}
			case "acceso": {
				descripcion =
					"Buscar formularios acceso de materiales/servicios";
				break;
			}
			default: {
				descripcion = "Buscar formularios";
				break;
			}
		}
		return descripcion;
	}

	/**
	 * Método en cargado de obtener los formularios filtrados por la descripción de la unidad programatica
	 */
	public ObtenerformulariosPorFiltro(): void {
		let banderaActiva = this.banderasBusquedas.find((element) => {
			return element.estado === true;
		});
		if (!banderaActiva) {
			banderaActiva = this.banderasBusquedas.find((element) => {
				return element.id === "todos";
			});
		}
		let params;
		if (this.txtFiltroOrden.length >= 3) {
			if (!Number.isNaN(parseInt(this.txtFiltroOrden, 10))) {
				params = {
					numOrdenCompra: this.txtFiltroOrden,
					tipoBusqueda: banderaActiva.id,
					texto: null,
					unidadProgramatica_id:
						this.usuarioLogueado.unidadProgramatica_id,
				};
			} else {
				params = {
					numOrdenCompra: null,
					tipoBusqueda: banderaActiva.id,
					texto: this.txtFiltroOrden,
					unidadProgramatica_id:
						this.usuarioLogueado.unidadProgramatica_id,
				};
			}
			// Inicia la barra de progreso
			//	this.esCargando = true;
			/*
				// Se llama a la función del servicio que envia los datos al server
				this.formulariosService.ShowByFiltro(params).then(
					res => {
						// Oculta la barra de progreso una vez obtenida la respuesta
						this.esCargando = false;
						// Recibe la respuesta
						if (res.exito) {
							// Se realiza una limpieza en el listado de formularios.
							this.formulariosFiltro = [];
							// Se asigna los datos a la variable para mostrar la lista de ítems.
							this.formulariosFiltro = res.data;
							if (this.formulariosFiltro.length === 0) {
								this.MostrarSnackBar(
									'No se encontró resultados con: ' +
									this.txtFiltroOrden,
									null
								);
							}
						} else {
							// Muestra el mensaje de error
							this.msgBox.open('ERROR', 'Error', res.mensaje);
						}
					},
					err => {
						// Oculta la barra de progreso en caso de error
						this.esCargando = false;
						// Muestra el mensaje con el error
						if (err.error) {
							this.msgBox.open(
								'ERROR',
								'Error de carga',
								err.error.message
							);
						}
					}
				);
			} else {
				this.MostrarSnackBar(
					'El texto debe de contener al menos 3 caracteres.',
					null
				);
			
			*/
		}
	}

	/**
	 * Método encargado limpiar la barra de búsqueda.
	 * @memberof formulariosListarComponent
	 */
	public LimpiarBusqueda(): void {
		this.txtFiltroOrden = "";
		this.formularios = [];
		this.formulariosFiltro = [];
		this.Obtenerformularios();
	}

	//#endregion
}
//#endregion

//#region Clases
class cCriterio {
	id: number;
	descripcion: string;
	icon: string;
	constructor(criterio?: any) {
		this.id = (criterio && criterio.id) || null;
		this.descripcion = (criterio && criterio.descripcion) || null;
		this.icon = (criterio && criterio.icon) || null;
	}
	get color(): string {
		let color = "";
		switch (this.id) {
			case 1:
				color = "orange";
				break;
			case 2:
				color = "red";
				break;
			case 3:
				color = "green";
				break;
		}
		return color;
	}
}
//#endregion
