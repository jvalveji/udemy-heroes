// Definición typescript para el componente materiales-servicios-alta-lista.component.ts v1.0
// Proyecto: Bitzú - RPM
// Definiciones por: Equipo Bitzú RPM
// Modificado: 08/07/2021

import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { MaterialesServiciosAltaEditarComponent } from "../materiales-servicios-alta-editar/materiales-servicios-alta-editar.component";
import { MaterialesSevice } from "../servicios/materiales.service";

@Component({
	selector: "bitzu-materiales-servicios-alta-listar",
	templateUrl: "./materiales-servicios-alta-listar.component.html",
	styleUrls: ["./materiales-servicios-alta-listar.component.scss"],
})
export class MaterialesServiciosAltaListarComponent
	implements OnInit, OnDestroy
{
	@Input() nuevo: string = "NuevoRotulo";
	materiales: any[] = [];
	buscarPorNombre: string;
	txtFiltro: string;

	public material: any;

	private materialesSubscription!: Subscription;

	constructor(
		private materialesService: MaterialesSevice,
		private dialogos: MatDialog
	) {}

	Buscar(para: string): void {
		const imprime = para;
		console.log(imprime);
	}

	agregarCodigo() {
		const configDialogoCrear = {
			disableClose: false, //deshabilita el click fuera de la ventana emergente
			panelClass: "full-width-dialog",
			hasBackdrop: true,
			width: "80%",
			height: "80%",
			maxWidth: "100vw",
			maxHeight: "100vh",
			data: null,
		};

		// Se crea una variable que representa a la ventana de cración de solicitud para modificación
		const busquedaMaterial = this.dialogos.open(
			MaterialesServiciosAltaEditarComponent,
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
		this.materialesSubscription =
			this.materialesService.materialesSubject.subscribe(() => {
				this.materiales = this.materialesService.obtenerMateriales();
			});
	}

	ngOnDestroy() {
		this.materialesSubscription.unsubscribe;
	}
}
