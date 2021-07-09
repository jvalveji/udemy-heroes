// Definición typescript para el módulo LoginRoutingModule v3.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (15-06-2020) Ing. Dagoberto Gómez Jiménez

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importa los componente creados
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { CambioClaveComponent } from './cambio-clave/cambio-clave.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

// Se importa el servicio de autorización
import { AutorizacionService } from './../shared/services/autorizacion.service';

// Se declara una variable que contiene las rutas del módulo
const rutas: Routes = [
	{ path: '', component: InicioSesionComponent },
	{ path: 'cambio-clave/:usuario/:esMISE', component: CambioClaveComponent },
	{ path: 'reset-password', component: ResetPasswordComponent, canActivate: [AutorizacionService] }
];

@NgModule({
	imports: [RouterModule.forChild(rutas)],
	exports: [RouterModule]
})

export class LoginRoutingModule { }
