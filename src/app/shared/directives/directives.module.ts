// Definición typescript para el módulo ArcaDirectivesModule v2.2.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (02-05-2019) Ing. Dagoberto Gómez Jiménez

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Se importa la directiva para la seguridad
import { AccesoAppDirective } from './acceso-app.directive';
import { AccesoPerfilDirective } from './acceso-perfil.directive';
import { AccesoPathDirective } from './acceso-path.directive';
import { AccesoPermisoDirective } from './acceso-permiso.directive';
import { DragScrollDirective } from './drag-scroll/drag-scroll.directive';
import { AutoRealceDirective } from './auto-realce.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		AccesoAppDirective,
		AccesoPerfilDirective,
		AccesoPathDirective,
		AccesoPermisoDirective,
		DragScrollDirective,
		AutoRealceDirective
	],
	exports: [
		AccesoAppDirective,
		AccesoPerfilDirective,
		AccesoPathDirective,
		AccesoPermisoDirective,
		DragScrollDirective,
		AutoRealceDirective
	],
})
export class ArcaDirectivesModule { }
