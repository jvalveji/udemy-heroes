import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCambioEditarComponent } from './tipo-cambio-editar.component';

describe('TipoCambioEditarComponent', () => {
  let component: TipoCambioEditarComponent;
  let fixture: ComponentFixture<TipoCambioEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoCambioEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoCambioEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
