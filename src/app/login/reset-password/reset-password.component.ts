
// Definición typescript para el componente ResetPasswordComponent v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (03-07-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// Se importa libreria para el manejo de mensajes de error desde el servidor
import { MatSnackBar } from '@angular/material/snack-bar';

// Se importan los servicios a utilizar
import { UsuariosService } from './../../admin/usuarios/usuarios.service';
import { DialogService } from './../../shared/controls/dialog/dialog.service';
import { StorageService } from './../../shared/services/storage.service';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_resetear_password'])

@Component({
	selector: 'arca-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
	providers: [UsuariosService]
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * variable que almacena la lista de usuarios encontrados
	 */
	public usuario: any;
	/**
	 * Variable que representa el formulario
	 */
	public frmReset: FormGroup;

	/**
	 * Constructor de la clase
	 * @param usuariosService Variable que representa a los servicios para los usuarios
	 * @param fb Representa un objeto de tipo FormBuilder
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param storage Representa el servicio de almacenamiento temporal entre componentes
	 */
	constructor(private usuariosService: UsuariosService,
		private fb: FormBuilder,
		public snackBar: MatSnackBar,
		private msgBox: DialogService,
		private storage: StorageService) {
		// Asigna los controles al objeto formulario
		this.frmReset = this.fb.group({
			correo: ['', Validators.compose([Validators.required, Validators.email])],
			telefono: [{ value: '', disabled: true }, this.VerificarTelefono()]
		});
	}

	// Métodos públicos

	/**
	 * Método encargado de capturar los datos retornados por el control de búsqueda de usuarios
	 * @param item Parámetro que representa el conjunto de datos retornados
	 */
	public SeleccionarPersona(item: any): void {
		// Variable para asignar el correo electrónico
		let email = '';
		// Valida si se obtuvieron datos
		if (item) {
			// Asigna el dato a una variable interna
			this.usuario = item;
			// Verifica si existe un correo electrónico asociado al usuario para pre-establecerlo
			if (this.usuario.persona.mediosContacto && this.usuario.persona.mediosContacto.length > 0) {
				// Recorre la lista de medios de contacto para verificar si existe un correo electrónico
				this.usuario.persona.mediosContacto.some(medio => {
					// Valida si el medio de contacto corresponde a un correo electrrónico
					if (medio.tipoMedioContacto_id._id === '5a8c634d329037a9f0e97a26') {
						// Si existiese se lo asigna a la variable y sale del ciclo
						email = medio.descripcion;
						return true;
					}
				});
			}
			// Establece los datos de notificación (si existiesen)
			this.frmReset.setValue({ correo: email, telefono: '' });
		}
	};

	/**
	 * Método que se encarga de actualizar el estado del campo de télefono
	 */
	public CambiarEstadoTelefono(): void {
		// Valida si esta deshabilitado
		if (this.frmReset.controls.telefono.status !== 'DISABLED') {
			// deshabilita y limpia el campo
			this.frmReset.controls.telefono.disable();
			this.frmReset.controls.telefono.reset();
		}
		else { this.frmReset.controls.telefono.enable(); }
	};

	/**
	 * Método encargado de realizar el proceso de recetear la contraseña del usuario
	 */
	public ResetPassword(): void {
		// Se activa la barra de progreso
		this.esCargando = true;
		// Se envian los datos al servidor
		this.usuariosService.Reset(this.usuario.usuario.id, this.usuario.usuario.esMise, this.frmReset.value).then(
			res => {
				// Oculta la barra de progreso una vez obtenida la respuesta
				this.esCargando = false;
				// Recibe la respuesta
				if (res.exito) {
					/// Muestra mensaje de error
					this.msgBox.open('OK', res.mensaje, null);
				} else {
					// Oculta la barra de progreso una vez obtenida la respuesta
					this.esCargando = false;
					// Muestra mensaje de error
					this.msgBox.open('ERROR', res.mensaje, null);
				}
			},
			err => {
				// Oculta la barra de progreso en caso de error
				this.esCargando = false;
				// Muestra el mensaje de error
				this.msgBox.open('ERROR', 'Error en el proceso, contactese con el administrador', null);
			}
		);
	};

	// Métodos Privados

	/**
	 * Método encargado de validar el patrón del teléfono
	 * @returns Retorna el valor de contraseña cuando coinciden los datos
	 */
	private VerificarTelefono(): any {
		return (control: FormControl) => {
			const re = new RegExp('^[0-9]{8}$');
			return re.test(control.value) ? null : { valid: true };
		}
	};

	/**
	 * Método encargado de obtener los datos del storage
	 */
	private ObtenerDatosStorage(): void {
		// Variable para asignar el correo electrónico
		let email = '';
		// Obtiene los datos enviados desde el componente de listar
		this.usuario = this.storage._storage();
		// Valida que existan datos para consultar
		if (this.usuario) {
			// Verifica si existe un correo electrónico asociado al usuario para pre-establecerlo
			if (this.usuario.persona.mediosContacto && this.usuario.persona.mediosContacto.length > 0) {
				// Recorre la lista de medios de contacto para verificar si existe un correo electrónico
				this.usuario.persona.mediosContacto.some(medio => {
					// Valida si el medio de contacto corresponde a un correo electrrónico
					if (medio.tipoMedioContacto_id._id === '5a8c634d329037a9f0e97a26') {
						// Si existiese se lo asigna a la variable y sale del ciclo
						email = medio.descripcion;
						return true;
					}
				});
			}
			// Establece los datos de notificación (si existiesen)
			this.frmReset.setValue({ correo: email, telefono: '' });
		}
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Obtiene los parametros de la ruta
		this.ObtenerDatosStorage();
	};

	/**
	 * Método de finalización del componente
	 */
	public ngOnDestroy() {
		// Elimina los datos del almacenamiento temporal
		this.storage.eliminar();
	};
}
