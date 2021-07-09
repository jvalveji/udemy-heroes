// Definición typescript para el componente materiales-servicios-modificar-editar.component v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import { Component, OnInit } from '@angular/core';
import { UtilidadesService } from 'app/shared/services/utilidades.service';

@Component({
    selector: 'bitzu-materiales-servicios-modificar-editar',
    templateUrl: './materiales-servicios-modificar-editar.component.html',
    styleUrls: ['./materiales-servicios-modificar-editar.component.scss']
})
export class MaterialesServiciosModificarEditarComponent implements OnInit {
    /**
     * Variable que maneja la clase para el tema
     */
    public temaApp: string;

    constructor(private utilidadesService: UtilidadesService) {}

    ngOnInit(): void {
        //Se obtiene el tema
        this.temaApp = this.utilidadesService.GetTemaAplicacion();
    }
}
