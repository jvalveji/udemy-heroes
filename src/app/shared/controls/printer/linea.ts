// Definición typescript para el la interfaz Linea v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripción: Interfaz con las definiciones de la estructura de lineas de texto a imprimir.

/** Interfaz con las definiciones de la estructura de lineas de texto a imprimir */
export interface ILinea {
	/**
     * representa el texto de la línea
     */
	text: String,
	/**
     * representa el tamaño del texto de la línea
     */
	fontSize: Number,
	/**
     * representa bandera para indicar si se debe subrayar el texto
     */
	underline: Boolean,
	/**
     * representa bandera para indicar si se debe ser negrita el texto
     */
	bold: Boolean,
	/**
     * representa bandera para indicar si se debe ser italic el texto
     */
	italic: Boolean,
	/**
     * representa margen izquierdo
     */
	marginLetf: Number
}
