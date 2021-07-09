import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosListarComponent } from './parametros-listar.component';

describe('ParametrosListarComponent', () => {
  let component: ParametrosListarComponent;
  let fixture: ComponentFixture<ParametrosListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
