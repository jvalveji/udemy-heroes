// Definición typescript para el componente materiales-servicios-alta-lista.component.ts v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'bitzu-materiales-servicios-alta-listar',
    templateUrl: './materiales-servicios-alta-listar.component.html',
    styleUrls: ['./materiales-servicios-alta-listar.component.scss']
})
export class MaterialesServiciosAltaListarComponent implements OnInit {
    constructor() {}

    agregarCodigo() {
        console.log('Hola');
    }

    ngOnInit(): void {}
}
