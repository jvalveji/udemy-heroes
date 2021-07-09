// Definición typescript para el módulo MainModule v1.0.0
// Proyecto: Arca - MEAN
// Definiciones por: Ing. Dagoberto Gómez Jiménez <dgomezj@ccss.sa.cr>
// Modificado:

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../shared/pipes/pipes.module';
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
import { ArcaControlsModule } from '../shared/controls/controls.module';
import { ArcaDirectivesModule } from '../shared/directives/directives.module';
import { MainRoutingModule } from './main-routing.module';

// Importanción de los servicios requeridos
import { DialogService } from './../shared/controls/dialog/dialog.service';
import { UnidadesProgramaticasService } from './../admin/catalogos/unidades-programaticas/unidades-programaticas.service';

// Importa los componentes creados
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';
import { RpmModule } from './rpm/rpm.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
        ArcaControlsModule,
        ArcaDirectivesModule,
        MatStepperModule,
        MatTabsModule,
        MatProgressBarModule,
        PipesModule,
        MatMenuModule,
        MatChipsModule,
        MatDialogModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MainRoutingModule,
        RpmModule
    ],
    declarations: [LayoutComponent, HomeComponent],
    providers: [DialogService, UnidadesProgramaticasService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MainModule {}
