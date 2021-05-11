import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesProgramaticasEditarComponent } from './unidades-programaticas-editar.component';

describe('UnidadProgramaticaEditarComponent', () => {
  let component: UnidadesProgramaticasEditarComponent;
  let fixture: ComponentFixture<UnidadesProgramaticasEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnidadesProgramaticasEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadesProgramaticasEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
