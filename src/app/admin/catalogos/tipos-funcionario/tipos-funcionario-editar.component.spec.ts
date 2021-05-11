import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposFuncionarioEditarComponent } from './tipos-funcionario-editar.component';

describe('TiposFuncionarioComponent', () => {
  let component: TiposFuncionarioEditarComponent;
  let fixture: ComponentFixture<TiposFuncionarioEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposFuncionarioEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposFuncionarioEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
