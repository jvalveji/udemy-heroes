import { TestBed } from '@angular/core/testing';

import { TiposPartidaPresupuestariaService } from './tipos-partida-presupuestaria.service';

describe('TiposPartidaPresupuestariaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TiposPartidaPresupuestariaService = TestBed.get(TiposPartidaPresupuestariaService);
    expect(service).toBeTruthy();
  });
});
