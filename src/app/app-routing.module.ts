// Definición typescript para el módulo AppRoutingModule v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (08-07-2020) Ing. Dagoberto Gómez Jiménez

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importa los componentes creados
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ChatComponent } from './shared/controls/chat/chat.component';
import { TestComponent } from './test/test.component';
import { NotAuthorizedComponent } from './shared/controls/not-authorized/not-authorized.component';
import { NotFoundComponent } from './shared/controls/not-found/not-found.component';

// Se declara una variable que contiene las rutas del módulo
const rutas: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'bitzu' },
	{
		path: 'bitzu',
		children: [
			// Componentes
			{ path: '', pathMatch: 'full', redirectTo: 'home' },
			{ path: 'home', component: HomeComponent },
			{ path: 'about', component: AboutComponent },
			{ path: 'chat', component: ChatComponent },
			{ path: 'test', component: TestComponent },
			// Módulos
			{
				path: 'login',
				loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
			},
			{
				path: 'admin',
				loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
			},
			// Aquí se agrega el módulo principal del proyecto
			// La siguiente ruta llamada MAIN es eñ ejemplo inicial;
			// modifique esta línea por la del módulo principal de su proyecto
			// Ej.: Nutrición
			// {
			// 	path: 'main',
			// 	loadChildren: () => import('./nutricion/nutricion.module').then(m => m.NutricionModule),
			// },
			{
				path: 'main',
				loadChildren: () => import('./main/main.module').then(m => m.MainModule)
			},
			{ path: 'not-authorized', component: NotAuthorizedComponent },
			// Las siguientes 2 lineas de componente no encontrado SIEMPRE van de últimas
			{ path: '404', component: NotFoundComponent },
			{ path: '**', redirectTo: '404' }
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(rutas)],
	exports: [RouterModule],
})

export class AppRoutingModule { }
