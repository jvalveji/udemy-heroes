// Definición typescript para el componente TiposPartidaPresupuestariaComponent v2.0.0
// Proyecto: Arca - Nutrición
// Definiciones por: Ing. Félix Lee Pan <fleepan@ccss.sa.cr> (26-05-2020)
// Descripción: Componente con las operaciones CRUD de TIPOS DE PARTIDA PRESUPUESTARIA para consumir el servicio de nutrición.
// Modificado por: (17-07-2020) Ing. Dagoberto Gómez Jiménez

/**
 * Se importan librerías de angular a utilizar
 */
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
/**
 * Se importan los servicios a utilizar
 */
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { UtilidadesService } from './../../../shared/services/utilidades.service';
import { TiposPartidaPresupuestariaService } from './tipos-partida-presupuestaria.service';
/**
 * Se importa el decorador para la seguridad en las rutas de la aplicación
 */
import { Activate } from './../../../shared/decorators/activate.decorator';

/**
 * Permiso de la aplicación para este componente (ruta)
 */
@Activate(['adm_cat_partida_presupuestaria'])

/** Componente con las operaciones CRUD de TIPOS DE PARTIDA PRESUPUESTARIA para consumir el servicio de nutrición */
@Component({
  selector: 'arca-tipos-partida-presupuestaria',
  templateUrl: './tipos-partida-presupuestaria.component.html',
  styleUrls: ['./tipos-partida-presupuestaria.component.scss']
})
export class TiposPartidaPresupuestariaComponent implements OnInit {
	/** Variable para la barra de progreso */
	public esCargando = false;
	/** Variable que almacena los datos obtenidos de los catálogos */
	public catalogo: any;
	/** Variable que contiene el filtro del texto a buscar en la lista */
	public txtFiltro: string;
	/** Variable que almacenta en nombre del catálogo. */
	public nombreCatalogo: string;
	/** Variable contiene el estado para editar ítem */
	public estado = false;
	/** representa el objeto en estado inicial antes de que el usuario manipule sus atributos */
	public estadoInicial: any = null;
	/** representa el item catálogo */
	public item: {
		_id: String,
		descripcion: String,
		codigo: number,
		estado: Boolean,
	} = {
			_id: '',
			descripcion: '',
			codigo: 0,
			estado: true,
		};
	/** Representa bandera para indicar si el formulario se encuetra en edición */
	public esEdicion = false;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param catalogoService Variable que representa al servicio del catálogo de nutrición correspondiente a este componente
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param utilidadesService Representa servicio de utilidades del proyecto base
	 */
	constructor(private _location: Location,
		private catalogoService: TiposPartidaPresupuestariaService,
		private msgBox: DialogService,
		private snackBar: MatSnackBar,
		public utilidadesService: UtilidadesService
	) { }

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior y comprueba si el usuario modifico atributos
	 */
	public IrPaginaAnterior(): void {
		// Condición que verificar si hay cambios en el objeto original
		if (this.utilidadesService.DiffEstadoObjeto(this.estadoInicial, this.catalogo)) {
			// Inicia la barra de progreso
			this.esCargando = true;
			this.msgBox
				.open('QUESTION', 'Hay cambios sin guardar', '¿Seguro que desea salir?')
				.subscribe(res => {
					if (res === 'YES') {
						// Retorna a la página anterior
						this._location.back();
					}
					else {
						// Oculta la barra de progreso en caso de error
						this.esCargando = false;
					}
				});
		}
		else {
			// Retorna a la página anterior
			this._location.back();
		}
	}

	/**
	  * Método encargado de agregar un nuevo item al arreglo items del catálogo
	  */
	public AgregarItem(): void {
		this.esEdicion = true;
		if (this.item.descripcion === null || this.item.descripcion === undefined || this.item.descripcion === '') {
			// Muestra el mensaje de error
			this.snackBar.open('Debe completar los datos, del nuevo registro', null, {
				duration: 5000
			});
		}
		else {
			// Inicia la barra de progreso
			this.esCargando = true;
			// Se llama a la función del servicio que envia los datos al server
			this.catalogoService.Create(this.item).then((res) => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de éxito
					this.msgBox.open('INFO', 'Cátalogo', res.mensaje);
					this.ObtenerCatalogo();
					this.esEdicion = false;
					this.LimpiarItem();
				}
				else {
					// Muestra el mensaje de 404
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});

				}

			}, (err) => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje con el error
				if (err.error) { this.snackBar.open(err.error.message, null, { duration: 5000 }); }
			});
		}
	};

	/**
	 * Método encargado de enviar los datos del catalogo al servidor para ser actualizados
	 */
	public ActualizarCatalogo(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.Update(this.item).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
				this.estadoInicial = JSON.parse(JSON.stringify(this.catalogo));

			}
			else {
				// Muestra el mensaje de 404
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
			}

		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.snackBar.open(err.error.message, null, { duration: 5000 }); }
		});
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
				if (err.error) { this.snackBar.open(err.error.message, null, { duration: 5000 }); }

			}
		);
	}

	/**
	 * Método encargado de limpiar el item
	 */
	public LimpiarItem(): void {
		this.item = null;
		this.item = {
			_id: '',
			descripcion: '',
			codigo: 0,
			estado: true,
		};
	}
	/**
	 * Método encargado de capturar el item actual
	 * @param item representa el item seleccionado por el usuario
	 */
	public CapturarItem(item: any): void {
		if (this.utilidadesService.DiffEstadoObjeto(this.estadoInicial, this.catalogo)) {
			this.ActualizarCatalogo();
		} else {
			this.item = item;
		}
	}

	/**
	 * Método encargado de realizar la carga inicial del componente
	 */
	public ngOnInit(): void {
		// Carga el catálogo
		this.ObtenerCatalogo();
		// se le asigna el nombre del catálogo
		this.nombreCatalogo = 'Tipos de partida presupuestarias';
	}
}
