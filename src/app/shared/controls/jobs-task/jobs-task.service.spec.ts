import { TestBed } from '@angular/core/testing';

import { JobsTaskService } from './jobs-task.service';

describe('JobsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobsTaskService = TestBed.inject(JobsTaskService);
    expect(service).toBeTruthy();
  });
});
