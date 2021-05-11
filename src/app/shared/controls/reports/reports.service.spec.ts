import { TestBed } from '@angular/core/testing';

import { ReportsPentahoService } from './reports.service';

describe('ReportsPentahoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportsPentahoService = TestBed.inject(ReportsPentahoService);
    expect(service).toBeTruthy();
  });
});
