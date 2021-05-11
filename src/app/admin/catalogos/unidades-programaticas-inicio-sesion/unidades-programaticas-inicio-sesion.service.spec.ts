import { TestBed } from '@angular/core/testing';

import { UnidadesProgramaticasInicioSesionService } from './unidades-programaticas-inicio-sesion.service';

describe('UnidadesProgramaticasInicioSesionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnidadesProgramaticasInicioSesionService = TestBed.inject(UnidadesProgramaticasInicioSesionService);
    expect(service).toBeTruthy();
  });
});
