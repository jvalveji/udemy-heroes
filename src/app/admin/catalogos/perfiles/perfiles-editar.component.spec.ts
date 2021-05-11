import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesEditarComponent } from './perfiles-editar.component';

describe('PerfilesEditarComponent', () => {
  let component: PerfilesEditarComponent;
  let fixture: ComponentFixture<PerfilesEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilesEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
