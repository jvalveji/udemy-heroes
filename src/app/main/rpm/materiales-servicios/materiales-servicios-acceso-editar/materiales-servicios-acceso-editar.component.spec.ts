import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesServiciosAccesoEditarComponent } from './materiales-servicios-acceso-editar.component';

describe('MaterialesServiciosAccesoEditarComponent', () => {
  let component: MaterialesServiciosAccesoEditarComponent;
  let fixture: ComponentFixture<MaterialesServiciosAccesoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialesServiciosAccesoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesServiciosAccesoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
