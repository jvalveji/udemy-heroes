// Definición typescript para el la interface Barcode v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Interfaz con las definiciones de la estructura de Barcode a imprimir.

/**
* Representa los datos del barcode; se cuenta con las siguientes opciones para tipos
* BARCODEQR; BARCODEEAN; BARCODE128; BARCODEGENERIC; BARCODEDATAMATRIX
*/
export interface IBarcode {
	/** texto a imprimir */
	text: String;
	/** tipo de barcode */
	type: String;
	/** ancho del barcode */
	width: Number;
	/** alto del barcode */
	height: Number
}
