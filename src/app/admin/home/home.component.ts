// Definición typescript para el componente HomeComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (03-07-2020) Ing. Dagoberto Gómez Jiménez

import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProcesoSIGESComponent } from '../proceso-siges/proceso-siges.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['administracion'])
/**
 * Componente destinado al despligue y manejo del home del módulo ADMIN
 */
@Component({
	selector: 'arca-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	animations: [
		// Evento que se ejecuta la transición 'slide' para los componentes que tiene como identificador 'slideBtnMenuApps'
		trigger('slideBtnMenuApps', [
			// Evento que se dispara cuando el estado está 'cerrado'
			state('closed', style({
				height: '40px'
			})),
			// Transición que se ejecuta cuando el estado cambia de abierto a cerrado
			transition('open => closed', [
				animate('0.2s')
			]),
			// Transición que se ejecuta cuando el estado cambia de cerrado a abierto
			transition('closed => open', [
				animate('0.2s')
			]),
		]),
		// Evento que se ejecuta la transición 'slide' para los componentes que tienen como identificador 'slideMenuApps'
		trigger('slideMenuApps', [
			// Evento que se dispara cuando el estado está 'cerrado'
			state('closed', style({
				display: 'none',
			})),
			// Transición que se ejecuta cuando el estado cambia de abierto a cerrado
			transition('open => closed', [
				animate('0.2s')
			]),
			// Transición que se ejecuta cuando el estado cambia de cerrado a abierto
			transition('closed => open', [
				animate('0.2s')
			]),
		]),
		// Evento que se ejecuta la transición 'fade in o fade out' para los componentes que tienen como identificador 'apps'
		trigger('apps', [
			// Transición de cualquier identificador a 'fadeIn'
			transition('* => fadeIn', [
				style({ opacity: 0 }),
				animate(1000, style({ opacity: 1 }))
			]),
			// Transición de cualquier identificador a 'fadeOut'
			transition('* => fadeOut', [
				animate(1000, style({ opacity: 0 }))
			])
		])
	]
})
export class HomeComponent {

	/**
	 * Constructor de la clase
	 * @param dialogos Representa a la ventana de dialogo de material
	 */
	constructor(private dialogos: MatDialog) { }

	// Métodos públicos

	/**
	 * Método encargado de mostrar la ventana para ejecutar el proceso de cargar del catálogo
	 * del SIGES en la base de datos
	 * @param _idSIGES Parámetro con el identificador del servicio SIGES
	 */
	public SIGES(_idSIGES?: number): void {
		// Se establece una variable para indicar la configuración básica de la ventana de búsqueda
		const configDialogo =
		{
			disableClose: true,
			panelClass: 'full-width-dialog',
			hasBackdrop: true,
			width: '50%',
			height: '72%',  // Este porcentaje varia si el componente posee filtros o no
			maxWidth: '100vw',
			maxHeight: '100vh'
		};

		// Valida si existe un id de SIGES para enviar al componente
		if (_idSIGES) {
			// Agrega la propiedad llamada "data" al objeto con las configuraciones para el diálogo
			configDialogo['data'] = {
				idSIGES: _idSIGES
			};
		}

		// Se crea una variable que representa a la ventana
		const sigesTask = this.dialogos.open(ProcesoSIGESComponent, configDialogo);
	};
}
