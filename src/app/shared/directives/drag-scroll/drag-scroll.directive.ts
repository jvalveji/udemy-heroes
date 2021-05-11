// Definición typescript para el módulo DragScrollDirective v1.1.1
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Descripciòn: se declara directiva para el manejo de drag scroll dinámico para cualquier tipo de lista de elementos,
// declaraciones basadas en librerìa ngx-drag-scroll MIT License
// Modificado: (24-07-2018) por Ing. Alexander Picado Jiménez

import {
  DoCheck, Directive, ElementRef, Renderer2, OnDestroy, Input, Output, OnInit, EventEmitter, HostListener
} from '@angular/core';
/** Permite realizar drag scroll a una lista de elementos html incluir la directiva en tags div */
@Directive({
  selector: '[arcaDragScroll]'
})
export class DragScrollDirective implements OnDestroy, OnInit, DoCheck {
  /** bandera para desactivar drag-scroll*/
  private _disabled = false;
  /** bandera para activar/desactivar el scroll sobre el eje x */
  private _xDisabled = false;
  /** bandera para activar/desactivar el scroll sobre el eje y */
  private _yDisabled = false;
  /** bandera para detectar si el usuario presiono el elemento */
  public isPressed = false;
  /** detectar si el usuario realizo scroll en el elemento */
  public isScrolling = false;
  /** establecer un retardo para el reestablecimiento de los elementos */
  public scrollTimer = -1;
  /** establecer un retardo para el reestablecimiento de los elementos */
  public scrollToTimer = -1;
  /** representa coordenada x */
  public downX = 0;
  /** representa coordenada y */
  public downY = 0;
  /** variable para establecer propiedades css */
  public displayType: string | null = 'block';
  /** variable para establecer propiedades css */
  public elWidth: string | null = null;
  /** variable para establecer propiedades css */
  public elHeight: string | null = null;
  /** variable para establecer propiedades css */
  public parentNode: HTMLElement | null = null;
  /** variable para establecer propiedades css */
  public wrapper: HTMLDivElement | null = null;
  /** variable para establecer propiedades css */
  public scrollbarWidth: string | null = null;
  /** representa el índice actual */
  public currIndex = 0;
  /** se stablece la animación en falso por defecto */
  public isAnimating = false;
  /** bandera para indicar si se ha llegado al límite derecho de los elementos (último elemento) */
  public scrollReachesRightEnd = false;
  /** representa el número de hijos el elemento div */
  public prevChildrenLength = 0;
  /** representa la estructura con los hijos del elemento div */
  public childrenArr: Array<Element> = [];
  /** parametro de entrada para desactivar el drag-scroll tanto vertical como horizontal */
  @Input('drag-scroll-disabled')
  get disabled() { return this._disabled; }
  /** modificar el valor para drag-scroll-disabled */
  set disabled(value: boolean) { this._disabled = value; }
  /** parametro de entrada para desactivar el drag-scroll horizontal */
  @Input('drag-scroll-x-disabled')
  get xDisabled() { return this._xDisabled; }
  /** modificar el valor para  drag-scroll-x-disabled */
  set xDisabled(value: boolean) { this._xDisabled = value; }
  /** parametro de entrada para desactivar el drag-scroll vertical */
  @Input('drag-scroll-y-disabled')
  get yDisabled() { return this._yDisabled; }
  /** modificar el valor para drag-scroll-y-disabled */
  set yDisabled(value: boolean) { this._yDisabled = value; }

  /** evento de salida que devuelve un booleano en true si se encuentra en el primer elemento a la izquierda */
  @Output() LimiteIzquierdo = new EventEmitter<boolean>();
  /** evento de salida que devuelve un booleano en true si se encuentra en el último elemento a la derecha */
  @Output() LimiteDerecho = new EventEmitter<boolean>();
  /**
   *  se encarga de establecer ancho y alto del div contenedor
   */
  private checkScrollbar(): void {
    if (this.el.nativeElement.scrollWidth <= this.el.nativeElement.clientWidth) {
      this.el.nativeElement.style.height = '100%';
    } else {
      this.el.nativeElement.style.height = `calc(100% + ${this.scrollbarWidth})`;
    }
    if (this.el.nativeElement.scrollHeight <= this.el.nativeElement.clientHeight) {
      this.el.nativeElement.style.width = '100%';
    } else {
      this.el.nativeElement.style.width = `calc(100% + ${this.scrollbarWidth})`;
    }
  }
  /**
  *  establece un timer para reestablecer el orden visual de los elementos
  * @param element representa el elemento html
  * @param to representa el ancho del elemento
  * @param duration segmento de tiempo para el retardo
  */
  private scrollTo(element: Element, to: number, duration: number) {
    const self = this;
    self.isAnimating = true;
    const start = element.scrollLeft,
      change = to - start,
      increment = 20;
    let currentTime = 0;
    // t = tiempo actual
    // b = valor de inicio
    // c = cambio en un valor
    // d = duración
    const easeInOutQuad = function (t: number, b: number, c: number, d: number) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t + b;
      }
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };
    const animateScroll = function () {
      currentTime += increment;
      element.scrollLeft = easeInOutQuad(currentTime, start, change, duration);
      if (currentTime < duration) {
        self.scrollToTimer = window.setTimeout(animateScroll, increment);
      } else {
        // run one more frame to make sure the animation is fully finished
        setTimeout(() => {
          self.isAnimating = false;
        }, increment);
      }
    };
    animateScroll();
  }
  /**
   *  reestablecer valor del indice para el scrolling (efecto de rebote)
   * @param snap (Opcional) bandera que indica si el movimiento de los elementos debe poseer una animación
   */
  private locateCurrentIndex(snap?: boolean) {
    const ele = this.el.nativeElement;
    this.currentChildWidth((currentClildWidth, nextChildrenWidth, childrenWidth, idx, stop) => {
      if (ele.scrollLeft >= childrenWidth &&
        ele.scrollLeft <= nextChildrenWidth) {

        if (nextChildrenWidth - ele.scrollLeft > currentClildWidth / 2 && !this.scrollReachesRightEnd) {
          // roll back scrolling
          this.currIndex = idx;
          if (snap) {
            this.scrollTo(ele, childrenWidth, 500);
          }
        } else {
          // forward scrolling
          this.currIndex = idx + 1;
          if (snap) {
            this.scrollTo(ele, childrenWidth + currentClildWidth, 500);
          }
        }
        stop();
      }
    });
  }
  /**
   *  establecer el ancho de los elementos hijos
   * @param cb representa las propiedades del elemento actual
   */
  private currentChildWidth(cb: (currentClildWidth: number, nextChildrenWidth: number, childrenWidth: number, index: number, breakFunc: () => void) => void): void {
    let childrenWidth = 0;
    let shouldBreak = false;
    const breakFunc = function () {
      shouldBreak = true;
    };
    for (let i = 0; i < this.childrenArr.length; i++) {
      if (i === this.childrenArr.length - 1) {
        this.currIndex = this.childrenArr.length;
        break;
      }
      if (shouldBreak) {
        break;
      }

      const nextChildrenWidth = childrenWidth + this.childrenArr[i + 1].clientWidth;
      const currentClildWidth = this.childrenArr[i].clientWidth;
      cb(currentClildWidth, nextChildrenWidth, childrenWidth, i, breakFunc);

      childrenWidth += this.childrenArr[i].clientWidth;
    }
  }
  /**
   *  establecer localización de los elementos hijos 
   * @returns devuelve número que representa la localización del elemento
  */
  private toChildrenLocation(): number {
    let to = 0;
    for (let i = 0; i < this.currIndex; i++) {
      to += this.childrenArr[i].clientWidth;
    }
    return to;
  }
  /**
   *  establece alto y ancho de los elementos de la lista */
  private markElDimension(): void {
    if (this.wrapper) {
      this.elWidth = this.wrapper.style.width;
      this.elHeight = this.wrapper.style.height;
    } else {
      this.elWidth = this.el.nativeElement.style.width;
      this.elHeight = this.el.nativeElement.style.height;
    }
  }
  /**
   *  constructor de la directiva por defecto oculta la barra de scroll y establece el puntero en una mano 
   * @param el referencia a elementos del DOM
   * @param renderer manipular elementos del DOM
  */
  constructor(private el: ElementRef, private renderer: Renderer2) {
    el.nativeElement.style.overflow = 'auto';
    // el.nativeElement.style.overflowX = 'hidden';
    el.nativeElement.style.whiteSpace = 'noWrap';
    el.nativeElement.style.cursor = 'pointer';
  }
  /**
   *  detectar el host de ejecución para establecer el valor de la ventana 
   * @param resize representa el tamaño de la ventana actual
   * @param $event captura evento que contiene el tamaño de la ventana
   * */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.markElDimension();
    this.checkNavStatus();
  }
  /**
   *  detectar el movimiento del mouse presionado para realizar drag scroll
    * @param mousemove representa el movimiento del mouse
   * @param $event captura evento con movimiento del mouse
   * */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isPressed && !this.disabled) {
      // // Drag X
      if (!this.xDisabled) {
        this.el.nativeElement.scrollLeft =
          this.el.nativeElement.scrollLeft - event.clientX + this.downX;
        this.downX = event.clientX;
      }
      // Drag Y
      if (!this.yDisabled) {
        this.el.nativeElement.scrollTop =
          this.el.nativeElement.scrollTop - event.clientY + this.downY;
        this.downY = event.clientY;
      }
    }
  }
  /** se encarga de detectar los elementos en donde se encuentra el cursor posicionado
   * @param mouseup representa el movimiento del mouse
   * @param $event captura evento de moviemiento hacia arriba del mouse
  */
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.isPressed) {
      this.isPressed = false;
      this.locateCurrentIndex();
    }
  }
  /** detecta el movimiento del mouse hacia abajo 
   * @param mousedown representa el movimiento del mouse
   * @param $event captura evento de moviemiento hacia abajo del mouse
  */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.isPressed = true;
    this.downX = event.clientX;
    this.downY = event.clientY;
    clearTimeout(this.scrollToTimer);
  }
  /** detecta el movimiento del scroll con el fin de actualizar la posición de los elementos en la barra de navegación 
   * @param scroll representa el movimiento del scroll
   * @param $event captura evento cuando se realiza scroll
  */
  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const ele = this.el.nativeElement;
    if ((ele.scrollLeft + ele.offsetWidth) >= ele.scrollWidth) {
      this.scrollReachesRightEnd = true;
    } else {
      this.scrollReachesRightEnd = false;
    }
    this.checkNavStatus();
    if (!this.isPressed && !this.isAnimating) {
      this.isScrolling = true;
      clearTimeout(this.scrollTimer);
      this.scrollTimer = window.setTimeout(() => {
        this.isScrolling = false;
        this.locateCurrentIndex(true);
      }, 500);
    } else {
      this.locateCurrentIndex();
    }
  }
  /** se encarga de desplazar los elementos de la barra de navegación hacia la izquierda*/
  public MoverIzquierda(): void {
    const ele = this.el.nativeElement;
    if (this.currIndex !== 0) {
      this.currIndex--;
      clearTimeout(this.scrollToTimer);
      this.scrollTo(ele, this.toChildrenLocation(), 500);
    }
  }
  /** se encarga de desplazar los elementos de la barra de navegación hacia la derecha*/
  public MoverDerecha(): void {
    const ele = this.el.nativeElement;
    if (!this.scrollReachesRightEnd && this.childrenArr[this.currIndex + 1]) {
      this.currIndex++;
      clearTimeout(this.scrollToTimer);
      this.scrollTo(ele, this.toChildrenLocation(), 500);
    }
  }
  /** registrar el movimiento de los elementos, actualiza el index del elemento actual
   * @param index representa la posición del elemento actual en la lista
  */
  public moveTo(index: number): void {
    const ele = this.el.nativeElement;
    if (index >= 0 && index !== this.currIndex && this.childrenArr[index]) {
      this.currIndex = index;
      clearTimeout(this.scrollToTimer);
      this.scrollTo(ele, this.toChildrenLocation(), 500);
    }
  }
  /** establecer los valores actuales de las banderas de límite derecho y límite izquierdo para la barra de navegación (manejo de desplazamiento de la barra)*/
  public checkNavStatus(): void {
    const ele = this.el.nativeElement;
    let childrenWidth = 0;
    for (let i = 0; i < ele.children.length; i++) {
      childrenWidth += ele.children[i].clientWidth;
    }
    if (this.childrenArr.length <= 1 || ele.scrollWidth <= ele.clientWidth) {
      // only one element
      this.LimiteIzquierdo.emit(true);
      this.LimiteDerecho.emit(true);
    } else if (this.scrollReachesRightEnd) {
      // reached right end
      this.LimiteIzquierdo.emit(false);
      this.LimiteDerecho.emit(true);
    } else if (ele.scrollLeft === 0 &&
      ele.scrollWidth > ele.clientWidth) {
      // reached left end
      this.LimiteIzquierdo.emit(true);
      this.LimiteDerecho.emit(false);
    } else {
      // in the middle
      this.LimiteIzquierdo.emit(false);
      this.LimiteDerecho.emit(false);
    }
  }
  /**
   *  inicialización de variables y estructuras
   */
  public ngOnInit(): void {
    // se le autoasigna un estilo a la ventana
    this.displayType = window.getComputedStyle(this.el.nativeElement).display;
    this.el.nativeElement.style.display = this.displayType;
    // se almacena el ancho y alto del elemento
    this.markElDimension();
    // establece el elemento contenedor
    this.renderer.setAttribute(this.el.nativeElement, 'drag-scroll', 'true');
    // evitar que Firefox arrastre imágenes
    document.addEventListener('dragstart', function (e) {
      e.preventDefault();
    });
  }
  /** se establece el valor de la localización actual */
  public ngDoCheck(): void {
    this.childrenArr = this.el.nativeElement.children || [];
    // avoid extra ckecks
    if (this.childrenArr.length !== this.prevChildrenLength) {
      if (this.wrapper) {
        this.checkScrollbar();
      }
      this.prevChildrenLength = this.childrenArr.length;
      this.checkNavStatus();
    }
  }
  /** se elimina memoria y referencia*/
  public ngOnDestroy(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'drag-scroll', 'false');
  }

}
