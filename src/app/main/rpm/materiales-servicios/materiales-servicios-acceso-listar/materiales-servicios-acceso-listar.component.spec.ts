import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesServiciosAccesoListarComponent } from './materiales-servicios-acceso-listar.component';

describe('MaterialesServiciosAccesoListarComponent', () => {
  let component: MaterialesServiciosAccesoListarComponent;
  let fixture: ComponentFixture<MaterialesServiciosAccesoListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialesServiciosAccesoListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesServiciosAccesoListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
