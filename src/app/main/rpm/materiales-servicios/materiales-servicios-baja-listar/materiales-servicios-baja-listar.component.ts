// Definición typescript para el componente materiales-servicios-baja-listar.component v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
// Se importan los servicios a utilizar
import { DialogService } from './../../../../shared/controls/dialog/dialog.service';

import { UtilidadesService } from './../../../../shared/services/utilidades.service';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MaterialesServiciosBajaEditarComponent } from '../materiales-servicios-baja-editar/materiales-servicios-baja-editar.component';
import { MaterialesSevice } from '../servicios/materiales.service';

@Component({
    selector: 'bitzu-materiales-servicios-baja-listar',
    templateUrl: './materiales-servicios-baja-listar.component.html',
    styleUrls: ['./materiales-servicios-baja-listar.component.scss']
})
export class MaterialesServiciosBajaListarComponent implements OnInit {
    /**
     * Variable para mostrar/ocultar la barra de progreso
     */
    public esCargando = false;
    /**
     * Variable que almacena los datos obtenidos de los catálogos
     */
    public catalogo: any = [];
    /**
     * Variable que contiene el filtro del texto a buscar en la lista
     */
    public txtFiltro: string;
    /**
     * Representa el item catálogo
     */
    public item: {
        _id: String;
        id_grupo: number;
        descripcion: String;
        estado: Boolean;
    } = {
        _id: '',
        id_grupo: 0,
        descripcion: '',
        estado: true
    };
    /**
     * Representa bandera para indicar si el formulario se encuetra en edición
     */
    public esEdicion = false;
    /**
     * Representa el objeto en estado inicial antes de que el usuario manipule sus atributos
     */
    public estadoInicial: any = null;

    buscarPorNombre: string;

    constructor(
        private materialesService: MaterialesSevice,
        private dialogos: MatDialog,
        private _location: Location,
        private msgBox: DialogService,
        private utilidadesService: UtilidadesService,
        private snackBar: MatSnackBar
    ) {}

    agregarBaja() {
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
            MaterialesServiciosBajaEditarComponent,
            configDialogoCrear
        );
        // Se customiza el evento que retorna información de la ventana de búsqueda
        busquedaMaterial.afterClosed().subscribe((res) => {
            // Se valida que exista una respuesta
            if (res) {
                // Asigna la respuesta a una variable
                this.catalogo = res;
            }
        });
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

        // // Se crea una variable que representa a la ventana de cración de solicitud para modificación
        // const busquedaMaterial = this.dialogos.open(
        //     MaterialesServiciosModificarEditarComponent,
        //     configDialogoCrear
        // );
        // // Se customiza el evento que retorna información de la ventana de búsqueda
        // busquedaMaterial.afterClosed().subscribe((res) => {
        //     // Se valida que exista una respuesta
        //     if (res) {
        //         // Asigna la respuesta a una variable
        //         this.material = res;
        //     }
        // });
    }

	public LimpiarBusqueda():void{
	this.txtFiltro = '';

	}

    /**
     * Método en cargado de obtener los tipos de materiaes.
     */
    private ObtenerCatalogo(): void {
        // Inicia la barra de progreso
        this.esCargando = true;
        // Se llama a la función del servicio que envia los datos al server
        this.materialesService.List().then(
            (res) => {
                // Oculta la barra de progreso una vez obtenida la respuesta
                this.esCargando = false;
                // Recibe la respuesta
                // res.exito = true;
                if (res.exito) {
                    // Se asigna los datos a la variable para mostrar la lista de ítems.
                    this.catalogo = res.data;
                    // se almacena el estado inicial de la estructura
                    this.estadoInicial = JSON.parse(JSON.stringify(this.catalogo));
                } else {
                    // Muestra el mensaje en el caso de que no se encontraran registros asociados al catálogo
                    this.snackBar.open(res.mensaje, 'Sin datos.', {
                        duration: 5000
                    });
                }
            },
            (err) => {
                // Oculta la barra de progreso en caso de error
                this.esCargando = false;
                // Muestra el mensaje con el error
                if (err.error) {
                    this.snackBar.open(err.error.message, null, { duration: 5000 });
                }
            }
        );
    }

    // 1/7
    // ngOnInit() {}
    public ngOnInit() {
        // Carga el catálogo de tipos de provincias
        this.ObtenerCatalogo();
    }
}
