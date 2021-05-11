// Definición typescript para el módulo UsuariosModule v2.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (19-06-2020) Ing. Dagoberto Gómez Jiménez

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './../../shared/pipes/pipes.module';

// Componentes Angular Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Modulos extras
import { FlexLayoutModule } from '@angular/flex-layout'; // Modulo para crear efecto flex
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'; // Modulo para hacer scroll responsive

// Importación de los módulos del proyecto
import { ArcaControlsModule } from './../../shared/controls/controls.module';
import { ArcaDirectivesModule } from './../../shared/directives/directives.module';
import { UsuariosRoutingModule } from './usuarios-routing.module';

// Se importan los servicios
import { MediosContactoService } from '../catalogos/medios-contacto/medios-contacto.service';

// Importa los componentes
import { LayoutComponent } from './layout.component';
import { UsuariosListarComponent } from './usuarios-listar/usuarios-listar.component';
import { UsuariosEditarComponent } from './usuarios-editar/usuarios-editar.component';
import { PermisosUsuariosComponent } from './permisos-usuarios/permisos-usuarios.component';
import { PreferenciasUsuariosComponent } from './preferencias-usuarios/preferencias-usuarios.component';
import { TiposIdentificacionService } from '../catalogos/tipos-identificacion/tipos-identificacion.service';
import { GenerosService } from '../catalogos/generos/generos.service';
import { PermisosService } from '../catalogos/permisos/permisos.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ArcaControlsModule,
		ArcaDirectivesModule,
		UsuariosRoutingModule,
		MatSlideToggleModule,
		MatToolbarModule,
		MatSidenavModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatTooltipModule,
		MatExpansionModule,
		MatListModule,
		MatAutocompleteModule,
		MatSnackBarModule,
		MatRadioModule,
		MatCheckboxModule,
		FlexLayoutModule,
		PerfectScrollbarModule,
		MatStepperModule,
		MatTabsModule,
		MatProgressBarModule,
		PipesModule,
		MatMenuModule,
		MatChipsModule,
		MatDialogModule,
		MatTableModule,
		MatProgressSpinnerModule
	],
	declarations: [
		LayoutComponent,
		UsuariosListarComponent,
		UsuariosEditarComponent,
		PermisosUsuariosComponent,
		PreferenciasUsuariosComponent
	],
	providers: [
		MediosContactoService,
		TiposIdentificacionService,
		GenerosService,
		PermisosService
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA] // Se declara un schema para los controles importados de angular material 2 o los creados manualmente
})
export class UsuariosModule { }
