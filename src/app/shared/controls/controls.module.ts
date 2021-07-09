// Definición typescript para el módulo ArcaControlsModule v4.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado: (22-06-2020) Ing. Dagoberto Gómez Jiménez

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Modulos extras
import { FlexLayoutModule } from '@angular/flex-layout'; // Modulo para crear efecto flex
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'; // Modulo para hacer scroll responsive
import { ClickOutsideModule } from 'ng-click-outside';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AmazingTimePickerModule } from './date-time-picker/atp-library/atp-time-picker.module';
import { NgxMaskModule } from 'ngx-mask'; //Importación para las mascaras a utilizar

// Se importa el módulo de directivas
import { ArcaDirectivesModule } from '../directives/directives.module';

// Importación de los componentes a utilizar
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { DialogComponent } from './dialog/dialog.component';
import { ArticulosSigesSearchComponent } from './articulos-siges-search/articulos-siges-search.component';
import { DiagnosticosSearchComponent } from './diagnosticos-search/diagnosticos-search.component';
import { ArchivosComponent } from './archivos/archivos.component';
import { PipesModule } from '../pipes/pipes.module';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { DialogoFiltroRangoFechasComponent } from './dialogo-filtro-rango-fechas/dialogo-filtro-rango-fechas.component';
import { ChatComponent } from './chat/chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { PersonasSearchComponent } from './personas-search/personas-search.component';
import { AseguradosSearchComponent } from './asegurados-search/asegurados-search.component';
import { DialogoAseguradosSearchComponent } from './asegurados-search/dialogo-asegurados-search.component';
import { DialogPersonasListarComponent } from './personas-search/dialog-personas-listar/dialog-personas-listar.component';
import { JobsTaskComponent } from './jobs-task/jobs-task.component';
import { EtlsTaskComponent } from './etls-task/etls-task.component';
import { PrinterComponent } from './printer/printer.component';
import { ViewFinderComponent } from './viewfinder/viewfinder.component';
import { SignatureFieldComponent } from './signature-field/signature-field.component';
import { DialogUsuariosListarComponent } from './usuarios-search/dialog-usuarios/dialog-usuarios-listar.component';
import { UsuariosSearchComponent } from './usuarios-search/usuarios-search.component';
import { InfoGeneralComponent } from './info-general/info-general.component';

// Importación de servicios a utilizar
import { PrinterService } from './printer/printer.service';
import { AmazingTimePickerService } from './date-time-picker/atp-library/atp-time-picker.service';
import { AtpCoreService } from './date-time-picker/atp-library/atp-core.service';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatToolbarModule,
		MatSidenavModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatInputModule,
		MatDialogModule,
		MatMenuModule,
		MatAutocompleteModule,
		FlexLayoutModule,
		PerfectScrollbarModule,
		ClickOutsideModule,
		MatTooltipModule,
		PipesModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSliderModule,
		MatTabsModule,
		MatBadgeModule,
		MatProgressBarModule,
		MatSelectModule,
		MatChipsModule,
		MatProgressSpinnerModule,
		ArcaDirectivesModule,
		SignaturePadModule,
		AmazingTimePickerModule,
		NgxMaskModule.forRoot({
			showMaskTyped : true,
		}
		),
	],
	declarations: [
		SidenavComponent,
		AutocompleteComponent,
		DialogComponent,
		DiagnosticosSearchComponent,
		ArchivosComponent,
		DateTimePickerComponent,
		ArticulosSigesSearchComponent,
		DialogoFiltroRangoFechasComponent,
		ChatComponent,
		DashboardComponent,
		ReportsComponent,
		PersonasSearchComponent,
		AseguradosSearchComponent,
		DialogoAseguradosSearchComponent,
		DialogPersonasListarComponent,
		JobsTaskComponent,
		EtlsTaskComponent,
		PrinterComponent,
		ViewFinderComponent,
		SignatureFieldComponent,
		UsuariosSearchComponent,
		DialogUsuariosListarComponent,
		NotAuthorizedComponent,
		NotFoundComponent,
		InfoGeneralComponent
	],
	bootstrap: [DialogoFiltroRangoFechasComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA], // Se declara un schema para los controles importados de angular material 2 o los creados manualmente
	exports: [
		SidenavComponent,
		AutocompleteComponent,
		DialogComponent,
		DiagnosticosSearchComponent,
		ArchivosComponent,
		DateTimePickerComponent,
		DialogoFiltroRangoFechasComponent,
		ChatComponent,
		ArticulosSigesSearchComponent,
		DashboardComponent,
		ReportsComponent,
		PersonasSearchComponent,
		AseguradosSearchComponent,
		DialogoAseguradosSearchComponent,
		DialogPersonasListarComponent,
		JobsTaskComponent,
		EtlsTaskComponent,
		PrinterComponent,
		ViewFinderComponent,
		SignatureFieldComponent,
		UsuariosSearchComponent,
		DialogUsuariosListarComponent,
		InfoGeneralComponent
	],
	providers: [
		{
			provide: MAT_DIALOG_DATA,
			useValue: {}
		},
		PrinterService,
		AmazingTimePickerService,
		AtpCoreService
	]
})

export class ArcaControlsModule { }
