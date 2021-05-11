import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenciasUsuariosComponent } from './preferencias-usuarios.component';

describe('PreferenciasUsuariosComponent', () => {
  let component: PreferenciasUsuariosComponent;
  let fixture: ComponentFixture<PreferenciasUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenciasUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenciasUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
