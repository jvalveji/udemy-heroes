import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesServiciosBajaEditarComponent } from './materiales-servicios-baja-editar.component';

describe('MaterialesServiciosBajaEditarComponent', () => {
  let component: MaterialesServiciosBajaEditarComponent;
  let fixture: ComponentFixture<MaterialesServiciosBajaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialesServiciosBajaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesServiciosBajaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
