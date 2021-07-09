// Definición typescript para el la interfaz Documento v1.1.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado por: (03-06-2019) Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Interfaz con las definiciones de la estructura de documento a imprimir.

import { ILinea } from './linea';
import { IBarcode } from './barcode';

/** Interfaz con las definiciones de la estructura de documento a imprimir */
export class IDocumento {
  /** representa el nombre de la impresora */
  printerName: String;
  /**
   * (float width; float height) en PPI
   * A0 = new PageSize(2384; 3370);
     A1 = new PageSize(1684; 2384);
     A2 = new PageSize(1190; 1684);
     A3 = new PageSize(842; 1190);
     A4 = new PageSize(595; 842);
     A5 = new PageSize(420; 595);
     A6 = new PageSize(298; 420);
     A7 = new PageSize(210; 298);
     A8 = new PageSize(148; 210);
     A9 = new PageSize(105; 547);
     A10 = new PageSize(74; 105);

     B0 = new PageSize(2834; 4008);
     B1 = new PageSize(2004; 2834);
     B2 = new PageSize(1417; 2004);
     B3 = new PageSize(1000; 1417);
     B4 = new PageSize(708; 1000);
     B5 = new PageSize(498; 708);
     B6 = new PageSize(354; 498);
     B7 = new PageSize(249; 354);
     B8 = new PageSize(175; 249);
     B9 = new PageSize(124; 175);
     B10 = new PageSize(88; 124);

     LETTER = new PageSize(612; 792);
     LEGAL = new PageSize(612; 1008);
     TABLOID = new PageSize(792; 1224);
     LEDGER = new PageSize(1224; 792);
     EXECUTIVE = new PageSize(522; 756);

     Default = A4;
   * representa el tamaño del papel puede ser cualquiera de la siguiente lista:
   * A0;A1;A2;A3;A4;A5;A6;A7;A8;A9;A10;B0;B1;B2;B3;B4;B5;B6;B7;B8;B9.B10;Default;EXECUTIVE;LEDGER;LEGAL;LETTER;TABLOID
   *
   * ******Incluir este parámetro en "" si se desea incluir una página personalizada
   */
  paperSize: String;
  /** representa el ancho en centímetros de la página personalizado  */
  paperSizeCustomWidth: Number;
  /** representa el alto en centímetros de la página personalizado */
  paperSizeCustomHeight: Number;
  /**
   * representa el margen superior del documento
   */
  topMargin: Number;
  /**
   * representa el margen derecho del documento
   */
  rightMargin: Number;
  /**
   * representa el margen inferior del documento
   */
  bottomMargin: Number;
  /**
   * representa el margen inferior del documento
   */
  leftMargin: Number;
  /** alineación del texto LEFT; CENTER; JUSTIFIED; RIGHT */
  textAlignment: String;
  /**
   * representa las líneas de texto del documento
   */
  lineas: Array<ILinea>;

  /**
   * representa los datos del barcode; se cuenta con las siguientes opciones para tipos
   * BARCODEQR; BARCODEEAN; BARCODE128; BARCODEGENERIC; BARCODEDATAMATRIX
   */
  barcode: IBarcode;
  /** constructor por defecto de la clase SolicitudDieta */
constructor(item: any) {
  this.printerName = item.printerName;
  this.bottomMargin = item.bottomMargin;
  this.leftMargin = item.leftMargin;
  this.rightMargin = item.rightMargin;
  this.topMargin = item.topMargin;
  this.paperSize = item.paperSize;
  this.paperSizeCustomWidth = item.paperSizeCustomWidth;
  this.paperSizeCustomHeight = item.paperSizeCustomHeight;
  this.textAlignment = item.textAlignment;
  this.lineas = item.lineas;
  this.barcode = item.barcode;
};

/**
 * método para obtener el nombre de la impresora
 */
public getPrinterName(): String {
  return this.printerName;
}

/**
 * método para editar el nombre de la impresora
 */
public setPrinterName(v: String) {
  this.printerName = v;
}

/**
 * método para obtener el tamaño de papel de la impresora
 */
public getPaperSize(): String {
  return this.paperSize;
}

/**
 * método para editar el tamaño de papel de la impresora
 */
public setPaperSize(v: String) {
  this.paperSize = v;
}

/**
 * método para obtener el ancho del papel de la impresora
 */
public getPaperSizeCustomWidth(): Number {
  return this.paperSizeCustomWidth;
}

/**
 * método para editar el ancho del papel de la impresora
 */
public setPaperSizeCustomWidth(v: Number) {
  this.paperSizeCustomWidth = v;
}

/**
 * método para obtener el alto del papel de la impresora
 */
public getPaperSizeCustomHeight(): Number {
  return this.paperSizeCustomHeight;
}

/**
 * método para editar el alto del papel de la impresora
 */
public setPaperSizeCustomHeight(v: Number) {
  this.paperSizeCustomHeight = v;
}

/**
 * método para obtener el margen superior de la impresora
 */
public getTopMargin(): Number {
  return this.topMargin;
}

/**
 * método para editar el margen superior de la impresora
 */
public setTopMargin(v: Number) {
  this.topMargin = v;
}

/**
 * método para obtener el margen derecho de la impresora
 */
public getRightMargin(): Number {
  return this.rightMargin;
}

/**
 * método para editar el margen derecho de la impresora
 */
public setRightMargin(v: Number) {
  this.rightMargin = v;
}

/**
 * método para obtener el margen inferior de la impresora
 */
public getBottomMargin(): Number {
  return this.bottomMargin;
}

/**
 * método para editar el margen inferior de la impresora
 */
public setBottomMargin(v: Number) {
  this.bottomMargin = v;
}

/**
 * método para obtener el margen izquierdo de la impresora
 */
public getLeftMargin(): Number {
  return this.leftMargin;
}

/**
 * método para editar el margen izquierdo de la impresora
 */
public setLeftMargin(v: Number) {
  this.leftMargin = v;
}

/**
 * método para obtener la alineación del texto de la impresora
 */
public getTextAlignment(): String {
  return this.textAlignment;
}

/**
 * método para editar la alineación del texto de la impresora
 */
public setTextAlignment(v: String) {
  this.textAlignment = v;
}

/**
 * método para obtener las líneas de texto de la impresora
 */
public getLineas(): Array<ILinea> {
  return this.lineas;
}

/**
 * método para editar las líneas de texto de la impresora
 */
public setLineas(v: Array<ILinea>) {
  this.lineas = v;
}

/**
 * método para obtener el código de barras de la impresora
 */
public getBarcode(): IBarcode {
  return this.barcode;
}

/**
 * método para editar el código de barras de la impresora
 */
public setBarcode(v: IBarcode) {
  this.barcode = v;
}
}
