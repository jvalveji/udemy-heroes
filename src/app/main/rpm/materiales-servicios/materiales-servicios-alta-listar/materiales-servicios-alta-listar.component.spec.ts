import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesServiciosAltaListarComponent } from './materiales-servicios-alta-listar.component';

describe('MaterialesServiciosAltaListarComponent', () => {
  let component: MaterialesServiciosAltaListarComponent;
  let fixture: ComponentFixture<MaterialesServiciosAltaListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialesServiciosAltaListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesServiciosAltaListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
