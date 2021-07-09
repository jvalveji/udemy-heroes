// Definición typescript para la interface ICRUD v1.1.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2019) Ing. Dagoberto Gómez Jiménez

import { IHttpResponse } from './http-response';

/**
 * Interfaz que permite manejar el CRUD básico en los servicios REST.
 */

export interface ICRUD {

	/**
     * Método encargado de ejecutar el proceso de obtener todo a traves del método GET
     * @summary Representación CRUD: Obtener
     */
	List(): Promise<IHttpResponse>;

	/**
     * Método encargado de ejecutar el proceso de obtener por parámetros a traves del método GET
     * @summary Representación CRUD: ObtenerPor
     * @param filter Parámetro que representa el filtro para obtener la información
     */
	Show?(filter: any): Promise<IHttpResponse>;

	/**
     * Método encargado de ejecutar el proceso de inserción a traves del método POST
     * @summary Representación CRUD: Insertar
     * @param data Parámetro que contiene los datos a ingresar
     */
	Create?(data: any): Promise<IHttpResponse>;

	/**
     * Método encargado de ejecutar el proceso de actualización a traves de los métodos PUT/PATCH
     * @summary Representación CRUD: Actualizar
     * @param filter Parámetro que representa el filtro para actualizar la información
     * @param data Parámetro que contiene los datos por actualizar
     */
	Update?(filter: any, data: any): Promise<IHttpResponse>;

	/**
     * Método encargado de ejecutar el proceso de eliminación a traves del método DELETE
     * @summary Representación CRUD: Eliminar
     * @param filter Parámetro que representa el filtro para eliminar la información
     */
	Remove?(filter: any): Promise<IHttpResponse>;
}
