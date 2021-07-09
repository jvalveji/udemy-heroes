import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesServiciosModificarEditarComponent } from './materiales-servicios-modificar-editar.component';

describe('MaterialesServiciosModificarEditarComponent', () => {
  let component: MaterialesServiciosModificarEditarComponent;
  let fixture: ComponentFixture<MaterialesServiciosModificarEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialesServiciosModificarEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesServiciosModificarEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
