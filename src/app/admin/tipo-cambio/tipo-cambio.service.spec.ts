import { TestBed } from '@angular/core/testing';

import { TipoCambioService } from './tipo-cambio.service';

describe('TipoCambioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipoCambioService = TestBed.get(TipoCambioService);
    expect(service).toBeTruthy();
  });
});
