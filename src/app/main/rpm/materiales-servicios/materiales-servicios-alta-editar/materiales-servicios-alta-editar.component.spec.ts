import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesServiciosAltaEditarComponent } from './materiales-servicios-alta-editar.component';

describe('MaterialesServiciosAltaEditarComponent', () => {
  let component: MaterialesServiciosAltaEditarComponent;
  let fixture: ComponentFixture<MaterialesServiciosAltaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialesServiciosAltaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesServiciosAltaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
