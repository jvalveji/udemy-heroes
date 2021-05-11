import { TestBed, inject } from '@angular/core/testing';

import { CambioClaveService } from './cambio-clave.service';
import { HttpClientModule } from '@angular/common/http';

describe('CambioClaveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CambioClaveService],
      imports: [
        HttpClientModule
      ]
    });
  });

  it('Servicio CAMBIO-CLAVE del componente CAMBIO-CLAVE creado!', inject([CambioClaveService], (service: CambioClaveService) => {
    expect(service).toBeTruthy();
  }));
});
