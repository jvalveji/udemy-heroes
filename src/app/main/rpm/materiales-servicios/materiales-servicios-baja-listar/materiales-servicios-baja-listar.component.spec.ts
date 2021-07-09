import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesServiciosBajaListarComponent } from './materiales-servicios-baja-listar.component';

describe('MaterialesServiciosBajaListarComponent', () => {
  let component: MaterialesServiciosBajaListarComponent;
  let fixture: ComponentFixture<MaterialesServiciosBajaListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialesServiciosBajaListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesServiciosBajaListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
