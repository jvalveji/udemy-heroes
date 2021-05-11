import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosCivilEditarComponent } from './estados-civil-editar.component';

describe('EstadosCivilEditarComponent', () => {
  let component: EstadosCivilEditarComponent;
  let fixture: ComponentFixture<EstadosCivilEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadosCivilEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadosCivilEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
