import { TestBed } from '@angular/core/testing';

import { EtlsTaskService } from './etls-task.service';

describe('EtlsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EtlsTaskService = TestBed.inject(EtlsTaskService);
    expect(service).toBeTruthy();
  });
});
