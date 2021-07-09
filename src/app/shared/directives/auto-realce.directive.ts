// Definición typescript para la directiva AutoRealceDirective v1.1.2
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (14-06-2019) Ing. Dagoberto Gómez Jiménez

// Import los servicios de angular core requeridos.
import { Directive, Input, Renderer2, HostListener, ElementRef, OnChanges } from '@angular/core';

/**
 * Directiva que se encarga del manejo de áreas donde se requiera realizar un realce para mostrarle
 * al usuario que falta alguna condición o llamar su atención
 */
@Directive({
	selector: '[arcaAutoRealce]'
})
export class AutoRealceDirective implements OnChanges {

	/**
	 * Bandera para indicar si se debe de aplicar la directiva al elemento
	 */
	private _active: boolean;
	/**
	 * Atributo que representa el color del background a aplicar por defecto rojo claro
	 */
	private _color = '#ffc0c0';

	/**
	 * Parámetro de entrada para activar el realce del elemento
	 */
	@Input('Realce')
	get Realzar() { return this._active; }
	set Realzar(value: boolean) { this._active = value; }

	/**
	 * Parámetro de entrada que permite elegir el color de realce (background css) del elemento
	 */
	@Input('Color')
	get Color() { return this._color; }
	set Color(value: string) { this._color = value; }

	/**
	 * Constructor por defecto de la clase
	 * @param el representa referencia la elemento actual
	 * @param renderer representa objeto document del DOM
	*/
	constructor(private el: ElementRef, private renderer: Renderer2) { }

	/**
	 * Método que se encarga de detectar cuando el usuario hace click en el elemento con realce
	*/
	@HostListener('click', ['$event.target'])

	/**
	 * Método que se ejecuta cuando el usuario pulsa la tecla ENTER
	 */
	public onMouseEnter(): void {
		// comprueba si el elemento se encuentra con realce
		if (this._active) {
			// elimina el realce del elemento
			this._active = false;
			this.Resaltar(null);
		}
	};

	/**
	 * Método que registrar el movimiento de los elementos
	 * @param color Indica el color para usar en el resaltado
	 */
	public Resaltar(color: string): void {
		this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
	};

	/**
	 * Método inicial de la directiva
	 */
	public ngOnChanges() {
		// si el elemento se activa le aplica el realce
		if (this._active) {
			this.Resaltar(this._color);
		}
		else {
			this.Resaltar(null);
		}
	};
}
