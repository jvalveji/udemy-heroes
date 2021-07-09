import { TestBed, inject } from '@angular/core/testing';

import { HospitalizacionService } from './hospitalizacion.service';

// Se importan los módulos a utilizar en las pruebas
import { HttpClientModule } from '@angular/common/http';

describe('HospitalizacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HospitalizacionService]
    });
  });

  it('Servicio HOSPITALIZACION del módulo SERVICES creado!', inject([HospitalizacionService], (service: HospitalizacionService) => {
    expect(service).toBeTruthy();
  }));
});
