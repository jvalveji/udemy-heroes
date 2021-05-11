import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesMedidaEditarComponent } from './unidades-medida-editar.component';
import { MatIconModule } from '@angular/material/icon';

describe('UnidadesMedidaEditarComponent', () => {
  let component: UnidadesMedidaEditarComponent;
  let fixture: ComponentFixture<UnidadesMedidaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnidadesMedidaEditarComponent],
      imports: [MatIconModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadesMedidaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
