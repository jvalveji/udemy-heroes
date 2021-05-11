// Definición typescript para el módulo LoginModule v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (22-06-2020) Ing. Dagoberto Gómez Jiménez

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'; // para incluir elementos customizados (angular material2)
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Componentes Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';

// Modulos extras
import { FlexLayoutModule } from '@angular/flex-layout'; // Modulo para crear efecto flex

// Importación de los módulos del proyecto
import { ArcaControlsModule } from '../shared/controls/controls.module';
import { LoginRoutingModule } from './login-routing.module';
import { PipesModule } from './../shared/pipes/pipes.module';

// Carga los componentes
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { CambioClaveComponent } from './cambio-clave/cambio-clave.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

// Se importa el servicio que provee los permisos del usuario
import { PermisosUsuariosService } from './../admin/usuarios/permisos-usuarios/permisos-usuarios.service';

// Se importa los servicios a utilizar en el módulo
import { InicioSesionService } from './inicio-sesion/inicio-sesion.service';
import { CambioClaveService } from './cambio-clave/cambio-clave.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatToolbarModule,
		MatButtonModule,
		MatSnackBarModule,
		MatIconModule,
		MatCardModule,
		MatStepperModule,
		MatProgressBarModule,
		MatSlideToggleModule,
		FlexLayoutModule,
		ArcaControlsModule,
		LoginRoutingModule,
		PipesModule
	],
	declarations: [
		InicioSesionComponent,
		CambioClaveComponent,
		ResetPasswordComponent
	],
	providers: [
		PermisosUsuariosService,
		InicioSesionService,
		CambioClaveService
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})

export class LoginModule { }
