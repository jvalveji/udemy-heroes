import { TestBed } from '@angular/core/testing';

import { EtlsService } from './etls.service';

describe('EtlsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EtlsService = TestBed.inject(EtlsService);
    expect(service).toBeTruthy();
  });
});
