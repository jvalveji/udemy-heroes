// Definición typescript para el módulo PipesModule v1.2.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (13-11-2018) Ing. Alexander Picado Jiménez

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa los filtros (pipes) a utilizar
import { FiltrarDescripcionPipe } from './filtrar-descripcion.pipe';
import { FiltrarIdDescripcionPipe } from './filtrar-id-descripcion.pipe';
import { FiltrarNombrePipe } from './filtrar-nombre.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SafeHtmlStylePipe } from './safe-html-style.pipe';
import { SafeURLPipe } from './safe-url-html.pipe';
import { FiltrarParametrosObjetoPipe } from './filtrar-parametros-objeto.pipe';

@NgModule({
	declarations: [
		FiltrarDescripcionPipe,
		FiltrarIdDescripcionPipe,
		FiltrarNombrePipe,
		SafeHtmlPipe,
		SafeHtmlStylePipe,
		SafeURLPipe,
		FiltrarParametrosObjetoPipe
	],
	imports: [CommonModule],
	exports: [
		FiltrarDescripcionPipe,
		FiltrarIdDescripcionPipe,
		FiltrarNombrePipe,
		SafeHtmlPipe,
		SafeHtmlStylePipe,
		SafeURLPipe,
		FiltrarParametrosObjetoPipe
	]
})

export class PipesModule { }
