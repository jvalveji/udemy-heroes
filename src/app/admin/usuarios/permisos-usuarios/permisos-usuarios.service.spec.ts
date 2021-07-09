import { TestBed, inject } from '@angular/core/testing';

import { PermisosUsuariosService } from './permisos-usuarios.service';

describe('PermisosUsuariosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermisosUsuariosService]
    });
  });

  it('should be created', inject([PermisosUsuariosService], (service: PermisosUsuariosService) => {
    expect(service).toBeTruthy();
  }));
});
