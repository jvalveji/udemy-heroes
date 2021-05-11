// Definición typescript para el componente TestComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportsComponent } from './../shared/controls/reports/reports.component';
import { EtlsTaskService, TiposRespuestaETLPentaho } from './../shared/controls/etls-task/etls-task.service';

/**
 * Componente destinado a utilziarse en pruebas de otros componentes y que
 * sirven a modo demostración para otros usuarios desarrolladores
 */
@Component({
	selector: 'arca-test',
	templateUrl: './test.component.html',
	styleUrls: ['./test.component.scss']
})
export class TestComponent {
	/**
	 * Constructor de la clase
	 * @param dialogos Representa a la ventana de dialogo de material
	 */
	constructor(private dialogos: MatDialog,
		private etlService: EtlsTaskService) { }

	/**
	 * Métodso encargado de llamar a la ventana de reportes
	 */
	public ReportePruebaPDF(): void {
		// Se establece una variable para indicar la configuración básica de la ventana de búsqueda
		const configDialogo =
		{
			disableClose: false,
			panelClass: 'full-width-dialog',
			hasBackdrop: true,
			width: '100%',
			height: '100%',
			maxWidth: '100vw',
			maxHeight: '100vh',
			data: {
				_path: '/arca.pcore/reports',
				_name: 'TiposEstudiosEspecialidad.prpt',
				_params: 'fechaFinal=2019-06-06&fechaInicial=2019-06-01&usuarioGenera=dgomezj&unidadProgramatica=2208',
				_mime: 'pdf' // Posibilidades -> pdf, txt, html, excel, excelX
			}
		};

		// Se crea una variable que representa a la ventana
		const reporte = this.dialogos.open(ReportsComponent, configDialogo);
		// // Se customiza el evento que retorna información de la ventana
		// reporte.afterClosed().subscribe(res => {
		//   // Se valida que exista una respuesta
		//   if (res) {
		//     // Asigna la respuesta a una variable
		//     this.respuesta = res;
		//   }
		// });
	};

	/**
	 * Métodso encargado de llamar a la ventana de reportes
	 */
	public ReportePruebaExcel(): void {
		// Se establece una variable para indicar la configuración básica de la ventana de búsqueda
		const configDialogo =
		{
			disableClose: false,
			panelClass: 'full-width-dialog',
			hasBackdrop: true,
			width: '100%',
			height: '100%',
			maxWidth: '100vw',
			maxHeight: '100vh',
			data: {
				_path: '/arca.pcore/reports',
				_name: 'estudiosPorCoicidenciaExcel.prpt',
				_params: 'fechaInicial=2019-06-01&fechaFinal=2019-06-06&tipoFecha=1&usuarioGenera=aasalab&unidadProgramatica=2208',
				_mime: 'excelX' // Posibilidades -> pdf, txt, html, excel, excelX
			}
		};

		// Se crea una variable que representa a la ventana
		const reporte = this.dialogos.open(ReportsComponent, configDialogo);
		// // Se customiza el evento que retorna información de la ventana
		// reporte.afterClosed().subscribe(res => {
		//   // Se valida que exista una respuesta
		//   if (res) {
		//     // Asigna la respuesta a una variable
		//     this.respuesta = res;
		//   }
		// });
	};

	public EjecutarETL(isJSON: boolean): void {

		const etl = (isJSON) ? '/home/dgomezj/pentaho-como-restful/1. ETLComoRestfulJSON' :
			'/home/dgomezj/pentaho-como-restful/2. ETLComoRestfulXml';

		const tipo = (isJSON) ? TiposRespuestaETLPentaho.Tipos.JSON : TiposRespuestaETLPentaho.Tipos.XML;

		// Se llama a la función del servicio que envia los datos al server
		this.etlService.Create(etl, tipo).then((res) => {
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos de la respuesta
				console.log(res.data);
			}
			else {
				console.log(res.data ? res.data : res);
			}
		}, (err) => {
			// Muestra el mensaje con el error
			if (err.error) { console.error(err.error.message); }
			// .subscribe(res => alert(res));
		});
	};
}
