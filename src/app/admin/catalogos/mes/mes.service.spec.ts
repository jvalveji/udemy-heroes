import { TestBed } from '@angular/core/testing';

import { MesService } from './mes.service';

describe('MesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MesService = TestBed.inject(MesService);
    expect(service).toBeTruthy();
  });
});
