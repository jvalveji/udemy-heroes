import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialesServiciosAccesoEditarComponent } from '../materiales-servicios-acceso-editar/materiales-servicios-acceso-editar.component';
import { MaterialesSevice } from '../servicios/materiales.service';

@Component({
    selector: 'bitzu-materiales-servicios-acceso-listar',
    templateUrl: './materiales-servicios-acceso-listar.component.html',
    styleUrls: ['./materiales-servicios-acceso-listar.component.scss']
})
export class MaterialesServiciosAccesoListarComponent implements OnInit, OnDestroy {
    @Input() nuevo: string = 'NuevoRotulo';
    materiales: any[] = [];
    buscarPorNombre: string;
    txtFiltro: string;

    public material: any;

    private materialesSubscription!: Subscription;

    constructor(private materialesService: MaterialesSevice, private dialogos: MatDialog) {}

    Buscar(para: string): void {
      const imprime = para;
      console.log(imprime);
  }

    agregarAcceso() {
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
          MaterialesServiciosAccesoEditarComponent,
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
