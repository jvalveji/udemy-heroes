import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsEditarComponent } from './jobs-editar.component';

describe('JobsEditarComponent', () => {
  let component: JobsEditarComponent;
  let fixture: ComponentFixture<JobsEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
