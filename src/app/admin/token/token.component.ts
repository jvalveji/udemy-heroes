// Definición typescript para el componente TokenComponent v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

// Se importan los servicios a utilizar
import { TokenService } from './token.service';
import { DialogService } from './../../shared/controls/dialog/dialog.service';
import { UtilidadesService } from './../../shared/services/utilidades.service';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from 'app/shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_tokens'])
/**
 * Componente destinado a generar tokens de tipo JWT(jsonwebtoken) dentro de la plataforma
 * Arca - MEAN
 */
@Component({
	selector: 'arca-token',
	templateUrl: './token.component.html',
	styleUrls: ['./token.component.scss'],
	providers: [TokenService]
})
export class TokenComponent {
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que representa el formulario
	 */
	public frmGeneradorTokens: FormGroup;
	/**
	 * Variable que contendra el token generado
	 */
	public token: string;

	/**
	 * Constructor de la clase
	 * @param fb Representa un objeto de tipo FormBuilder
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param tokenService Parametro que representa el servicio de generación de tokens
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param utils Representa al servicio de utilidades
	 */
	constructor(private fb: FormBuilder,
		private _location: Location,
		private tokenService: TokenService,
		private msgBox: DialogService,
		private utils: UtilidadesService) {
		// Se inicializa el formulario
		this.frmGeneradorTokens = this.fb.group({
			ttl: [1, [Validators.required, Validators.min(1)]],
			medida: ['', Validators.required],
			payload: ['']
		});
	}

	// Métodos públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior
	 */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	/**
	 * Método que se encarga de solicitar el token
	*/
	public Solicitar(): void {

		// Trata de convertir la data en formato JSON
		let _data = this.utils.JSONize(this.frmGeneradorTokens.controls.payload.value);
		// Valida si existen datos, sino, por DEFAULT se manda los datos de unidad programática
		if (!_data || !_data.up || !_data.up._id) {
			// Se inicializa el objeto
			if (!_data) { _data = {}; }
			if (!_data.up) { _data = { up: { _id: null } } }
			// Se establecen los datos del id de la unidad programática
			_data.up._id = this.utils.ListUsuarioLocal().unidadProgramatica_id;
		}

		// Variable con los datos del token
		const datosToken = {
			ttl: this.frmGeneradorTokens.controls.ttl.value,
			medida: this.frmGeneradorTokens.controls.medida.value,
			// En caso de error se establece un dato para la fecha y hora actual
			data: _data
		};

		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.tokenService.Create(datosToken).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos obtenidos
				this.token = res.data
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error', res.mensaje);
				// .subscribe(res => alert(res));
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error
			if (err.error) { this.msgBox.open('ERROR', 'Error de carga', err.error.message); }
			// .subscribe(res => alert(res));
		});
	};

	/**
	 * Método encargado de copiar el dato del área de texto en memoria
	 */
	public Copiar(): void {
		// Obtiene el elemento del DOM que contiene el texto
		const txtDOM = <HTMLInputElement>document.getElementById('tokenGenerado');
		// Selecciona el elemento del DOM
		txtDOM.select();
		// try {
		//   const successful = document.execCommand('copy');
		//   const msg = successful ? 'successfully' : 'unsuccessfully';
		//   console.log('text coppied ' + msg);
		// } catch (err) {
		//   console.log('Unable to copy text');
		// }
		try {
			// ejecuta el comando que se encarga de copiar el texto del control seleccionado
			document.execCommand('copy');
		} catch (err) {
			console.log('No se pudo copiar el texto');
		}
	};
}
