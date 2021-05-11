import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesProgramaticasInicioSesionComponent } from './unidades-programaticas-inicio-sesion.component';

describe('UnidadesProgramaticasInicioSesionComponent', () => {
  let component: UnidadesProgramaticasInicioSesionComponent;
  let fixture: ComponentFixture<UnidadesProgramaticasInicioSesionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnidadesProgramaticasInicioSesionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadesProgramaticasInicioSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
