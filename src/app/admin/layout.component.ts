// Definición typescript para el componente LayoutComponent v2.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-07-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';

// Se importa los servicios a utilizar
import { UtilidadesService } from './../shared/services/utilidades.service';
import { ParametrosService } from './parametros/parametros.service';

/**
 * Componente utilizado para "contener" las vistas del módulo ADMIN
 */
@Component({
	selector: 'arca-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
	// Variable para mostrar/ocultar el spinner de carga
	public loading: boolean;

	/**
    * Constructor de la clase
    */
	constructor(router: Router) {
		// Inicia en falso la bandera del spinner
		this.loading = false;
		// Crea un observable para el evento de cambio de rutas
		router.events.subscribe(
			(event: RouterEvent): void => {
				// Valida si esta iniciando el cmabio de ruta
				if (event instanceof NavigationStart) {
					// Activa la bandera (muestra el spinner)
					this.loading = true;
				} else if (event instanceof NavigationEnd) {
					// Inactiva la bandera (oculta el spinner)
					this.loading = false;
				}
			}
		);
	}

	/**
    * Método inicial del componente
    */
	public ngOnInit() {
		// // Obtiene los datos del usuario local
		// const usuarioLocal = this.utilidadesService.ListUsuarioLocal();
		// // Obtiene los parámetros del CORE BASE
		// this.parametrosService.ListByAplicacion(usuarioLocal.aplicacion_id).then((res) => {
		// 	// Guarda en el local store la variable con los parámetros
		// 	this.utilidadesService.UpdateParametrosLocal(res.data);
		// }, (err) => {
		// 	// Muestra el mensaje con el error de validación del logueo
		// 	// if (err.error) this.msgBox.open('ERROR', 'Error de carga', err.error.mensaje);
		// 	// .subscribe(res => {});
		// 	console.log('Error tratando de obtener los parámetros para esta aplicación');
		// });
	};
}
