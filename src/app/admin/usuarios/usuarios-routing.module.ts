// Definición typescript para el módulo UsuariosRoutingModule v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importa los componentes
import { LayoutComponent } from './layout.component';
import { UsuariosListarComponent } from './usuarios-listar/usuarios-listar.component';
import { UsuariosEditarComponent } from './usuarios-editar/usuarios-editar.component';
import { PermisosUsuariosComponent } from './permisos-usuarios/permisos-usuarios.component';
import { PreferenciasUsuariosComponent } from './preferencias-usuarios/preferencias-usuarios.component';

// Se importa el servicio de validación de acceso a las rutas
import { AutorizacionService } from './../../shared/services/autorizacion.service';

// Se declara una variable que contiene las rutas del módulo
const rutas: Routes = [
	{
		path: '', component: LayoutComponent, // Path para el layout que dibuja el sidenav
		children: [
			{ path: '', component: UsuariosListarComponent, canActivate: [AutorizacionService] },
			{ path: 'editar', component: UsuariosEditarComponent, canActivate: [AutorizacionService] },
			{ path: 'permisos', component: PermisosUsuariosComponent, canActivate: [AutorizacionService] },
			{ path: 'preferencias', component: PreferenciasUsuariosComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(rutas)],
	exports: [RouterModule]
})

export class UsuariosRoutingModule { }
