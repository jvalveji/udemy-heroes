// Definición typescript para el componente materiales-servicios-modificar-editar.component v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { UtilidadesService } from 'app/shared/services/utilidades.service';
import { IdataModelInfoGeneral, InfoGeneralComponent } from 'app/shared/controls/info-general/info-general.component';

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

    public mostrarSig: boolean = true;
    public mostrarAnt: boolean = false;
    public guardarInfo: boolean = false;

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
    @ViewChild("infoGeneralService")
    infoGeneralService: InfoGeneralComponent;


    constructor(private utilidadesService: UtilidadesService) { }

    public validarInfo() {
        this.mostrarSig = false;
        this.mostrarAnt = true;
        this.guardarInfo = true;
        // Inicia la barra de progreso
        //this.esCargando = true;
    };

    public atras() {
        this.mostrarSig = true;
        this.mostrarAnt = false;
        this.guardarInfo = false;
        // Inicia la barra de progreso
        //this.esCargando = true;
    };
    /**
     * Evento que dispara submit para el formulario hijo (child)
     */
    public validarInfoGeneral() {
        this.infoGeneralService.documentForm.onSubmit(undefined);
    };

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

    ngOnInit(): void {
        //Se obtiene el tema
        this.temaApp = this.utilidadesService.GetTemaAplicacion();
    }
}
