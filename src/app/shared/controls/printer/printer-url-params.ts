// Definición typescript para el la interfaz printer-url-params v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Interfaz con las definiciones de la estructura de de parámetros
// 				de construcción de la ruta del recurso pentaho a imprimir.

/** Interfaz con las definiciones de la estructura de parámetros de la ruta del recurso pentaho a imprimir */

export class PrinterUrlParams {
	/** representa el nombre de la impresora */
	_printerName: String;
	/** representa la ubicación del recurso en el servidor de pentaho */
	_reportPath: String;
	/** representa el nombre del reporte de pentaho */
	_reportName: String;
	/** representa los parámetros del reporte */
	_reportParams: String;
	/** representa el usuario */
	_reportUser: String;
	/** representa el password del usuario*/
	_reportPw: String;

	/** constructor por defecto de la clase SolicitudDieta */
	constructor() {
		this._printerName = '';
		this._reportName = '';
		this._reportParams = '';
		this._reportPath = '/arca.ncore/reports';
		this._reportUser = 'pentaho_hsvp';
		this._reportPw = 'DWH.CGI.2208';
	}
}
