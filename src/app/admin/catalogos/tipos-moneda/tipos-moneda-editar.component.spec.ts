import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposMonedaEditarComponent } from './tipos-moneda-editar.component';

describe('MonedasEditarComponent', () => {
  let component: TiposMonedaEditarComponent;
  let fixture: ComponentFixture<TiposMonedaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposMonedaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposMonedaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
