import { TestBed } from '@angular/core/testing';

import { PreferenciasUsuariosService } from './preferencias-usuarios.service';

describe('PreferenciasUsuariosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreferenciasUsuariosService = TestBed.inject(PreferenciasUsuariosService);
    expect(service).toBeTruthy();
  });
});
