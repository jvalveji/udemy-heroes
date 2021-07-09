import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoRhComponent } from './grupo-rh.component';

describe('GrupoRhComponent', () => {
  let component: GrupoRhComponent;
  let fixture: ComponentFixture<GrupoRhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoRhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
