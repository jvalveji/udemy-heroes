// Definición typescript para el componente ProfesionalesEditarComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Yendri González Sánchez <yvgonzals@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

// Se importan los servicios a utilizar
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { ProfesionalesService } from './profesionales.service';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_profesionales'])
/**
 * Componente destinado al despligue y manejo del catálogo de profesionales
 */
@Component({
	selector: 'arca-profesionales',
	templateUrl: './profesionales-editar.component.html',
	styleUrls: ['./profesionales-editar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class ProfesionalesEditarComponent implements OnInit {
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
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param profesionalesService Variable que representa a los servicios de profesionales del core base
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 */
	constructor(private _location: Location,
		private profesionalesService: ProfesionalesService,
		private msgBox: DialogService) { }

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior
	 */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	/**
	 * Método encargado de agregar un nuevo item al arreglo items del catálogo
	 */
	public AgregarItem(): void {
		// Limpia el filtro
		this.txtFiltro = null;
	};

	// Métodos privados

	/**
	 * Método en cargado de obtener los profesionales
	 */
	private ObtenerProfesionales(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.profesionalesService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.catalogo = res.data;
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
		// Carga el catálogo de tipos de profesionales
		this.ObtenerProfesionales();
	};
}
