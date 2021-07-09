import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoSIGESComponent } from './proceso-siges.component';

describe('ProcesoSIGESComponent', () => {
  let component: ProcesoSIGESComponent;
  let fixture: ComponentFixture<ProcesoSIGESComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesoSIGESComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoSIGESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
