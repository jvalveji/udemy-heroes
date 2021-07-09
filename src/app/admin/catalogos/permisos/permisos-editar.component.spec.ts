import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisosEditarComponent } from './permisos-editar.component';

describe('PermisosEditarComponent', () => {
  let component: PermisosEditarComponent;
  let fixture: ComponentFixture<PermisosEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermisosEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
