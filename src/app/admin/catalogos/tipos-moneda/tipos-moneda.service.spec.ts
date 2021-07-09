import { TestBed } from '@angular/core/testing';

import { TiposMonedaService } from './tipos-moneda.service';

describe('TiposMonedaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TiposMonedaService = TestBed.get(TiposMonedaService);
    expect(service).toBeTruthy();
  });
});
