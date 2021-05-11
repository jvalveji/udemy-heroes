// Definición typescript para el componente InicioSesionComponent v7.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (07-07-2020) Ing. Dagoberto Gómez Jiménez

import { environment } from 'environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
	MatSnackBar,
	MatSnackBarHorizontalPosition,
	MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

// Importa los servicios a utilizar
import { InicioSesionService } from './inicio-sesion.service';
import { DialogService } from './../../shared/controls/dialog/dialog.service';
import { AutorizacionService } from './../../shared/services/autorizacion.service';

// Importa las interfaces a utilizar
import { ILogin } from '../interfaces/login';

// Importa los componentes a utilizar
import { AutocompleteComponent } from './../../shared/controls/autocomplete/autocomplete.component';

/**
 * Componente destinado al despligue y manejo de la funcionalidad que permite el inicio de sesión
 * en la plataforma Arca - MEAN
 */
@Component({
	selector: 'arca-inicio-sesion',
	templateUrl: './inicio-sesion.component.html',
	styleUrls: ['./inicio-sesion.component.scss'],
	providers: [DialogService]
})
export class InicioSesionComponent implements OnInit {
	/**
	 * Se "instancia" el componente de autocompletar (en el html) para accederlo
	 */
	@ViewChild('unidadesAutoComplete') unidadesAutoComplete: AutocompleteComponent;
	/**
	 * Variable que indica al usuario el ambiente actual de la aplicación
	 */
	public ambienteActual: string;
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable para indicar si el formulario se debe resetar a un estado inicial
	 */
	public esEstadoInicialForm = false;
	/**
	 * Variable que representa el formulario
	 */
	public frmInicioSesion: FormGroup;
	/**
	 * Variable que maneja la lista de unidades programáticas del usuario
	 */
	public unidadesProgramaticas: any;
	/**
	 * Variable que maneja el dato de la unidad programática seleccionada
	 */
	public upSeleccionada: any;
	/**
	 * Variable que indica si el control de autocompletar esta deshabilitado o no
	 */
	public disableAuto = true;
	/**
	 * Variable que almacena el dato de la fecha actual
	 */
	public annoActual = new Date();
	/**
	 * Url que maneja la ubicación del servidor de recursos Web
	 */
	public UrlWebkit: string;

	/**
	 * Variables para posicionar el mensaje de snackbar despues del logueo exitoso
	 */
	private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	private verticalPosition: MatSnackBarVerticalPosition = 'top';

	/**
	 * Constructor de la clase
	 * @param rutas Representa un objeto de tipo Router
	 * @param fb Representa un objeto de tipo FormBuilder
	 * @param LoginService Representa el servicio para el login
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param autorizacionService Representa el servicio de autorizaciones
	 */
	constructor(private rutas: Router,
		private fb: FormBuilder,
		private loginService: InicioSesionService,
		private msgBox: DialogService,
		private snackBar: MatSnackBar,
		private autorizacionService: AutorizacionService) {

		// Establece el ambiente actual
		this.ambienteActual = (environment.ambiente === 'PRODUCCIÓN') ? null : environment.ambiente;

		// Asigna los controles al objeto formulario
		this.frmInicioSesion = this.fb.group({
			'usuario': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'clave': [{ value: '', disabled: true }, Validators.compose([Validators.required, Validators.minLength(8)])]
		});
	}

	// Métodos Públicos

	/**
	 * Método que se encarga de restabler el formulario su estado original cuando
	 * se cambia de usuario.
	 */
	public RestablecerVistaFormulario(): void {
		if (this.esEstadoInicialForm) {
			this.frmInicioSesion.reset(); // Limpia el formulario (usuario y password)
			this.unidadesAutoComplete.Reset(); // Limpia el control de autocompletar
			this.esEstadoInicialForm = false; // Resetea el estado inicial del formulario
			this.frmInicioSesion.controls.clave.disable(); // Deshabilita el campo de contraseña
			this.upSeleccionada = null; // Limpia la variable de unidad programática seleccionada
		}
		// Oculta el control de unidades programáticas
		this.disableAuto = true;
	};

	/**
	 * Método que se encarga de carga las unidades programáticas habilitadas
	 * para está aplicación
	 */
	public ObtenerUnidadesProgramaticas(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Indicación de limpiar formulario si ocurre un cambio de usuario
		this.esEstadoInicialForm = true;
		// Se llama a la función del servicio que envia los datos al server
		this.loginService.Show(this.frmInicioSesion.value.usuario).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Asigna los datos de la respuesta
				this.unidadesProgramaticas = res.data.map(function (unidad) {
					// Se obtiene solo la lista de unidades programáticas
					return unidad.unidadProgramatica_id;
				});
				// Muestra el control de autocompletar
				this.disableAuto = false;
			}
			else {
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error de credenciales', res.mensaje);
				// .subscribe(res => alert(res));
				// Limpia el formulario
				this.frmInicioSesion.reset();
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
			// Muestra el mensaje con el error de validación del logueo
			this.msgBox.open('ERROR', 'Error de credenciales', err.message)
				.subscribe(res => {
					// Lo envia a la ventana de logueo
					this.rutas.navigate(['/login']);
				});
		});
	};

	/**
	 * Método encargado de establecer el valor de la unidad programática seleccionada por el usuario
	 * @param item Parámetro que representa el item seleccionado por el usuario
	 */
	public SeleccionarUnidadProgramatica(item: any): void {
		// Asigna la unidad programática seleccionada al campo del formulario
		this.upSeleccionada = (item) ? item : null;
		// Marca el campo de contraseña para indicarle al usuario que debe ingresarla
		this.frmInicioSesion.controls.clave.enable();
	};

	/**
	* Método que captura los datos del formulario de login y realiza la validación de los mismos
	* (Valida el usuario y contraseña)
	*/
	public Validar(): void {
		// Se almacenan los datos en una variable (interface) tipo ILogin
		const credenciales: ILogin = {
			usuario: this.frmInicioSesion.value.usuario,
			clave: this.frmInicioSesion.value.clave,
			idUnidadProgramatica: this.upSeleccionada,
			esMISE: null
		};

		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.loginService.Update(credenciales).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Muestra el mensaje de error
				this.snackBar.open(res.mensaje, null, {
					duration: 3500,
					horizontalPosition: this.horizontalPosition,
					verticalPosition: this.verticalPosition
				});
				// Redirige al usuario hacia el home principal de la aplicación
				// MODIFIQUE AQUI LA RUTA COMPLETA DEL HOME INICIAL DE SU PROYECTO
				// (Acá se indica la ruta del HOME del módulo principal del proyecto basado en el fichero de rutas [app.routing.module.ts])
				// Ej.: Nutrición => this.rutas.navigate(['/nutricion/main']);
				this.rutas.navigate(['/bitzu/main']);
			} else {
				// Valida el mensaje de error
				if (res.data && (res.data.cambioClave || res.data.cuentaCaducada)) {
					const pregunta = 'Su contraseña MISE requiere actualizarse.<br>¿Desea realizarlo desde nuestra plataforma?';
					// Mensaje de alerta con el error
					this.msgBox.open('QUESTION', 'Cambio contraseña', pregunta)
						.subscribe(res => {
							if (res === 'YES') {
								// Redirige al usuario hacia la ventana de cambio de contraseña
								this.rutas.navigate(['/login/cambio-clave', this.frmInicioSesion.value.usuario, false]);
							}
						});
				}
				else {
					// Muestra el mensaje con el error de validación del logueo
					this.msgBox.open('ERROR', 'Error de credenciales', res.mensaje);
					// .subscribe(res => { });
				}
			}
		}, (err) => {
			// Oculta la barra de progreso en caso de error
			this.esCargando = false;
		});
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Elimina los datos locales; esto cada vez que entra a la vetana de logueo
		this.autorizacionService.LogOut();
		console.log('Datos inicializados...');
		// Establece el ambiente actual del webkit
		this.UrlWebkit = environment.urlWebkit;
	};
}
