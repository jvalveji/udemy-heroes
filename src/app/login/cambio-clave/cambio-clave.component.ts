// Definición typescript para el componente CambioClaveComponent v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (15-06-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Importa los servicios a utilizar
import { CambioClaveService } from './cambio-clave.service';
import { DialogService } from './../../shared/controls/dialog/dialog.service';

// Importa los modelos(clases)
import { ILogin } from '../interfaces/login';

/**
 * Componente destinado al despligue y manejo del formulario de cambio de clave
 */
@Component({
	selector: 'arca-cambio-clave',
	templateUrl: './cambio-clave.component.html',
	styleUrls: ['./cambio-clave.component.scss'],
	providers: [DialogService]
})
export class CambioClaveComponent implements OnInit, OnDestroy {
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que representa el formulario
	 */
	public frmCambioClave: FormGroup;
	/**
	 * Variable para asignar las validaciones al campo de password nuevo
	 */
	private passwordNuevo = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]));
	/**
	 * Variable para almacenar los datos del nombre de usuario al que se debe resetear la contraseña
	 */
	private suscripcion: Subscription;
	/**
	 * Variable para almacenar el dato del usuario que es enviado por parámetro
	 */
	private usuario: string;
	/**
	 * Variable que almacena el dato que indica si el usuario es MISE o no
	 */
	private esMISE: boolean;
	/**
	 * Url que maneja la ubicación del servidor de recursos Web
	 */
	public UrlWebkit: string;

	/**
	 * Constructor de la clase
	 * @param _router Representa el módulo de ruteo
	 * @param _rutaActiva Representa la ruta activa
	 * @param loginService Representa el servicio para el login
	 * @param fb Representa un objeto de tipo FormBuilder
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param _location Parametro que representa el servicio de localización de rutas
	 */
	constructor(private _router: Router,
		private _rutaActiva: ActivatedRoute,
		private loginService: CambioClaveService,
		private fb: FormBuilder,
		private msgBox: DialogService,
		private _location: Location) {
		// Asigna los controles al objeto formulario
		this.frmCambioClave = this.fb.group({
			'passActual': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
			'passNuevo': this.passwordNuevo,
			'passRepetido': ['', Validators.compose([Validators.required, this.VerificarPasswords()])]
		});
	}

	// Métodos Públicos

	/**
	 * Método encargado de redirigir al usuario a la vista anterior
	 */
	public IrPaginaAnterior(): void {
		// Retorna a la página anterior
		this._location.back();
	};

	/**
	 * Método que se encarga de realizar el cambio de contraseña
	 */
	public CambiarClave(): void {
		// Se almacenan los datos en una variable (interface) tipo ILogin
		const credenciales: ILogin = {
			usuario: this.usuario,
			clave: this.frmCambioClave.value.passActual,
			idUnidadProgramatica: null,
			esMISE: this.esMISE
		};

		// Se llama a la función del servicio que envia los datos al server
		this.loginService.Update(credenciales, this.frmCambioClave.value.passNuevo).then((res) => {
			// Recibe la respuesta
			if (res.exito) {
				// Muestra el mensaje
				this.msgBox.open('ERROR', 'Actualizar credenciales', res.mensaje)
					.subscribe(_res => {
						// Redirige al usuario hacia la página de login
						this._router.navigate(['/bitzu/login']);
					});
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error actualizando credenciales', res.mensaje);
				// .subscribe(res => alert(res));
			}

		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error de validación del logueo
			this.msgBox.open('ERROR', 'Error de credenciales', err.error.mensaje);
			// .subscribe(res => alert(res));
		});
	};

	// Métodos Privados

	/**
	 * Método encargado de validar que los valores del password nuevo sean iguales
	 * @returns Retorna el valor de contraseña cuando coinciden los datos
	 */
	private VerificarPasswords(): any {
		return (control: FormControl) => {
			return (control.value === this.passwordNuevo.value) ? null : { 'passwordMatch': { valid: false } };
		}
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Se crea una suscripción que retorna los parametros que fueron enviados a la ruta
		this.suscripcion = this._rutaActiva.params.subscribe(params => {
			// Se obtienen los parámetros
			this.usuario = params['usuario'];
			this.esMISE = params['esMISE'] ? Boolean(JSON.parse(params['esMISE'])) : false;
		});
		// Establece el ambiente actual del webkit
		this.UrlWebkit = environment.urlWebkit;
	};

	/**
	 * Método de finalización del componente
	 */
	public ngOnDestroy() {
		// Destruye la suscripción
		this.suscripcion.unsubscribe();
	};
}
