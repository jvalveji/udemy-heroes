// Definición typescript para el componente materiales-servicios-modificar-listar.component v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoGeneralComponent } from 'app/shared/controls/info-general/info-general.component';

@Component({
    selector: 'bitzu-materiales-servicios-modificar-listar',
    templateUrl: './materiales-servicios-modificar-listar.component.html',
    styleUrls: ['./materiales-servicios-modificar-listar.component.scss']
})
export class MaterialesServiciosModificarListarComponent implements OnInit {
    public material: any;

    constructor(private dialogos: MatDialog) {}

    agregarModificacion() {
        const configDialogoCrear = {
            disableClose: false, //deshabilita el click fuera de la ventana emergente
            panelClass: 'full-width-dialog',
            hasBackdrop: true,
            width: '80%',
            height: '80%',
            maxWidth: '100vw',
            maxHeight: '100vh',
            data: null
        };

        // Se crea una variable que representa a la ventana de cración de solicitud para modificación
        const busquedaMaterial = this.dialogos.open(InfoGeneralComponent, configDialogoCrear);
        // Se customiza el evento que retorna información de la ventana de búsqueda
        busquedaMaterial.afterClosed().subscribe((res) => {
            // Se valida que exista una respuesta
            if (res) {
                // Asigna la respuesta a una variable
                this.material = res;
            }
        });
    }

    ngOnInit(): void {}
}
