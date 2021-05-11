import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposIdentificacionEditarComponent } from './tipos-identificacion-editar.component';

describe('TiposIdentificacionEditarComponent', () => {
  let component: TiposIdentificacionEditarComponent;
  let fixture: ComponentFixture<TiposIdentificacionEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposIdentificacionEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposIdentificacionEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
