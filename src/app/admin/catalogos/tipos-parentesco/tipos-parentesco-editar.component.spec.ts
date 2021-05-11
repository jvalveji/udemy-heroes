import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposParentescoEditarComponent } from './tipos-parentesco-editar.component';

describe('TiposParentescoEditarComponent', () => {
  let component: TiposParentescoEditarComponent;
  let fixture: ComponentFixture<TiposParentescoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposParentescoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposParentescoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
