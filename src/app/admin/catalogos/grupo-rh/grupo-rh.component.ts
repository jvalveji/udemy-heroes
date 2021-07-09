// Definición typescript para el componente GrupoRhComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

// se importan librerías de angular a utilizar
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

// Se importan los servicios a utilizar
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { UtilidadesService } from './../../../shared/services/utilidades.service';
import { GrupoRHService } from './grupo-rh.service';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_grupo_rh'])
/**
 * Componente con las operaciones CRUD de tipo de grupo rh  para consumir el servicio de catálogos
 */
@Component({
	selector: 'arca-grupo-rh',
	templateUrl: './grupo-rh.component.html',
	styleUrls: ['./grupo-rh.component.scss']
})
export class GrupoRhComponent implements OnInit {
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que almacena los datos obtenidos de los catálogos
	 */
	public catalogo: any;
	/**
	 * Variable que contiene el filtro del texto a buscar en la lista
	 */
	public txtFiltro: string;
	/**
	 * Representa el item catálogo
	 */
	public item: {
		_id: String;
		descripcion: String;
		estado: Boolean;
	} = {
			_id: '',
			descripcion: '',
			estado: true
		};
	/**
	 * Representa bandera para indicar si el formulario se encuetra en edición
	 */
	public esEdicion = false;
	/**
	 * Variable que almacenta en nombre del catálogo a editar
	 */
	public nombreCatalogo: string;
	/**
	 * Variable contiene el estado para editar ítem
	 */
	public estado = false;
	/**
	 * Representa el objeto en estado inicial antes de que el usuario manipule sus atributos
	 */
	public estadoInicial: any = null;

	/**
	 * Constructor de la clase
	 * *@param _location Parametro que representa el servicio de localización de rutas
	 * @param catalogoService Variable que representa al servicio del catálogo de nutrición correspondiente a este componente
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param utilidadesService Representa servicio de utilidades del proyecto base
	 */
	constructor(private _location: Location,
		private catalogoService: GrupoRHService,
		private msgBox: DialogService,
		private snackBar: MatSnackBar,
		private utilidadesService: UtilidadesService
	) { }

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior y comprueba si el usuario modifico atributos
	 */
	public IrPaginaAnterior(): void {
		// Condición que verificar si hay cambios en el objeto original
		if (
			this.utilidadesService.DiffEstadoObjeto(this.estadoInicial, this.catalogo)
		) {
			// Inicia la barra de progreso
			this.esCargando = true;
			this.msgBox
				.open('QUESTION', 'Hay cambios sin guardar', '¿Seguro que desea salir?')
				.subscribe(res => {
					if (res === 'YES') {
						// Retorna a la página anterior
						this._location.back();
					} else {
						// Oculta la barra de progreso en caso de error
						this.esCargando = false;
					}
				});
		} else {
			// Retorna a la página anterior
			this._location.back();
		}
	};

	/**
	 * Método encargado de agregar un nuevo item al arreglo items del catálogo
	 */
	public AgregarItem(): void {
		this.esEdicion = true;
		if (
			this.item.descripcion === null ||
			this.item.descripcion === undefined ||
			this.item.descripcion === ''
		) {
			// Muestra el mensaje de error
			this.snackBar.open('Debe completar los datos, del nuevo registro', null, {
				duration: 5000
			});
		} else {
			// Inicia la barra de progreso
			this.esCargando = true;
			// Se llama a la función del servicio que envia los datos al server
			this.catalogoService.Create(this.item).then(
				res => {
					// Oculta la barra de progreso una vez obtenida la respuesta
					this.esCargando = false;
					// Recibe la respuesta
					if (res.exito) {
						// Muestra el mensaje de éxito
						this.snackBar.open(res.mensaje, null, {
							duration: 5000
						});
						this.ObtenerCatalogo();
						this.esEdicion = false;
						this.LimpiarItem();
					} else {
						// Muestra el mensaje de 404
						this.snackBar.open(res.mensaje, null, {
							duration: 5000
						});
					}
				},
				err => {
					// Oculta la barra de progreso en caso de error
					this.esCargando = false;
					// Muestra el mensaje con el error
					if (err.error) {
						this.snackBar.open(err.error.message, null, { duration: 5000 });
					}
				}
			);
		}
	}

	/**
	 * Método encargado de enviar los datos del catalogo al servidor para ser actualizados
	 */
	public ActualizarCatalogo(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.Update(this.item).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de éxito
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});
					this.estadoInicial = JSON.parse(JSON.stringify(this.catalogo));
				} else {
					// Muestra el mensaje de 404
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.snackBar.open(err.error.message, null, { duration: 5000 });
				}
			}
		);
	}

	// Métodos privados

	/**
	 * Método en cargado de obtener las clasificaciones de las recetas.
	 */
	private ObtenerCatalogo(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.List().then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Se asigna los datos a la variable para mostrar la lista de ítems.
					this.catalogo = res.data;
					// se almacena el estado inicial de la estructura
					this.estadoInicial = JSON.parse(JSON.stringify(this.catalogo));
				} else {
					// Muestra el mensaje en el caso de que no se encontraran registros asociados al catálogo
					this.snackBar.open(res.mensaje, 'Sin datos.', {
						duration: 5000
					});
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) {
					this.snackBar.open(err.error.message, null, { duration: 5000 });
				}
			}
		);
	}

	/**
	 * Método encargado de limpiar el item
	 */
	public LimpiarItem() {
		this.item = null;
		this.item = {
			_id: '',
			descripcion: '',
			estado: true
		};
	}

	/**
	 * Método encargado de capturar el item actual
	 * @param item representa el item seleccionado por el usuario
	 */
	public CapturarItem(item: any) {
		if (
			this.utilidadesService.DiffEstadoObjeto(this.estadoInicial, this.catalogo)
		) {
			this.ActualizarCatalogo();
		} else {
			this.item = item;
		}
	}

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Carga el catálogo de las clasificaciones
		this.ObtenerCatalogo();
	};
}
