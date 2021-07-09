// Definición typescript para el componente CatalogosListarComponent v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// Se importan los servicios a utilizar
import { CatalogosService } from './../catalogos.service';
import { DialogService } from './../../../shared/controls/dialog/dialog.service';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_catalogos'])

/**
 * Componente destinado al despligue de los catálogos generales de la aplicación
 */
@Component({
	selector: 'arca-catalogos-listar',
	templateUrl: './catalogos-listar.component.html',
	styleUrls: ['./catalogos-listar.component.scss']
})
export class CatalogosListarComponent implements OnInit {
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que almacena los datos obtenidos de los catálogos
	 */
	public catalogos: any;
	/**
	 * Variable que contiene el filtro del texto a buscar en la lista
	 */
	public txtFiltro: string;
	/** Variable que contiene estado de la lista de catálogos a mostrar */
	public cambiarPanel = true;

	/**
	 * Constructor de la clase
	 * @param catalogosCoreService Variable que representa a los servicios del core base
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param _location Parametro que representa el servicio de localización de rutas
	 */
	constructor(private catalogosCoreService: CatalogosService,
		private msgBox: DialogService,
		private _location: Location) { }

	// Métodos públicos

	/**
   * Método encargado de redirigir al usuario a la vista anterior
   */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	// Métodos privados

	/**
	 * Método en cargado de obtener la lista de catálogos del sistema
	 */
	private ObtenerCatalogosSistema(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogosCoreService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.catalogos = res.data;
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
	public ngOnInit(): void {
		// Carga la lista de catálogos del sistema
		this.ObtenerCatalogosSistema();
	};
}
