// Definición typescript para el módulo CatalogosModule v2.1.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (28-07-2020) Ing. Dagoberto Gómez Jiménez

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
import { MatPaginatorModule } from '@angular/material/paginator';

// Modulos extras
import { FlexLayoutModule } from '@angular/flex-layout'; // Modulo para crear efecto flex
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'; // Modulo para hacer scroll responsive

// Importación de los módulos del proyecto
import { ArcaControlsModule } from './../../shared/controls/controls.module';
import { ArcaDirectivesModule } from './../../shared/directives/directives.module';
import { CatalogosRoutingModule } from './catalogos-routing.module';

// Se importan los servicios del core base
import { CatalogosService } from './catalogos.service';
import { GrupoRHService } from './grupo-rh/grupo-rh.service';
import { UnidadesMedidaService } from './unidades-medida/unidades-medida.service';
import { CantonesService } from './cantones/cantones.service';
import { DistritosService } from './distritos/distritos.service';
import { EspecialidadesService } from './especialidades/especialidades.service';
import { EstadosCivilService } from './estados-civil/estados-civil.service';
import { GenerosService } from './generos/generos.service';
import { MediosContactoService } from './medios-contacto/medios-contacto.service';
import { PaisesService } from './paises/paises.service';
import { PathsService } from './paths/paths.service';
import { PerfilesService } from './perfiles/perfiles.service';
import { ProfesionalesService } from './profesionales/profesionales.service';
import { ProvinciasService } from './provincias/provincias.service';
import { ServiciosService } from './servicios/servicios.service';
import { TiposFuncionarioService } from './tipos-funcionario/tipos-funcionario.service';
import { TiposIdentificacionService } from './tipos-identificacion/tipos-identificacion.service';
import { TiposParentescoService } from './tipos-parentesco/tipos-parentesco.service';
import { UnidadesProgramaticasService } from './unidades-programaticas/unidades-programaticas.service';
import { UnidadesProgramaticasInicioSesionService } from './unidades-programaticas-inicio-sesion/unidades-programaticas-inicio-sesion.service';
import { AplicacionesService } from './aplicaciones/aplicaciones.service';
import { ArticulosService } from './articulos/articulos.service';
import { DocumentoPrinterService } from './documento-printer/documento-printer.service';
import { PermisosService } from './permisos/permisos.service';
import { TiposMonedaService } from './tipos-moneda/tipos-moneda.service';

// Importa los componentes del core base
import { LayoutComponent } from './layout.component';
import { CatalogosListarComponent } from './catalogos-listar/catalogos-listar.component';
import { GenerosEditarComponent } from './generos/generos-editar.component';
import { EstadosCivilEditarComponent } from './estados-civil/estados-civil-editar.component';
import { MediosContactoEditarComponent } from './medios-contacto/medios-contacto-editar.component';
import { UnidadesMedidaEditarComponent } from './unidades-medida/unidades-medida-editar.component';
import { UnidadesProgramaticasEditarComponent } from './unidades-programaticas/unidades-programaticas-editar.component';
import { TiposIdentificacionEditarComponent } from './tipos-identificacion/tipos-identificacion-editar.component';
import { PathsEditarComponent } from './paths/paths-editar.component';
import { PerfilesEditarComponent } from './perfiles/perfiles-editar.component';
import { DiagnosticosComponent } from './diagnosticos/diagnosticos.component';
import { TiposParentescoEditarComponent } from './tipos-parentesco/tipos-parentesco-editar.component';
import { ServiciosEditarComponent } from './servicios/servicios-editar.component';
import { PaisesEditarComponent } from './paises/paises-editar.component';
import { ProfesionalesEditarComponent } from './profesionales/profesionales-editar.component';
import { ProvinciasEditarComponent } from './provincias/provincias-editar.component';
import { DistritosEditarComponent } from './distritos/distritos-editar.component';
import { CantonesEditarComponent } from './cantones/cantones-editar.component';
import { EspecialidadesEditarComponent } from './especialidades/especialidades-editar.component';
import { TiposFuncionarioEditarComponent } from './tipos-funcionario/tipos-funcionario-editar.component';
import { GrupoRhComponent } from './grupo-rh/grupo-rh.component';
import { JobsEditarComponent } from './jobs/jobs-editar.component';
import { EtlsEditarComponent } from './etls/etls-editar.component';
import { UnidadesProgramaticasInicioSesionComponent } from './unidades-programaticas-inicio-sesion/unidades-programaticas-inicio-sesion.component';
import { DocumentoPrinterComponent } from './documento-printer/documento-printer.component';
import { PermisosEditarComponent } from './permisos/permisos-editar.component';
import { PrinterConfigComponent } from './printer-config/printer-config.component';
import { TiposMonedaEditarComponent } from './tipos-moneda/tipos-moneda-editar.component';
import { BancosEditarComponent } from './bancos/bancos-editar.component';
import { TiposPartidaPresupuestariaComponent } from './tipos-partida-presupuestaria/tipos-partida-presupuestaria.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ArcaControlsModule,
		ArcaDirectivesModule,
		CatalogosRoutingModule,
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
		MatProgressSpinnerModule,
		MatPaginatorModule
	],
	declarations: [
		LayoutComponent,
		CatalogosListarComponent,
		UnidadesProgramaticasEditarComponent,
		GenerosEditarComponent,
		MediosContactoEditarComponent,
		EstadosCivilEditarComponent,
		UnidadesMedidaEditarComponent,
		TiposIdentificacionEditarComponent,
		PathsEditarComponent,
		PerfilesEditarComponent,
		DiagnosticosComponent,
		TiposParentescoEditarComponent,
		ServiciosEditarComponent,
		PaisesEditarComponent,
		ProfesionalesEditarComponent,
		ProvinciasEditarComponent,
		DistritosEditarComponent,
		CantonesEditarComponent,
		TiposFuncionarioEditarComponent,
		EspecialidadesEditarComponent,
		TiposFuncionarioEditarComponent,
		GrupoRhComponent,
		JobsEditarComponent,
		EtlsEditarComponent,
		UnidadesProgramaticasInicioSesionComponent,
		DocumentoPrinterComponent,
		PermisosEditarComponent,
		PrinterConfigComponent,
		TiposMonedaEditarComponent,
		BancosEditarComponent,
		TiposPartidaPresupuestariaComponent
	],
	providers: [
		CatalogosService,
		GrupoRHService,
		UnidadesMedidaService,
		CantonesService,
		DistritosService,
		EspecialidadesService,
		EstadosCivilService,
		GenerosService,
		MediosContactoService,
		PaisesService,
		PathsService,
		PerfilesService,
		ProfesionalesService,
		ProvinciasService,
		ServiciosService,
		TiposFuncionarioService,
		TiposIdentificacionService,
		TiposParentescoService,
		UnidadesMedidaService,
		UnidadesProgramaticasService,
		UnidadesProgramaticasInicioSesionService,
		ArticulosService,
		AplicacionesService,
		DocumentoPrinterService,
		PermisosService,
		TiposMonedaService
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA] // Se declara un schema para los controles importados de angular material 2 o los creados manualmente
})
export class CatalogosModule { }
