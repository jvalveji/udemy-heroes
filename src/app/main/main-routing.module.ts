// Definición typescript para el módulo MainRoutingModule v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado:

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importa los componentes del core base
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';

// Se declara una variable que contiene las rutas del módulo
const rutas: Routes = [
	{
		path: '', component: LayoutComponent, // Path para el layout que dibuja el sidenav
		children: [
			// Componentes
			{ path: '', component: HomeComponent }
		]
	}

];

@NgModule({
	imports: [RouterModule.forChild(rutas)],
	exports: [RouterModule]
})

export class MainRoutingModule { }
