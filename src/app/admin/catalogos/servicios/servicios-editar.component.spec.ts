import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosEditarComponent } from './servicios-editar.component';

describe('ServiciosEditarComponent', () => {
  let component: ServiciosEditarComponent;
  let fixture: ComponentFixture<ServiciosEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
