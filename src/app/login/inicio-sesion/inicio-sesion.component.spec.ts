import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Se importa el módulo para animaciones
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Se incluye el módulo de formularios
import { HttpClientModule } from '@angular/common/http';
import { // importa el modulo para el control "toolbar" de angular material 2
MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { // importa el modulo para el control "button" de angular material 2
MatSnackBarModule } from '@angular/material/snack-bar';
import { // importa el modulo para el control "input" de angular material 2,
MatToolbarModule } from '@angular/material/toolbar'; // Se incluye el módulo de angular material 2
import { RouterTestingModule } from '@angular/router/testing'; // Se incluye el módulo de ruteo
import { InicioSesionComponent } from './inicio-sesion.component'; // Se importa el componente
import { ArcaControlsModule } from '../../../shared/controls/controls.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InicioSesionService } from './inicio-sesion.service';
import { AutorizacionService } from '../../../shared/services/autorizacion.service';
import { UtilidadesService } from '../../../shared/services/utilidades.service';
import { DialogService } from '../../../shared/controls/dialog/dialog.service';

describe('InicioSesionComponent', () => {
  let component: InicioSesionComponent;
  let fixture: ComponentFixture<InicioSesionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InicioSesionComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatInputModule, // importa el modulo para el control "input" de angular material 2,
        MatToolbarModule, // importa el modulo para el control "toolbar" de angular material 2
        MatButtonModule, // importa el modulo para el control "button" de angular material 2
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatProgressBarModule,
        ArcaControlsModule,
        RouterTestingModule
      ],
      providers: [InicioSesionService,
        AutorizacionService,
        UtilidadesService,
        DialogService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Componente INICIO-SESION del módulo LOGIN creado!', () => {
    expect(component).toBeTruthy();
  });

  /*it('should create a `FormControl` for each question', () => {
        component.questions = [
            {
                controlType: 'text',
                id: 'first',
                label: 'My First',
                required: false
            },
            {
                controlType: 'text',
                id: 'second',
                label: 'Second!',
                required: true
            }
        ];
        component.ngOnInit();

        expect(Object.keys(component.formGroup.controls)).toEqual([
            'first', 'second'
        ]);
    });*/
});
