// Definición typescript para el componente materiales-servicios-modificar-listar.component v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialesServiciosModificarEditarComponent } from '../materiales-servicios-modificar-editar/materiales-servicios-modificar-editar.component';
import { MaterialesSevice } from '../servicios/materiales.service';

@Component({
    selector: 'bitzu-materiales-servicios-modificar-listar',
    templateUrl: './materiales-servicios-modificar-listar.component.html',
    styleUrls: ['./materiales-servicios-modificar-listar.component.scss']
})
export class MaterialesServiciosModificarListarComponent implements OnInit, OnDestroy {
    @Input() nuevo: string = 'NuevoRotulo';
    materiales: any[] = [];
    buscarPorNombre: string;
    txtFiltro: string = 'Inicio';

    public material: any;

    private materialesSubscription!: Subscription;

    constructor(private materialesService: MaterialesSevice, private dialogos: MatDialog) {}

    Buscar(para: string): void {
        const imprime = para;
        console.log(imprime);
    }

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
        const busquedaMaterial = this.dialogos.open(
            MaterialesServiciosModificarEditarComponent,
            configDialogoCrear
        );
        // Se customiza el evento que retorna información de la ventana de búsqueda
        busquedaMaterial.afterClosed().subscribe((res) => {
            // Se valida que exista una respuesta
            if (res) {
                // Asigna la respuesta a una variable
                this.material = res;
            }
        });
    }

    agregarlinea() {
        let item = { _id: '11', descripcion: '', idMaterial: 11 };
        item.descripcion = this.txtFiltro;
        console.log(this.materiales);
        this.materiales.push(item);
    }

    ngOnInit() {
        this.materiales = this.materialesService.obtenerMateriales();
        this.materialesSubscription = this.materialesService.materialesSubject.subscribe(() => {
            this.materiales = this.materialesService.obtenerMateriales();
        });
    }

    ngOnDestroy() {
        this.materialesSubscription.unsubscribe;
    }
}
