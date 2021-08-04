import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTecnicaEditarComponent } from './ficha-tecnica-editar.component';

describe('FichaTecnicaEditarComponent', () => {
  let component: FichaTecnicaEditarComponent;
  let fixture: ComponentFixture<FichaTecnicaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaTecnicaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTecnicaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
