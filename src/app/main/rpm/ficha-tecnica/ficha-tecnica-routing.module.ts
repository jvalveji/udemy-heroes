// Definición typescript para el módulo RpmRoutingModule v1.0.0
// Proyecto: Bitzu RPM - MEAN
// Definiciones por: Ing. Michael Alexander Jiménez Muñoz <majimenj@ccss.sa.cr>
// Modificado: (08-07-2021) Ing. Michael Alexander Jiménez Muñoz

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FichaTecnicaComponent } from "./ficha-tecnica.component";

// Importa los componentes creados

import { LayoutComponent } from "./layout.component";
//import { MaterialesServiciosAltaListarComponent } from './materiales-servicios-alta-listar/materiales-servicios-alta-listar.component';

// Se declara una variable que contiene las rutas del módulo
const rutas: Routes = [
	{
		path: "",
		component: LayoutComponent,

		children: [
			// Componentes
			{ path: "", component: FichaTecnicaComponent },
			//{ path: 'alta', component: MaterialesServiciosAltaListarComponent },

			// { path: 'acceso', component:  }

			// { path: 'not-authorized', component: NotAuthorizedComponent },
			// // Las siguientes 2 lineas de componente no encontrado SIEMPRE van de últimas
			// { path: '404', component: NotFoundComponent },
			// { path: '**', redirectTo: '404' }
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(rutas)],
	exports: [RouterModule],
})
export class FichaTecnicaRoutingModule {}
