import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaisesEditarComponent } from './paises-editar.component';

describe('PaisesEditarComponent', () => {
  let component: PaisesEditarComponent;
  let fixture: ComponentFixture<PaisesEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaisesEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaisesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
