import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsTaskComponent } from './jobs-task.component';

describe('JobsComponent', () => {
  let component: JobsTaskComponent;
  let fixture: ComponentFixture<JobsTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
