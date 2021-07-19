// Definición typescript para el componente materiales-servicios-modificar-editar.component v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { UtilidadesService } from 'app/shared/services/utilidades.service';
import {
    IdataModelInfoGeneral,
    InfoGeneralComponent
} from 'app/shared/controls/info-general/info-general.component';
import {
    FormGroup,
    Validators,
    FormBuilder,
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';

@Component({
    selector: 'bitzu-materiales-servicios-modificar-editar',
    templateUrl: './materiales-servicios-modificar-editar.component.html',
    styleUrls: ['./materiales-servicios-modificar-editar.component.scss'],

    animations: [
        // Evento que se ejecuta la transición 'fade in o fade out' para los componentes que tienen como identificador 'apps'
        trigger('apps', [
            // Transición de cualquier identificador a 'fadeIn'
            transition('* => fadeIn', [
                style({ opacity: 0 }),
                animate(1000, style({ opacity: 1 }))
            ]),
            // Transición de cualquier identificador a 'fadeOut'
            transition('* => fadeOut', [animate(1000, style({ opacity: 0 }))])
        ])
    ]
})
export class MaterialesServiciosModificarEditarComponent implements OnInit {
    /**
     * Variable que maneja la clase para el tema
     */
    public temaApp: string;

    /**
     * Variable que maneja los eventos de siguiente y anterior entre pantallas
     */
    public mostrarSig: boolean = true;
    public mostrarAnt: boolean = false;
    public guardarInfo: boolean = false;

    /**
   Datos de formulario de informacion general para manipular la información y se traslada a otros componentes
   */
    public frmModificacionMaterial: FormGroup;

    /**
     *Variable para indicar si el formulario se debe resetar a un estado inicial
     */
    public esEstadoInicialForm = false;

    /**
     * Variable para recibir los datos de forma temporal y cargarlos al formgroup
     */
    private datos: IdataModelModificacionMat;

    /**
     * Variable para mostrar/ocultar la barra de progreso
     */
    public esCargando = false;

    /**
     * Datos obtenidos del formulario info general
     */
    public dataInfoGeneral: IdataModelInfoGeneral;

    /**
     * Variable que contiene el valor por defecto del servicio
     */
    public valorDefaultServicioArea: string;

    /**
     * Propiedad decorativa para acceder al componente desde el HTML
     */
    @ViewChild('infoGeneralService')
    infoGeneralService: InfoGeneralComponent;

    /**
     * Atributo de salida que retorna el conjunto de datos dados por el usuario
     */
    @Output('validarItem')
    private validarItem: EventEmitter<IdataModelInfoGeneral> = new EventEmitter<IdataModelInfoGeneral>();

    constructor(private utilidadesService: UtilidadesService, private fb: FormBuilder) {
        this.frmModificacionMaterial = this.fb.group({
            descMatServ: [null, Validators.required],
            detModificacion: [null, Validators.required],
            descPropuesta: [null, Validators.required],
            JustModificacion: [null, Validators.required]
        });
    }

    public validarInfo() {
        this.mostrarSig = false;
        this.mostrarAnt = true;
        this.guardarInfo = true;
        // Inicia la barra de progreso
        //this.esCargando = true;
    }

    public atras() {
        this.mostrarSig = true;
        this.mostrarAnt = false;
        this.guardarInfo = false;
        // Inicia la barra de progreso
        //this.esCargando = true;
    }

    /** Permite restablecer la vista del formulario a un estado inicial */
    public restablecerVistaFormulario(): void {
        if (this.esEstadoInicialForm) {
            this.frmModificacionMaterial.reset(); // Limpia el formulario
            this.esEstadoInicialForm = false; // Resetea el estado inicial del formulario
        }
    }

    /**
     * Evento que dispara submit para el formulario hijo (child)
     */
    public validarInfoGeneral() {
        this.infoGeneralService.documentForm.onSubmit(undefined);
    }

    /**
     * Evento que viene del componente hijo info general, con el conjunto de datos valido
     * @param dataModel Modelo de datos
     */
    public obtenerDatosInfoGeneral(dataModel: IdataModelInfoGeneral): void {
        if (dataModel != undefined) {
            this.dataInfoGeneral = dataModel;
            this.valorDefaultServicioArea = this.dataInfoGeneral.servicio._id;
            this.mostrarSig = false;
            this.mostrarAnt = true;
            this.guardarInfo = true;
        }
    }

    //Funcion validar campos texto y materiales
    public validar(): void {
        if (this.frmModificacionMaterial.valid) {
            // this.validarItem.emit(this.frmModificacionMaterial.getRawValue());
            this.atras();
            console.log('valido');
            // this.frmModificacionMaterial.controls['descMatServ'].setValue('banco1');
        } else 
          this.validarItem.emit(null);
          console.log('invalido');
          console.log(this.frmModificacionMaterial.value);
    }

    public limpiar(): void {
		// Limpiar el formulario
		this.frmModificacionMaterial.reset();
		// Deshabilita el modo edición
		this.esEstadoInicialForm= false;
	};

    ngOnInit(): void {
        //Se obtiene el tema
        this.temaApp = this.utilidadesService.GetTemaAplicacion();
    }
}

//Interfaz de Variables
export interface IdataModelModificacionMat {
    descMatServ: string;
    detModificacion: string;
    descPropuesta: string;
    JustModificacion: string;
}
