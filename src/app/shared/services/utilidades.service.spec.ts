import { TestBed, inject } from '@angular/core/testing';

import { UtilidadesService } from './utilidades.service';

// Se importan los módulos a utilizar en las pruebas
import { HttpClientModule } from '@angular/common/http';

describe('UtilidadesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [UtilidadesService]
    });
  });

  it('Servicio UTILIDADES del módulo SERVICES creado!', inject([UtilidadesService], (service: UtilidadesService) => {
    expect(service).toBeTruthy();
  }));
});
