// Definición typescript para el componente LayoutComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit } from '@angular/core';

// Se importa los servicios a utilizar
import { UtilidadesService } from './../../shared/services/utilidades.service';
import { ParametrosService } from './../parametros/parametros.service';

/**
 * Componente utilizado para "contener" las vistas del módulo USUARIOS
 */
@Component({
	selector: 'arca-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
	/**
    * Constructor de la clase
    * @param utilidadesService Representa el servicio de utilidades
    * @param parametrosService Representa el servicio de utilidades
    */
	constructor(private utilidadesService: UtilidadesService,
		private parametrosService: ParametrosService) { }

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
