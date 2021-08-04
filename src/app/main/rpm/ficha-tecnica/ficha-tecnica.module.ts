import {
	NgModule,
	CUSTOM_ELEMENTS_SCHEMA,
	NO_ERRORS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";

import { FichaTecnicaRoutingModule } from "./ficha-tecnica-routing.module";

// Importación de los componentes a utilizar

import { ArcaControlsModule } from "app/shared/controls/controls.module";
import { LayoutComponent } from "./layout.component";
import { FichaTecnicaComponent } from "./ficha-tecnica.component";

// Componentes Angular Material
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginatorModule } from "@angular/material/paginator";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Modulos extras
import { FlexLayoutModule } from "@angular/flex-layout"; // Modulo para crear efecto flex
import { NgxPageScrollModule } from "ngx-page-scroll";
import { NgxPageScrollCoreModule } from "ngx-page-scroll-core";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PipesModule } from "app/shared/pipes/pipes.module";
import { FichaTecnicaEditarComponent } from './ficha-tecnica-editar/ficha-tecnica-editar.component';

// Servicios

@NgModule({
	declarations: [LayoutComponent, FichaTecnicaComponent, FichaTecnicaEditarComponent],
	imports: [
		ArcaControlsModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FichaTecnicaRoutingModule,
		NgxPageScrollModule,
		NgxPageScrollCoreModule,
		PerfectScrollbarModule,
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
		MatPaginatorModule,
	],

	providers: [],

	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class FichaTecnicaModule {}
