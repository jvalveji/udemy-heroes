import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialidadesEditarComponent } from './especialidades-editar.component';

describe('EspecialidadesComponent', () => {
  let component: EspecialidadesEditarComponent;
  let fixture: ComponentFixture<EspecialidadesEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspecialidadesEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecialidadesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
