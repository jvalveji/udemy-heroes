import { TestBed } from '@angular/core/testing';

import { PermisosService } from './permisos.service';

describe('PermisosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PermisosService = TestBed.inject(PermisosService);
    expect(service).toBeTruthy();
  });
});
