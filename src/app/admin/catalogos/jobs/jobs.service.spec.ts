import { TestBed } from '@angular/core/testing';

import { JobsService } from './jobs.service';

describe('JobsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobsService = TestBed.inject(JobsService);
    expect(service).toBeTruthy();
  });
});
