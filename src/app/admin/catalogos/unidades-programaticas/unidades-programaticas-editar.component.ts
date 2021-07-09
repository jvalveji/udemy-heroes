// Definición typescript para el componente UnidadesProgramaticasEditarComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';

// Se importan los servicios a utilizar
import { DialogService } from './../../../shared/controls/dialog/dialog.service';

// Se importan las interfaces a utilizar
import { IUnidadProgramatica } from './../../../shared/interfaces/unidad-programatica';
import { UnidadesProgramaticasService } from './unidades-programaticas.service';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_cat_unidades_programaticas'])
/**
 * Componente destinado al despligue y manejo del catálogo de unidades programáticas
 */
@Component({
	selector: 'arca-unidades-programaticas-editar',
	templateUrl: './unidades-programaticas-editar.component.html',
	styleUrls: ['./unidades-programaticas-editar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnidadesProgramaticasEditarComponent implements OnInit {
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
	 * @param catalogosService Variable que representa a los servicios del core base
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 */
	constructor(private _location: Location,
		private catalogosService: UnidadesProgramaticasService,
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
		// Se declara una variable de tipo interfaz (unidad programática)
		const item: IUnidadProgramatica = {
			idUP: 0,
			descripcion: '<Nombre unidad programática>',
			estado: true
		};

		// Agrega un nuevo item al catálogo
		this.catalogo.unshift(item); // Primero
		// this.catalogo.push(item); // Último
	};

	// Métodos privados

	/**
	 * Método en cargado de obtener las unidades programáticas
	 */
	private ObtenerUnidadesProgramaticas(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.catalogosService.List().then((res) => {
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
	}

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Carga el catálogo de unidades programáticas
		this.ObtenerUnidadesProgramaticas();
	};
}
