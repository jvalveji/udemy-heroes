import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciasEditarComponent } from './provincias-editar.component';

describe('ProvinciasEditarComponent', () => {
  let component: ProvinciasEditarComponent;
  let fixture: ComponentFixture<ProvinciasEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvinciasEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinciasEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
