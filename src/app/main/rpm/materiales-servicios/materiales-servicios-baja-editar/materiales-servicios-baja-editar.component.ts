// Definición typescript para el componente materiales-servicios-baja-editar.component v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UtilidadesService } from 'app/shared/services/utilidades.service';
import { AutocompleteComponent } from 'app/shared/controls/autocomplete/autocomplete.component';

@Component({
    selector: 'bitzu-materiales-servicios-baja-editar',
    templateUrl: './materiales-servicios-baja-editar.component.html',
    styleUrls: ['./materiales-servicios-baja-editar.component.scss'],
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
export class MaterialesServiciosBajaEditarComponent implements OnInit {
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
     * Se "instancia" el componente de autocompletar (en el html) para accederlo
     * */
    @ViewChild('serviciosAutoComplete')
    serviciosAutoComplete: AutocompleteComponent;

    /**
     * Variable temporal que maneja la lista de areas o servicios en el formulario
     */
    public codigosMatserv: any = [
        { _id: '1', descripcion: '1001', idCodigo: 1 },
        { _id: '2', descripcion: '2100', idCodigo: 2 },
        { _id: '3', descripcion: '3400', idCodigo: 3 }
    ];

    /**
     * Variable temporal que maneja la lista de areas o servicios en el formulario
     */
    public descripcionMatserv: any = [
        { _id: '1', descripcion: 'Computadora portátil', idCodigo: 1 },
        { _id: '2', descripcion: 'Mesa rectangular', idCodigo: 2 },
        { _id: '3', descripcion: 'Acetaminofén', idCodigo: 3 }
    ];

    /**
     * Variable que maneja el estado del estatus de la selección para el servicio o área
     */
    public serviciosAutoCompleteStatus: boolean = false;

    constructor(private utilidadesService: UtilidadesService) {}

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

    public validarInfoGeneral() {
        this.mostrarSig = false;
        this.mostrarAnt = true;
        this.guardarInfo = true;
    }

    ngOnInit(): void {
        //Se obtiene el tema
        this.temaApp = this.utilidadesService.GetTemaAplicacion();
    }
}
