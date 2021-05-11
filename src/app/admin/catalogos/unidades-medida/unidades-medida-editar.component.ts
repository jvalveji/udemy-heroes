// Definición typescript para el componente UnidadesMedidaEditarComponent v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
// Se importan los servicios a utilizar
import { UnidadesMedidaService } from './unidades-medida.service';
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { UtilidadesService } from './../../../shared/services/utilidades.service';

// Se importan las interfaces a utilizar
import { cloneDeep } from 'lodash';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_unidades_medida'])
/**
 * Componente destinado al despligue y manejo del catálogo de tipos unidades de medida
 */
@Component({
	selector: 'arca-unidades-medida-editar',
	templateUrl: './unidades-medida-editar.component.html',
	styleUrls: ['./unidades-medida-editar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class UnidadesMedidaEditarComponent implements OnInit {
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que almacena los datos obtenidos del catálogo
	 */
	public tiposUnidadesMedida: any = [];
	/**
	 * Variable que contiene el índice del tipo de unidad de medida seleccionada
	 */
	public indexTipoUMSeleccionado = -1;
	/**
	 * Variable que representa una unidad de medida
	 */
	public unidadesMedida: any = [];
	/**
	 * Variable con el dato del filtro a buscar en la lista
	 */
	public txtFiltro: string;
	/**
	 * Variable que verifica si se seleccionó algún tipo de unidad de medida
	 */
	public esTipoUMSeleccionado = false;
	/**
	 * Variable que almacena un elemento temporal para el deshacer
	 */
	public elementoTemporal: any;
	/**
	 * Variable que identifica si se está realizando una nueva inserción de tipos de unidades de medida
	 */
	public esNuevo = false;
	/**
	 * Variable que almacena el estado inicial del catálogo
	 */
	private estadoInicial: any;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param catalogosService Variable que representa a los servicios de unidades de medida
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param utils Representa el servicio de utilidades
	 */
	constructor(private _location: Location,
		private catalogoService: UnidadesMedidaService,
		private msgBox: DialogService,
		private snackBar: MatSnackBar,
		private utils: UtilidadesService) { }

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la página anterior
	 */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	/**
	 * Método encargado de ir al listado de la unidad de medida
	 */
	public IrListado(): void {
		if (this.ValidarCambios()) {
			// Inicia la barra de progreso
			this.esCargando = true;
			this.msgBox
				.open('QUESTION', 'Hay cambios sin guardar', '¿Seguro que desea salir?')
				.subscribe(res => {
					if (res === 'YES') {
						// Oculta la barra de progreso en caso de error
						this.esCargando = false;
						// Retorna a la página anterior
						this.esTipoUMSeleccionado = false;
						this.esNuevo = false;
						this.tiposUnidadesMedida = cloneDeep(this.estadoInicial);
					} else {
						// Oculta la barra de progreso en caso de error
						this.esCargando = false;
						this.esTipoUMSeleccionado = true;
					}
				});
		} else {
			this.esTipoUMSeleccionado = false;
		}
	}

	/**
	 * Método encargado de enviar los datos del catalogo al servidor para ser actualizados
	 */
	public ActualizarCatalogo(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.Update(this.tiposUnidadesMedida[this.indexTipoUMSeleccionado]).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de éxito
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});
					this.estadoInicial = cloneDeep(this.tiposUnidadesMedida);
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

	/**
	 * Método encargado de enviar los datos del catalogo al servidor para ser insertado
	 */
	public InsertarCatalogo(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.Create(this.tiposUnidadesMedida[this.indexTipoUMSeleccionado]).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					// Muestra el mensaje de éxito
					this.snackBar.open(res.mensaje, null, {
						duration: 5000
					});
					this.estadoInicial = cloneDeep(this.tiposUnidadesMedida);
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

	/**
	 * Método encargado de vaidar los cambios
	 */
	public ValidarCambios(): boolean {
		return this.utils.DiffEstadoObjeto(this.estadoInicial, this.tiposUnidadesMedida);
	};

	/**
	 * Método encargado de eliminar la unidad de medida
	 * @param {number} index Representa el índice de la unidad de medida seleccionado por el usuario
	 */
	public EliminarUnidadMedida(index: number): void {
		// Se guarda el elemento eliminado en una variable con una referencia disinta;
		this.elementoTemporal = cloneDeep(this.tiposUnidadesMedida[this.indexTipoUMSeleccionado].items);
		// Se procede a eliminar el item
		this.tiposUnidadesMedida[this.indexTipoUMSeleccionado].items.splice(index, 1);
		// Se guarda la referencia del snackBar para despues deshacer la acción
		const snackBarRef = this.snackBar.open('La unidad de medida ha sido eliminado.', 'DESHACER', {
			duration: 5000,
		});
		// Se desarrolla la acción de deshacer
		snackBarRef.onAction().subscribe(() => {
			this.tiposUnidadesMedida[this.indexTipoUMSeleccionado].items = cloneDeep(this.elementoTemporal);
			this.elementoTemporal = null;
		});
	}

	/**
	 * Método encargado de guardar una nueva unidad de medida
	 */
	public AgregarUnidadMedida(): void {
		const nuevo = {
			descripcion: '',
			simbolo: '',
			equivalencia: {
				descripcion: '',
				valor: null
			},
			estado: true
		}
		this.tiposUnidadesMedida[this.indexTipoUMSeleccionado].items.push(nuevo);
	}

	/**
	 * Método encargado de guardar una nueva unidad de medida
	 */
	public AgregarTipoUnidadMedida(): void {
		const nuevo = {
			descripcion: 'Nuevo',
			estado: true,
			items: [
				{
					descripcion: '',
					simbolo: '',
					equivalencia: {
						descripcion: '',
						valor: null
					},
					estado: true
				}
			]
		}
		this.tiposUnidadesMedida.push(nuevo);
		this.indexTipoUMSeleccionado = this.tiposUnidadesMedida.length - 1;
		this.esTipoUMSeleccionado = true;
		this.esNuevo = true;
	}

	/**
	 * Método en cargado de obtener los tipos de unidades de medida
	 * @param data Representa el tipo de unidad de medida seleccionada
	 */
	public ObtenerItemsUnidadMedida(data: any): void {
		const index = this.tiposUnidadesMedida.indexOf(data);
		// Valida que exista un id para consultar sus items
		if (index >= 0) {
			this.indexTipoUMSeleccionado = index;
			this.esTipoUMSeleccionado = true;
		}
	};

	// Métodos privados

	/**
	 * Método en cargado de obtener los tipos de unidades de medida
	 */
	private ObtenerTiposUnidadesMedida(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogoService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.tiposUnidadesMedida = res.data;
				// Se guarda el estado inicial para la validación
				this.estadoInicial = cloneDeep(this.tiposUnidadesMedida);
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
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Obtiene los tipos de unidades de medida
		this.ObtenerTiposUnidadesMedida();
	};
}
