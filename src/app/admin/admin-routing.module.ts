// Definición typescript para el módulo AdminRoutingModule v5.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importa los componentes del core base
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';
import { TokenComponent } from './token/token.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { ParametrosListarComponent } from './parametros/parametros-listar.component';
import { ParametrosEditarComponent } from './parametros/parametros-editar.component';
import { TipoCambioComponent } from './tipo-cambio/tipo-cambio.component';
import { TipoCambioEditarComponent } from './tipo-cambio/tipo-cambio-editar.component';
import { TiposMonedaEditarComponent } from './catalogos/tipos-moneda/tipos-moneda-editar.component';
import { BancosEditarComponent } from './catalogos/bancos/bancos-editar.component';

// Se importa el servicio de validación de acceso a las rutas
import { AutorizacionService } from './../shared/services/autorizacion.service';

// Se declara una variable que contiene las rutas del módulo
const rutas: Routes = [
	{
		path: '', component: LayoutComponent, // Path para el layout que dibuja el sidenav
		children: [
			// Componentes
			{ path: '', component: HomeComponent, canActivate: [AutorizacionService] },
			{
				path: 'parametros', component: ParametrosListarComponent, canActivateChild: [AutorizacionService],
				children: [
					{ path: 'editar', component: ParametrosEditarComponent }
				]
			},
			{ path: 'token', component: TokenComponent, canActivate: [AutorizacionService] },
			{ path: 'broadcast', component: BroadcastComponent, canActivate: [AutorizacionService] },
			{
				path: 'tipo-cambio', component: TipoCambioComponent,
				children: [
					{ path: 'editar', component: TipoCambioEditarComponent, canActivate: [AutorizacionService]  }
				]
			},
			{ path: 'tipos-moneda', component: TiposMonedaEditarComponent, canActivate: [AutorizacionService] },
			{ path: 'bancos', component: BancosEditarComponent, canActivate: [AutorizacionService] },
			// Módulos
			{
				path: 'catalogos',
				loadChildren: () => import('./catalogos/catalogos.module').then(m => m.CatalogosModule)
			},
			{
				path: 'usuarios',
				loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule)
			}
		]
	}

];

@NgModule({
	imports: [RouterModule.forChild(rutas)],
	exports: [RouterModule]
})

export class AdminRoutingModule { }
