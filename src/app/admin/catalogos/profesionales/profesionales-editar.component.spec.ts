import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalesEditarComponent } from './profesionales-editar.component';

describe('ProfesionalesEditarComponent', () => {
  let component: ProfesionalesEditarComponent;
  let fixture: ComponentFixture<ProfesionalesEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesionalesEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesionalesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
