import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesServiciosModificarListarComponent } from './materiales-servicios-modificar-listar.component';

describe('MaterialesServiciosModificarListarComponent', () => {
  let component: MaterialesServiciosModificarListarComponent;
  let fixture: ComponentFixture<MaterialesServiciosModificarListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialesServiciosModificarListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesServiciosModificarListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
