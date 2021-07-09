// Definición typescript para el componente DialogGraficosComponent v2.0.0
// Proyecto: Arca 2.0
// Definiciones por: Felipe Jiménez Caderón <fjimenca@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from './../../../shared/controls/dialog/dialog.service';
import { AutorizacionService } from './../../../shared/services/autorizacion.service';

@Component({
	selector: 'arca-dialog-graficos',
	templateUrl: './dialog-graficos.component.html',
	styleUrls: ['./dialog-graficos.component.scss'],
})
export class DialogGraficosComponent implements OnInit {
	constructor(
		private _router: Router,
		private msgBox: DialogService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private auth: AutorizacionService,
		public dialog: MatDialog,
		private snackBar: MatSnackBar,
		private _location: Location
	) {}

	/**Variable para mostrar el grafico 1 */
	public grafico1 = true ;
	/**Variable para mostrar el grafico 2 */
	public grafico2 = false ;
	/**Variable para mostrar el grafico 1 */
	public grafico3 = false ;

	ngOnInit() {
	}

	/**
	 * Método en cargado de regresar a la pagina anterior
	 */
	IrPaginaAnterior(): void {
		if (this.route.snapshot.paramMap.get('token')) {
			// si tiene token debe refrescar la pagina
			location.reload();
		} else {
			this._location.back();
		}
	}

	/**
	 * Método en cargado de validar los permisos del usuario
	 */
	ValidarPerfiles(perfiles: Array<any>): any {
		const resultados = [];
		perfiles.forEach(async (perfil) => {
			// Invoca el servicio encargado de validar el perfil
			await this.auth
				.ValidateByNombrePerfil(perfil.trim())
				.then((resp) => {
					// Se valida que tiene una respuesta
					resultados.push(resp);
					if (perfiles.length === resultados.length) {
						if (!resultados.some((e) => e)) {
							// si no tiene al menos un valor en true debe de salir
							this.IrPaginaAnterior();
							this.snackBar.open(
								'No cuenta con los permisos necesarios para ingresar a esta página',
								null,
								{
									duration: 3000,
								}
							);
						}
					}
				});
		});
	}
	/**
	 * Método en cargado de avanzar con el siguiente grafico en el dialogo
	 */
	public AvanzarGrafico(): void {
		if (this.grafico1){
			this.grafico1 = false;
			this.grafico2 = true;
			return;
		}
		else if (this.grafico2){
			this.grafico2 = false;
			this.grafico3 = true;
			return;
		}
		else if (this.grafico3){
			this.grafico1 = true;
			this.grafico3 = false;
			return;
		}
	}
	/**
	 * Método en cargado de retroceder con el anterior grafico en el dialogo
	 */
	public RetrocederGrafico(): void {
		if (this.grafico1){
			this.grafico1 = false;
			this.grafico3 = true;
			return;
		}
		else if (this.grafico2){
			this.grafico2 = false;
			this.grafico1 = true;
			return;
		}
		else if (this.grafico3){
			this.grafico2 = true;
			this.grafico3 = false;
			return;
		}
	}

}
