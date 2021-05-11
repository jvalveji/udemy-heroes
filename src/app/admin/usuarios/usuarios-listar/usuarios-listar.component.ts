// Definición typescript para el componente UsuariosListarComponent v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Se importan los servicios a utilizar
import { UsuariosService } from '../usuarios.service';
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { StorageService } from './../../../shared/services/storage.service';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_usuarios'])
/**
 * Componente destinado al despligue y manejo de los usuarios de la aplicación
 */
@Component({
	selector: 'arca-usuarios-listar',
	templateUrl: './usuarios-listar.component.html',
	styleUrls: ['./usuarios-listar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	providers: [UsuariosService]
})
export class UsuariosListarComponent implements OnInit {

	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que almacena los datos obtenidos de los usuarios
	 */
	public usuarios: Array<any> = [];
	/**
	 * Variable que representa el formulario
	 */
	public frmFiltroBusqueda: FormGroup;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param usuariosService Variable que representa a los servicios para los usuarios
	 * @param fb Representa un objeto de tipo FormBuilder
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param _router Representa el módulo de ruteo
	 * @param route Representa la ruta actualmente activa
	 * @param storage Representa el servicio de almacenamiento temporal entre componentes
	 * @param snackBar Representa el componente de mensajes
	 */
	constructor(private _location: Location,
		private usuariosService: UsuariosService,
		private fb: FormBuilder,
		private msgBox: DialogService,
		private _router: Router,
		private route: ActivatedRoute,
		private storage: StorageService,
		private snackBar: MatSnackBar) {
		// Asigna los controles al objeto formulario
		this.frmFiltroBusqueda = this.fb.group({
			'filtro': ['', Validators.compose([Validators.required, Validators.minLength(3)])]
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
	 * Método encargado de filtrar los usuarios del sistema
	 */
	public Filtrar(): void {
		// Valida si el filtro es válido
		if (this.frmFiltroBusqueda.valid) {
			// Carga la lista de usuarios del sistema
			this.ObtenerListaUsuarios(this.frmFiltroBusqueda.value.filtro);
		}
	};

	/**
	 * Método encargado de redireccionar a la página de edición de usuarios para crear uno nuevo
	 */
	public NuevoUsuario(): void {
		// Lo envia a la ventana de logueo (envia el usuario como parámetro pero se oculta en la URL)
		this._router.navigate(['./editar'], { relativeTo: this.route });
	};

	/**
	 * Método encargado de redireccionar a la página de edición de usuarios para editar uno existente
	 * @param idUsuario Id del usuario
	 * @param idPersona Id de la persona asociada al usuario
	 */
	public EditarUsuario(idUsuario: string, idPersona: string): void {
		// Establece los datos a pasar al siguiente componente por medio de servicio temporal
		this.storage.storage({ usuario: idUsuario, persona: idPersona });
		// Lo envia a la ventana de logueo (envia el usuario como parámetro pero se oculta en la URL)
		// this._router.navigate(['/admin/usuarios/editar', { usuario: idUsuario, persona: idPersona }], { skipLocationChange: true });
		this._router.navigate(['./editar'], { relativeTo: this.route });
	};

	/**
	 * Método encargado de redireccionar a la página de edición de permisos para el usuario
	 * @param item Parámetro con los datos del usuario/persona
	 */
	public EditarPermisos(item: any): void {
		// Establece los datos a pasar al siguiente componente por medio de servicio temporal
		this.storage.storage(item);
		// Lo envia a la ventana de logueo (envia el usuario como parámetro pero se oculta en la URL)
		this._router.navigate(['./permisos'], { relativeTo: this.route });
	};

	/**
	 * Método encargado de redireccionar a la página de restablecer la contraseña del usuario
	 * @param item Parámetro con los datos del usuario/persona
	 */
	public RestablecerPassword(item: any): void {
		// Establece los datos a pasar al siguiente componente por medio de servicio temporal
		this.storage.storage(item);
		// Lo envia a la ventana de logueo (envia el usuario como parámetro pero se oculta en la URL)
		this._router.navigate(['/bitzu/login/reset-password']);
	};

	// Métodos privados

	/**
	 * Método encargado de buscar los usuarios del sistema
	 * @param filtro Parámetro que indica el filtro de búsqueda para los usuarios
	 */
	private ObtenerListaUsuarios(filtro: string): void {
		// Limpia la lista
		this.usuarios = null;
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.usuariosService.Show(filtro).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.usuarios = res.data.length > 0 ? res.data : [];
				if (this.usuarios.length <= 0) {
					// Muestra el mensaje si no se encontraron coincidencias
					this.snackBar.open('No se encontraron coincidencias.', null, {
						duration: 5000
					});
				}
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
	 * Método inicial del componente
	 */
	public ngOnInit() { };
}
