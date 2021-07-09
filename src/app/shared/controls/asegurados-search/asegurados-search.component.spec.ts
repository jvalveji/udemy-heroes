import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AseguradosSearchComponent } from './asegurados-search.component';

describe('AseguradosSearchComponent', () => {
  let component: AseguradosSearchComponent;
  let fixture: ComponentFixture<AseguradosSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AseguradosSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AseguradosSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
