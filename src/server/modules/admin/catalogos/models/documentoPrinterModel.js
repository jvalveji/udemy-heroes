// Definición JavaScript para el modelo para documentos printer v3.0.0
// Proyecto: Arca-MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Definición del modelo Documento Printer para las operaciones CRUD en la base de datos mongo.
// Modificado: (24-06-2020) Ing. Dagoberto Gómez Jiménez

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbCore = require('./../../../../config/db')('mixin', 'core');
// Se incluye el fichero con la definición para la propiedad log
const arcaLog = require('./../../../shared/models/arcaLogs');

let documentoPrinterSchema = new Schema({
	// nombre del documento
	'descripcion': String,
	/** representa el nombre de la impresora */
	'printerName': String,
	/**
	 * (float width, float height) en PPI
	 * A0 = new PageSize(2384, 3370),
	   A1 = new PageSize(1684, 2384),
	   A2 = new PageSize(1190, 1684),
	   A3 = new PageSize(842, 1190),
	   A4 = new PageSize(595, 842),
	   A5 = new PageSize(420, 595),
	   A6 = new PageSize(298, 420),
	   A7 = new PageSize(210, 298),
	   A8 = new PageSize(148, 210),
	   A9 = new PageSize(105, 547),
	   A10 = new PageSize(74, 105),
  
	   B0 = new PageSize(2834, 4008),
	   B1 = new PageSize(2004, 2834),
	   B2 = new PageSize(1417, 2004),
	   B3 = new PageSize(1000, 1417),
	   B4 = new PageSize(708, 1000),
	   B5 = new PageSize(498, 708),
	   B6 = new PageSize(354, 498),
	   B7 = new PageSize(249, 354),
	   B8 = new PageSize(175, 249),
	   B9 = new PageSize(124, 175),
	   B10 = new PageSize(88, 124),
  
	   LETTER = new PageSize(612, 792),
	   LEGAL = new PageSize(612, 1008),
	   TABLOID = new PageSize(792, 1224),
	   LEDGER = new PageSize(1224, 792),
	   EXECUTIVE = new PageSize(522, 756),
  
	   Default = A4,
	 * representa el tamaño del papel puede ser cualquiera de la siguiente lista:
	 * A0,A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,B0,B1,B2,B3,B4,B5,B6,B7,B8,B9.B10,Default,EXECUTIVE,LEDGER,LEGAL,LETTER,TABLOID
	 * 
	 * ******Incluir este parámetro en "" si se desea incluir una página personalizada
	 */
	'paperSize': String,
	/** representa el ancho en centímetros de la página personalizado  */
	'paperSizeCustomWidth': Number,
	/** representa el alto en centímetros de la página personalizado */
	'paperSizeCustomHeight': Number,
	/**
	 * representa el margen superior del documento
	 */
	'topMargin': Number,
	/**
	 * representa el margen derecho del documento
	 */
	'rightMargin': Number,
	/**
	 * representa el margen inferior del documento
	 */
	'bottomMargin': Number,
	/**
	 * representa el margen inferior del documento
	 */
	'leftMargin': Number,
	// alineación del texto LEFT, CENTER, JUSTIFIED, RIGHT
	'textAlignment': String,
	/**
	 * representa las líneas de texto del documento
	 */
	'lineas': Array,
	//[{
	// 	/**
	// 	 * representa el texto de la línea
	// 	 */
	// 	'text': String,
	// 	/**
	// 	 * representa el tamaño del texto de la línea 
	// 	 */
	// 	'fontSize': Number,
	// 	/**
	// 	 * representa bandera para indicar si se debe subrayar el texto
	// 	 */
	// 	'underline': Boolean,
	// 	/**
	// 	 * representa bandera para indicar si se debe ser negrita el texto
	// 	 */
	// 	'bold': Boolean,
	// 	/**
	// 	 * representa bandera para indicar si se debe ser italic el texto
	// 	 */
	// 	'italic': Boolean,
	// 	/**
	// 	 * representa margen izquierdo
	// 	 */
	// 	'marginLetf': Number


	// }],

	/**
	 * representa los datos del barcode, se cuenta con las siguientes opciones para tipos
	 * BARCODEQR, BARCODEEAN, BARCODE128, BARCODEGENERIC, BARCODEDATAMATRIX
	 */
	'barcode': Object,
	//{
	// 	/** texto a imprimir */
	// 	'text': String,
	// 	/** tipo de barcode */
	// 	'type': String,
	// 	/** ancho del barcode */
	// 	'width': Number,
	// 	/** alto del barcode */
	// 	'height': Number
	// },
	'estado': Boolean,
	'logs': arcaLog
});

if (dbCore) { module.exports = dbCore.model('catalogo-documento-printer', documentoPrinterSchema, 'catalogo-documento-printer'); }
