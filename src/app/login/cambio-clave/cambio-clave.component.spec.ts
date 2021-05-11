import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Se importa el módulo para animaciones
import { FormsModule, ReactiveFormsModule} from '@angular/forms'; // Se incluye el módulo de formularios
import { RouterTestingModule } from '@angular/router/testing'; // Se incluye el módulo de ruteo
import { HttpClientModule } from '@angular/common/http';
import { CambioClaveComponent } from './cambio-clave.component';
import { CambioClaveService } from './cambio-clave.service'; // Se incluye el servicio LOGIN

describe('CambioClaveComponent', () => {
  let component: CambioClaveComponent;
  let fixture: ComponentFixture<CambioClaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioClaveComponent ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [CambioClaveService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Componente CAMBIO-CLAVE del módulo LOGIN creado!', () => {
    expect(component).toBeTruthy();
  });
});
