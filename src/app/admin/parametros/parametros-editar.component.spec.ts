import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosEditarComponent } from './parametros-editar.component';

describe('ParametrosEditarComponent', () => {
  let component: ParametrosEditarComponent;
  let fixture: ComponentFixture<ParametrosEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
