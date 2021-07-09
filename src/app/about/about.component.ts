// Definición typescript para el componente AboutComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (20-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
// Se importa la lista de los funcionarios
const funcionarios = require('./lista-funcionarios.json');

/**
 * Componente utilizado para mostrar la página "Acerca de" del proyecto Arca - MEAN
 */
@Component({
	selector: 'arca-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	/**
	 * Variable que almacena el dato de la fecha actual
	 */
	public annoActual = new Date();
	/**
	 * Variable para establecer la versión actual del aplicativo.
	 */
	public VERSION: String;
	/**
	 * Lista que contiene la lista de los funcionarios almacenados en el fichero JSON creado.
	 */
	public listaFuncionarios: Array<any> = funcionarios.listaFuncionarios;
	/**
	 * Url que maneja la ubicación del servidor de recursos Web
	 */
	public UrlWebkit: string;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 */
	constructor(private _location: Location) {
		this.VERSION = environment.version;
		// Establece el ambiente actual del webkit
		this.UrlWebkit = environment.urlWebkit;
	}

	// Métodos privados

	/**
	 * Método encargado de ordenar aleatoriamente los funcionarios
	 */
	private Shuffled(): void {
		let shuffled = this.listaFuncionarios
			.map((a) => ({ sort: Math.random(), value: a }))
			.sort((a, b) => a.sort - b.sort)
			.map((a) => a.value);
		this.listaFuncionarios = shuffled;
	}

	// Métodos públicos

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior
	 */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};
	/**
	 * Carga inicial del componente
	 */
	public ngOnInit(): void {
		// Carga la lista de catálogos del sistema
		this.Shuffled();
	}
}
