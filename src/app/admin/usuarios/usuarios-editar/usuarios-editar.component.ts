// Definición typescript para el componente UsuariosEditarComponent v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>

import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';

// Se importan los servicios a utilizar
import { CatalogosService } from '../../catalogos/catalogos.service';
import { UsuariosService } from '../usuarios.service';
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { StorageService } from './../../../shared/services/storage.service';
import { MediosContactoService } from '../../catalogos/medios-contacto/medios-contacto.service';
import { TiposIdentificacionService } from '../../catalogos/tipos-identificacion/tipos-identificacion.service';
import { GenerosService } from '../../catalogos/generos/generos.service';
import { UtilidadesService } from './../../../shared/services/utilidades.service';

// Se importan los componentes a utilizar
import { PersonasSearchComponent } from './../../../shared/controls/personas-search/personas-search.component';

// Se importan las interfaces a utilizar
import { IPersona } from './../../../shared/interfaces/persona';
import { IUsuario } from './../../../shared/interfaces/usuario';

// Se importa el decorador para la seguridad en las rutas de la aplicación
import { Activate } from './../../../shared/decorators/activate.decorator';

/** Permiso de la aplicación para este componente (ruta) */
@Activate(['adm_usuarios_editar'])
/**
 * Componente destinado al despligue y manejo de los usuarios de la plataforma Arca - MEAN
 */
@Component({
	selector: 'arca-usuarios-editar',
	templateUrl: './usuarios-editar.component.html',
	styleUrls: ['./usuarios-editar.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	providers: [UsuariosService, CatalogosService],
})
export class UsuariosEditarComponent implements OnInit, OnDestroy {
	/**
	 * Se "instancia" el componente de autocompletar (en el html) para accederlo
	 */
	@ViewChild('personasSearch') personasSearch: PersonasSearchComponent;
	/**
	 * Variable para mostrar/ocultar la barra de progreso
	 */
	public esCargando = false;
	/**
	 * Variable que representa los datos del usuario
	 */
	private usuarioBD: any;
	/**
	 * Variable que representa el formulario
	 */
	public frmUsuarios: FormGroup;
	/**
	 * Variable que almacena los tipos de identificación
	 */
	public tiposIdentificacion = null;
	/**
	 * Variable que almacena los tipos de género
	 */
	public tiposGenero = null;
	/**
	 * Variable que almacena los tipos de medios de contacto
	 */
	public tiposMediosContacto = null;
	/**
	 * Variable para manejar los medios de contacto del usuario
	 */
	public mediosContactoUsuario: Array<any>;
	/**
	 * Variable que contiene la descripción del tipo de medio de contacto a agregar
	 */
	public txtIdMedioContacto: any;
	/**
	 * Variable que contiene el detalle del medio de contacto a agregar
	 */
	public txtDetalleMedioContacto: string = null;
	/**
	 * Variable que contiene el tipo de identificación que fue seleccionada
	 */
	public tipoIdentificacionSeleccionado: any;
	/**
	 * Variable que contiene el tipo de género seleccionado
	 */
	public tipoGeneroSeleccionado: any;
	/**
	 * Variable que indica si muestra/oculta el componente de búsqueda de personas
	 */
	public esBuscarPersona: boolean;
	/**
	 * Variable que indica el estado de la búsqueda de la persona
	 */
	public existePersona: boolean;

	/**
	 * Constructor de la clase
	 * @param _location Parametro que representa el servicio de localización de rutas
	 * @param usuariosService Variable que representa a los servicios para los usuarios
	 * @param mediosContactoService Variable que representa a los servicios de medios de contacto del core
	 * @param fb Representa un objeto de tipo FormBuilder
	 * @param msgBox Representa el servicio para las ventanas de dialogo
	 * @param snackBar Representa el componente snackBar para mostrar mensajes
	 * @param storage Representa el servicio de almacenamiento temporal entre componentes
	 * @param tiposIdentificacionService representa el servicio para tipos de identificación del core
	 * @param generosService representa el servicio para tipos de género del core
	 */
	constructor(private _location: Location,
		private usuariosService: UsuariosService,
		private mediosContactoService: MediosContactoService,
		private fb: FormBuilder,
		private msgBox: DialogService,
		private snackBar: MatSnackBar,
		private storage: StorageService,
		private tiposIdentificacionService: TiposIdentificacionService,
		private generosService: GenerosService,
		private utilidadesService: UtilidadesService) {
		// Asigna los controles al objeto formulario
		this.frmUsuarios = this.fb.group({
			// Usuario
			esMise: [false],
			usuario: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			password: [{ value: '', disabled: true }],
			estado: [true],
			// Persona
			tipoIdentificacion: ['', Validators.required],
			tipoIdentificacion_descripcion: ['', Validators.required],
			identificacion: ['', Validators.compose([Validators.required, Validators.minLength(9)])],
			nombre: ['', Validators.required],
			apellido1: ['', Validators.required],
			apellido2: ['', Validators.required],
			fechaNacimiento: [null],
			genero: ['', Validators.required],
			genero_descripcion: ['', Validators.required],
			esUsuarioArca: [true]
		});

		// Inicializa el arreglo de medios de contacto
		this.mediosContactoUsuario = [];
		// Habilita el componente de búsqueda
		this.esBuscarPersona = true;
		this.existePersona = false;
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
	 * Método encargado de obtener el tipo de medio de contacto
	 * del catálogo según Id
	 * @param medio Indica el item a buscar en el catálogo
	 * @return Retorna el tipo de medio de contacto indicado
	 */
	public ObtenerMedioContactoPorId(medio: any): any {
		let resp = null;
		// Recorrer el arreglo del catálogo
		this.tiposMediosContacto.forEach(item => {
			// Retorna el item que coincide con el id
			if (item._id === medio._id) { resp = item; }
		});
		// Retorna la respuesta
		return resp;
	};

	/**
	 * Evento desencadenado por el control de fecha
	 * @param event Evento que contiene el dato seleccionado por el usuario
	 */
	public CambioValorFecha(event: MatDatepickerInputEvent<Date>): void {
		this.frmUsuarios.value.fechaNacimiento = event.value;
	};

	/**
	 * Método encargado de agregar el medio de contacto al arreglo
	 */
	public AgregarMedioContacto(): void {
		// valida que existan datos para incluir
		if (this.txtIdMedioContacto) {
			// Agrega el objeto al arreglo
			this.mediosContactoUsuario.push({
				tipoMedioContacto_id: {
					_id: this.txtIdMedioContacto._id,
					descripcion: this.txtIdMedioContacto.descripcion,
				},
				descripcion: this.txtDetalleMedioContacto
			});
			// Limpiar los campos
			this.txtIdMedioContacto = null;
			this.txtDetalleMedioContacto = null;
		}
	};

	/**
	 * Método encargado de enviar la información al servidor para guardar/actualizar
	 */
	public Guardar(): void {

		// Se almacenan los datos en una variable (interface) tipo IUsuario
		const _usuario: IUsuario = {
			esMise: this.frmUsuarios.value.esMise,
			usuario: this.frmUsuarios.value.usuario,
			estado: this.frmUsuarios.value.estado
		};

		// Se almacenan los datos en una variable (interface) tipo IPersona
		const _persona: IPersona = {
			tipoIdentificacion_id: {
				_id: this.tipoIdentificacionSeleccionado._id,
				descripcion: this.tipoIdentificacionSeleccionado.descripcion
			},
			identificacion: this.frmUsuarios.value.identificacion,
			nombre: this.frmUsuarios.value.nombre,
			apellido1: this.frmUsuarios.value.apellido1,
			apellido2: this.frmUsuarios.value.apellido2,
			fechaNacimiento: this.frmUsuarios.value.fechaNacimiento,
			genero_id: {
				_id: this.tipoGeneroSeleccionado._id,
				descripcion: this.tipoGeneroSeleccionado.descripcion
			},
			esFallecido: false, // Agregar campo al formulario posteriormente
			mediosContacto: this.mediosContactoUsuario,
			esUsuarioArca: true
		};

		// Valida el tipo de proceso a seguir (insertar/actualizar)
		if (this.usuarioBD === undefined || this.usuarioBD === null) {
			// INSERTAR NUEVO REGISTRO
			this.InsertarDatosUsuarioPersona({ usuario: _usuario, persona: _persona });
		}
		else {
			// ACTUALIZAR UN REGISTRO
			this.ActualizarDatosUsuarioPersona(this.usuarioBD._id, { usuario: _usuario, persona: _persona });
		}
		this.esBuscarPersona = true;
		this.existePersona = false;
		this.frmUsuarios.reset();
		this.mediosContactoUsuario = [];
	};

	/**
	 * Método encargado de capturar los datos retornados por el control de búsqueda de personas
	 * @param item Parámetro que representa el conjunto de datos retornados
	 */
	public SeleccionarPersona(item: any): void {
		// Valida si se obtuvieron datos
		if (item) {
			this.existePersona = true;
			// Asigna los datos a la variable que almacena el item seleccionado de cada combo
			this.tipoIdentificacionSeleccionado = item.tipoIdentificacion_id;
			this.tipoGeneroSeleccionado = (item.genero_id) ? item.genero_id : null;

			// Se establecen los datos del usuario en el formulario
			this.frmUsuarios.setValue({
				// Usuario
				esMise: false,
				usuario: null,
				password: null,
				estado: true,
				// Persona
				tipoIdentificacion: item.tipoIdentificacion_id._id,
				tipoIdentificacion_descripcion: item.tipoIdentificacion_id.descripcion,
				identificacion: item.identificacion,
				nombre: item.nombre,
				apellido1: item.apellido1,
				apellido2: item.apellido2,
				fechaNacimiento: (item.fechaNacimiento) ? this.utilidadesService.UTCToLocalDate(new Date(item.fechaNacimiento)) : null,
				genero: (item.genero_id) ? item.genero_id._id : null,
				genero_descripcion: (item.genero_id) ? item.genero_id.descripcion : null,
				esUsuarioArca: item.esUsuarioArca
			});
		}
	};

	// Métodos privados

	/**
	 * Método encargado de obtener los tipos de identificación
	 */
	private ObtenerCatalogoTiposIdentificacion(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.tiposIdentificacionService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.tiposIdentificacion = res.data;
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
	 * Método encargado de obtener los tipos de género
	 */
	private ObtenerCatalogoTiposGenero(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.generosService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.tiposGenero = res.data;
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
	 * Método encargado de obtener los tipos de medios de contacto
	 */
	private ObtenerCatalogoTiposMediosContacto(): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.mediosContactoService.List().then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				this.tiposMediosContacto = res.data;
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
	 * Método encargado de obtener los parámetros de entrada al componente
	 */
	private ObtenerParametrosRuta(): void {
		// Obtiene los datos enviados desde el componente de listar
		const datos = this.storage._storage();
		// Valida que existan datos para consultar
		if (datos) {
			// Obtiene los datos del usuario según parámetros obtenidos del servicio
			this.ListUsuarioLocal(datos.usuario);
			// Deshabilita el componente de búsqueda
			this.esBuscarPersona = false;
			this.existePersona = true;
		}
	};

	/**
	 * Método encargado de obtener los datos del usuario
	 * @param _usuario Identificador del usuario
	 */
	private ListUsuarioLocal(_usuario: any): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.usuariosService.ShowById(_usuario).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Almacena el valor del id del usuario de la BD
				this.usuarioBD = res.data;
				// Se establecen los datos del usuario en el formulario
				this.frmUsuarios.setValue({
					// Usuario
					esMise: this.usuarioBD.esMise,
					usuario: this.usuarioBD.usuario,
					password: (this.usuarioBD.password) ? this.usuarioBD.password : null,
					estado: this.usuarioBD.estado,
					// Persona
					tipoIdentificacion: this.usuarioBD.persona_id.tipoIdentificacion_id._id,
					tipoIdentificacion_descripcion: this.usuarioBD.persona_id.tipoIdentificacion_id.descripcion,
					identificacion: this.usuarioBD.persona_id.identificacion,
					nombre: this.usuarioBD.persona_id.nombre,
					apellido1: this.usuarioBD.persona_id.apellido1,
					apellido2: this.usuarioBD.persona_id.apellido2,
					fechaNacimiento: (this.usuarioBD.persona_id.fechaNacimiento) ? this.utilidadesService.UTCToLocalDate(new Date(this.usuarioBD.persona_id.fechaNacimiento)) : null,
					genero: (this.usuarioBD.persona_id.genero_id) ? this.usuarioBD.persona_id.genero_id._id : null,
					genero_descripcion: (this.usuarioBD.persona_id.genero_id) ? this.usuarioBD.persona_id.genero_id.descripcion : null,
					esUsuarioArca: this.usuarioBD.persona_id.esUsuarioArca
				});

				// Asigna el item obtenido en la consulta a la variable global del combo
				this.tipoIdentificacionSeleccionado = this.usuarioBD.persona_id.tipoIdentificacion_id;
				this.tipoGeneroSeleccionado = this.usuarioBD.persona_id.genero_id;
				// Se asignan los medios de contacto a una variable
				this.mediosContactoUsuario = this.usuarioBD.persona_id.mediosContacto;
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
	   * Método encargado de ingresar nuevos datos para crear un nuevo registro en la base de datos
	   * tanto de usuarios como en la de personas
	   * @param datos Indica los datos para realizar la inserción
	   */
	private InsertarDatosUsuarioPersona(datos: any): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.usuariosService.Create(datos).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Limpiar al formulario
				this.Limpiar();
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
				// Retorna a la página anterior
				this._location.back();
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
	 * Método encargado de actualizar los datos en la base de datos
	 * tanto de usuarios como en la de personas
	 * @param id Indica el id del usuario actualizar
	 * @param datos Indica los datos para realizar la actualización
	 */
	private ActualizarDatosUsuarioPersona(id: any, datos: any): void {
		// Inicia la barra de progreso
		this.esCargando = true;
		// Se llama a la función del servicio que envia los datos al server
		this.usuariosService.Update(id, datos).then((res) => {
			// Oculta la barra de progreso una vez obtenida la respuesta
			this.esCargando = false;
			// Recibe la respuesta
			if (res.exito) {
				// Muestra el mensaje de éxito
				this.snackBar.open(res.mensaje, null, {
					duration: 5000
				});
				// Retorna a la página anterior
				this._location.back();
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
	 * Método encargado de limpiar las variables y datos del formulario
	 */
	private Limpiar(): void {
		// Limpia el formulario
		this.frmUsuarios.reset();
		// Limpia arreglo medios contacto
		this.mediosContactoUsuario = [];
		// Limpia el Id del usuario
		this.usuarioBD = null;
		// Limpiar las variables que almacena los datos de los combos
		this.tipoIdentificacionSeleccionado = null;
		this.tipoGeneroSeleccionado = null;
		// Limpia el control de buscar personas
		this.personasSearch.Clear();
	};

	/**
	 * Método inicial del componente
	 */
	public ngOnInit() {
		// Obtiene los catálogos del sistema
		this.ObtenerCatalogoTiposIdentificacion();
		this.ObtenerCatalogoTiposGenero();
		this.ObtenerCatalogoTiposMediosContacto();
		// Obtiene los parametros de la ruta
		this.ObtenerParametrosRuta();
	};

	/**
	 * Método de finalización del componente
	 */
	public ngOnDestroy() {
		// Elimina los datos del almacenamiento temporal
		this.storage.eliminar();
	};
}
