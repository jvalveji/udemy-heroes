// Definición typescript para el control DateTimePickerComponent v2.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Alexander Picado Jiménez <apicadoj@ccss.sa.cr>
// Modificado: (04-05-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import moment from 'moment';
import { AmazingTimePickerService } from './atp-library/atp-time-picker.service';
import 'moment/locale/es';
import {
	DateAdapter,
	MAT_DATE_LOCALE,
	MAT_DATE_FORMATS
} from '@angular/material/core';
import {
	MomentDateAdapter,
	MAT_MOMENT_DATE_FORMATS
} from '@angular/material-moment-adapter';

/**
 * Declaración de componente datetimepicker que retorna una fecha
 * en formato: 'DD-MM-YYYY HH:mm:ss'
 */
@Component({
	selector: 'arca-date-time-picker',
	templateUrl: './date-time-picker.component.html',
	styleUrls: ['./date-time-picker.component.scss'],
	providers: [
		// se utilizan con el fin de obtener una conversion de fechas tipo moment,
		// para que alla compatibilidad con el datepicker de angular/material
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE]
		},
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
	],
	encapsulation: ViewEncapsulation.None,
	preserveWhitespaces: false,
})
export class DateTimePickerComponent implements OnInit {

	/**
	 * Representa el objeto con la fecha y hora construido apartir de la selección del usuario
	 */
	fechaHora: Date = new Date();
	/**
	 * Array para realizar split a la fecha tipo moment
	 */
	arrayFecha: any;
	/**
	 * Variable que representa la fecha seleccionada por el usuario
	 */
	fecha: any;
	/**
	 * Variable que representa la hora seleccionada
	 */
	hora = 0;
	/**
	 * Variable que representa los minutos seleccionados
	 */
	minutos = 0;
	/**
	 * Variable que representa los segundos seleccionados
	 */
	segundos = 0;
	/**
	 * Variable para el manejo del texto descriptivo (placeholder) a mostrar en el campo de búsqueda de al fecha
	 */
	public placeholderfecha: string;
	/**
   * Variable para el manejo del texto descriptivo (placeholder) a mostrar en el campo de búsqueda de la hora
   */
	public placeholderhora: string;
	/**
	 * Variable para desactivar los select de hora, minutos y segundos
	 */
	public selectTiempo = false;
	/**
	 * Variable que indica si el control esta desabilitado
	 */
	public disable: boolean;
	/**
	 * Representa el valor del slider de 0 a 1435
	 */
	public rango = 0;
	/**
	 * Variable para desactivar el datepicker de fecha
	 */
	public selectFecha = true;
	/**
   * Variable para tener la hora seleccionada en el time picker
   */
	public horaSeleccionada: any = '';

	/**
   * Variable para el manejo del texto descriptivo (placeholder) a mostrar en el campo de búsqueda de la hora
   */
	@Input()
	set ValorDefault(_fecha: any) {
		if (_fecha !== null && _fecha !== undefined) {
			this.fecha = moment(_fecha);
			this.hora = moment(_fecha).hours();
			this.minutos = moment(_fecha).minutes();
			this.rango = Math.trunc(this.hora * 60) + this.minutos;
		} else {
			this.Reset();
		}
	};
	get ValorDefault() {
		return this.fecha;
	};

	/**
	 * Atributo de entrada para establecer si el control esta deshabilitado o no
	 */
	@Input()
	set Disabled(_disable: boolean) {
		this.disable = _disable;
	};
	get Disabled() {
		return this.disable;
	};

	/**
	 * Atributo de entrada para desactivar el div de selectores de hora
	 */
	@Input()
	set SelectTiempo(_selectTiempo: boolean) {
		this.selectTiempo = _selectTiempo;
	};
	get SelectTiempo() {
		return this.selectTiempo;
	};

	/**
	 * Atributo de entrada para establecer el valor de la hora
	 */
	@Input()
	set Hora(_hora: any) {
		this.hora = _hora;
		this.rango = Math.trunc(this.hora * 60) + this.minutos;
	};
	get Hora() {
		return this.hora;
	};

	/**
	 * Atributo de entrada para establecer el valor de los minutos
	 */
	@Input()
	set Minutos(_minutos: any) {
		this.minutos = _minutos;
		this.rango = Math.trunc(this.hora * 60) + this.minutos;
	};
	get Minutos() {
		return this.minutos;
	};

	/**
	 * Atributo de entrada para establecer el valor de los segundos
	 */
	@Input()
	set Segundos(_segundos: any) {
		this.segundos = _segundos;
	};
	get Segundos() {
		return this.segundos;
	};

	/**
	 * Atributo de entrada para desactivar el div de selectores de hora
	 */
	@Input()
	set SelectFecha(_selectFecha: boolean) {
		this.selectFecha = _selectFecha;
	};
	get SelectFecha() {
		return this.selectTiempo;
	};

	/**
	 * Atributo de salida que retorna el item seleccionado por el usuario
	 */
	@Output('ItemSeleccionado')
	private ItemSeleccionado: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Atributo de entrada para establecer el placeholder del input del control de hora
	 */
	@Input()
	set Placeholderhora(_texto: string) {
		this.placeholderhora = _texto;
	}

	get Placeholderhora() {
		return this.placeholderhora;
	};

	/**
   * Atributo de entrada para establecer el placeholder del input del control de la fecha
   */
	@Input()
	set Placeholderfecha(_texto: string) {
		this.placeholderfecha = _texto;
	}

	get Placeholderfecha() {
		return this.placeholderfecha;
	};

	/**
	 * Constructor de la clase
	 */
	constructor(private atp: AmazingTimePickerService,
	) { }

	// Método públicos

	/**
	 * Método encargado de reestablecer los valores
	 */
	public Reset(): void {
		this.fecha = null;
		this.hora = 0;
		this.minutos = 0;
		this.segundos = 0;
	};

	/**
	 * Método encargado de aumentar el tiempo de 5 en 5 por defecto
	 */
	public AumentarTiempo(): void {
		if (this.rango < 1439) {
			this.rango += 1;
		}
		this.EstablecerSeleccion();
	};

	/**
	* Método encargado de disminuir el tiempo de 5 en 5 por defecto
	*/
	public DisminuirTiempo(): void {
		if (this.rango > 0) {
			this.rango -= 1;
		}
		this.EstablecerSeleccion();
	};

	/**
	 * Método encargado de interceptar evento del slider en tiempo real
	 * @param item Dato del input a establecer
	 */
	public SeleccionarInput(item): void {
		if (item !== undefined && item !== null) {
			this.hora = Math.trunc(item.value / 60);
			this.minutos = Math.trunc(item.value % 60);
		}
	};

	// Métodos privados

	/**
	 * Método encargado de establecer el valor seleccionado por el usuario; por tanto se encarga
	 * de enviar la respuesta a traves del servicio del componente
	 */
	public EstablecerSeleccion(): void {
		this.fecha = moment(this.fecha);
		// divide la fecha para luego ser asignada al objeto Date
		this.arrayFecha = moment(this.fecha).format('YYYY-MM-DD').split('-');
		// valida si se encuentra desactivado el selector de tiempo y si es así devuelve fecha y hora actuales
		if (this.selectTiempo) {
			// No se hace nada porque ya fue seleccionada
			// los minutos se debe restar uno porque el aumenta uno por defualt.

		} else {
			this.hora = moment().hours();
			this.minutos = moment().minutes();
			this.segundos = moment().seconds();
		}
		this.fechaHora.setDate(this.arrayFecha[2]);
		this.fechaHora.setMonth((this.arrayFecha[1] - 1));
		this.fechaHora.setFullYear(this.arrayFecha[0]);
		this.fechaHora.setHours(this.hora);
		this.fechaHora.setMinutes(this.minutos);
		this.fechaHora.setSeconds(0);

		// se envía la fecha/hora al componente padre
		this.ItemSeleccionado.emit(
			this.fechaHora.toJSON()
		);
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() { };


	/**
	 * Método para seleccionar la hora.
	 */
	public openTime() {
		const amazingTimePicker = this.atp.open({
			time: this.horaSeleccionada,
			theme: 'material-green',
		});
		amazingTimePicker.afterClose().subscribe(time => {
			this.horaSeleccionada = time;
			this.hora = Number(time.slice(0, 2));
			this.minutos = Number(time.slice(3, 5));
			this.EstablecerSeleccion();
		});
	}
}

