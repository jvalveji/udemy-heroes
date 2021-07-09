import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediosContactoEditarComponent } from './medios-contacto-editar.component';

describe('MediosContactoEditarComponent', () => {
  let component: MediosContactoEditarComponent;
  let fixture: ComponentFixture<MediosContactoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediosContactoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediosContactoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
